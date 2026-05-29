import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  Alert,
  Collapse,
  Card,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import Cameraswitch from '@mui/icons-material/Cameraswitch';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

// FIX: External CDN worker ko hata kar internal legacy built-in fake worker force kiya taaki 404 crash kabhi na ho
import * as pdfjsLib from "pdfjs-dist/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = ""; 

const ImageToText = () => {
  const theme = useTheme();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");

  const [fileUrl, setFileUrl] = useState(""); 
  const [fileType, setFileType] = useState(""); 
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [inputText, setInputText] = useState("");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setError("Please select a valid image or PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileUrl(event.target.result);
      setFileType(file.type.startsWith("image") ? "image" : "pdf");
      setError(""); setDescription(""); setCameraActive(false);
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileUrl(reader.result);
          setFileType("audio");
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setError(""); setDescription(""); setFileUrl("");
    } catch (err) {
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode }
      });
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.onloadedmetadata = () => videoRef.current.play().catch(e => console.error(e));
    } catch (err) {
      setError("Camera access denied.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    setCameraActive(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setFileUrl(canvas.toDataURL("image/jpeg"));
    setFileType("image");
    stopCamera();
  };

  const handleSubmit = async () => {
    if (!fileUrl) return setError("Please supply media first.");
    setLoading(true); setError("");

    try {
      let payloadUrl = fileUrl;

      // FIX: Robust base64 array extraction from locally fallback fake-worker
      if (fileType === "pdf") {
        const base64Raw = fileUrl.split(",")[1];
        const binaryString = atob(base64Raw);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        payloadUrl = canvas.toDataURL("image/jpeg");
      }

      const finalPrompt = inputText.trim() ? inputText : (fileType === "audio" ? "Transcribe and summarize this audio clip" : "Describe this content in detail");

      const { data } = await axios.post("/api/gemini/ImageToText", {
        imageUrl: payloadUrl, 
        prompt: finalPrompt
      });

      if (data.success) {
        setDescription(data.response || data.summary);
        toast.success("Processed successfully!");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error analyzing content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box width={isNotMobile ? "40%" : "80%"} p={"2rem"} m={"2rem auto"} borderRadius={5} sx={{ boxShadow: 5 }} backgroundColor={theme.palette.background.alt}>
      <Collapse in={Boolean(error)}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Collapse>

      <Typography variant="h3" sx={{ mb: 3 }}>Multimodal Playground</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,application/pdf" style={{ display: "none" }} onChange={handleFileSelect} disabled={loading} />
        <Button variant="contained" onClick={() => fileInputRef.current.click()} disabled={loading || cameraActive || recording}>
          Upload File
        </Button>
        <Button variant="contained" onClick={cameraActive ? stopCamera : startCamera} disabled={loading || recording}>
          {cameraActive ? "Stop Cam" : "Camera"}
        </Button>
        
        <IconButton color={recording ? "error" : "primary"} onClick={recording ? stopRecording : startRecording} disabled={loading || cameraActive} sx={{ border: "1px solid", p: 1 }}>
          {recording ? <StopIcon /> : <MicIcon />}
        </IconButton>
        {recording && <Typography variant="caption" color="error">Recording...</Typography>}
      </Box>

      {cameraActive && (
        <Box sx={{ mb: 3 }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", borderRadius: "5px", backgroundColor: "#000", minHeight: "250px" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <Box sx={{ mt: 1, display: "flex", gap: 1, justifyContent: "center" }}>
            <Button variant="contained" onClick={captureImage} startIcon={<PhotoCamera />}>Capture</Button>
            <Button variant="contained" onClick={async () => { stopCamera(); setFacingMode(c => c === "user" ? "environment" : "user"); await startCamera(); }} startIcon={<Cameraswitch />}>Switch</Button>
          </Box>
        </Box>
      )}

      {fileUrl && (
        <Card sx={{ border: 1, borderRadius: 5, borderColor: "natural.medium", bgcolor: "background.default", p: fileType === "audio" ? 2 : 0, overflow: "hidden", mb: 3 }}>
          {fileType === "image" && <img src={fileUrl} alt="Preview" style={{ width: "100%", height: "250px", objectFit: "contain" }} />}
          {fileType === "pdf" && <iframe src={fileUrl} title="PDF" style={{ width: "100%", height: "250px", border: "none" }} />}
          {fileType === "audio" && <audio src={fileUrl} controls style={{ width: "100%" }} />}
        </Card>
      )}

      {fileUrl && (
        <Box sx={{ mb: 3 }}>
          <TextField fullWidth variant="outlined" placeholder={fileType === "audio" ? "Ask something about this voice note..." : "Ask something about this media..."} value={inputText} onChange={(e) => setInputText(e.target.value)} multiline rows={2} />
        </Box>
      )}

      {fileUrl && (
        <Button fullWidth variant="contained" size="large" sx={{ color: "white", mb: 3 }} onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit to Gemini"}
        </Button>
      )}

      {description && (
        <Card sx={{ border: 1, borderRadius: 5, borderColor: "natural.medium", bgcolor: "background.default", p: 2, whiteSpace: "pre-wrap" }}>
          <Typography>{description}</Typography>
        </Card>
      )}

      <Typography mt={2}>
        Not this tool? <Link to="/Homepage">GO BACK</Link>
      </Typography>
    </Box>
  );
};

export default ImageToText;