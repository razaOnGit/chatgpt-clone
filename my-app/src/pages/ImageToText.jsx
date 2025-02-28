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
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist/build/pdf"; // For PDF handling
import CameraSwitch from '@mui/icons-material/CameraSwitch'; // Import the CameraSwitch icon

// Set worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ImageToText = () => {
  const theme = useTheme();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");

  const [fileUrl, setFileUrl] = useState(""); // Base64 data URL for image or PDF
  const [fileType, setFileType] = useState(""); // "image" or "pdf"
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState("user");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Add a mounted ref to track component mounting state
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle file selection (image or PDF)
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image (JPEG/PNG) or PDF file.");
      toast.error("Invalid file type.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileUrl(event.target.result);
      setFileType(file.type.startsWith("image") ? "image" : "pdf");
      setError("");
      setDescription("");
      setCameraActive(false);
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      toast.error("File reading error.");
    };
    reader.readAsDataURL(file);
  };

  // Start camera with better initialization
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera not supported in this browser.");
      toast.error("Camera not supported.");
      return;
    }

    try {
      setCameraActive(true);
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!mounted.current || !videoRef.current) {
        throw new Error("Video element not initialized");
      }

      // Use facingMode state here
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: facingMode
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded");
            videoRef.current.play()
              .then(resolve)
              .catch(e => {
                console.error("Play error:", e);
                throw e;
              });
          };
        });
      }

      setFileUrl("");
      setFileType("");
      setDescription("");
      setError("");
    } catch (err) {
      console.error("Camera error:", err);
      setError(`Camera access denied or unavailable: ${err.message}`);
      toast.error("Camera access denied.");
      setCameraActive(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Capture image from camera
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setFileUrl(dataUrl);
    setFileType("image");
    stopCamera();
  };

  const switchCamera = async () => {
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    
    // Toggle facing mode
    setFacingMode(current => current === "user" ? "environment" : "user");
    
    // Restart camera with new facing mode
    await startCamera();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl) {
      setError("Please select a file or capture an image first.");
      toast.error("No file provided.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      let imageUrl = fileUrl;

      // If it's a PDF, extract the first page as an image
      if (fileType === "pdf") {
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;
        imageUrl = canvas.toDataURL("image/jpeg");
      }

      const { data } = await axios.post("/api/gemini/ImageToText", {
        imageUrl, // Base64 data URL
      });

      if (data.success) {
        setDescription(data.description);
        toast.success("File analyzed successfully!");
      } else {
        setError(data.message || "Failed to analyze file");
        toast.error(data.message || "Failed to analyze file");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      const errorMessage = err.response?.data?.message || "Error analyzing file";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      width={isNotMobile ? "40%" : "80%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={5}
      sx={{ boxShadow: 5 }}
      backgroundColor={theme.palette.background.alt}
    >
      <Collapse in={Boolean(error)}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>
      <form onSubmit={handleSubmit}>
        <Typography variant="h3">Image to Text</Typography>

        <Box sx={{ mt: 2 }}>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,application/pdf"
            style={{ display: "none" }}
            onChange={handleFileSelect}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={() => fileInputRef.current.click()}
            sx={{ mr: 1 }}
            disabled={loading || cameraActive}
          >
            Choose File
          </Button>
          <Button
            variant="contained"
            onClick={cameraActive ? stopCamera : startCamera}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            {cameraActive ? "Stop Camera" : "Open Camera"}
          </Button>
        </Box>

        {cameraActive && (
          <Box sx={{ mt: 2 }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "5px",
                backgroundColor: "#000",
                minHeight: "300px",
                display: "block", // Ensure video is block-level element
                margin: "0 auto" // Center the video
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
            />
            <Box sx={{ 
              mt: 1, 
              display: 'flex', 
              gap: 1,
              justifyContent: 'center' 
            }}>
              <Button
                variant="contained"
                onClick={captureImage}
                disabled={loading}
              >
                Capture
              </Button>
              <Button
                variant="contained"
                onClick={switchCamera}
                disabled={loading}
                startIcon={<CameraSwitch />}
              >
                Switch Camera
              </Button>
            </Box>
          </Box>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ color: "white", mt: 2 }}
          disabled={loading || !fileUrl}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze File"}
        </Button>
        <Typography mt={2}>
          Not this tool? <Link to="/Homepage">GO BACK</Link>
        </Typography>
      </form>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {fileUrl && (
          <Card
            sx={{
              border: 1,
              boxShadow: 0,
              borderRadius: 5,
              borderColor: "natural.medium",
              bgcolor: "background.default",
              overflow: "hidden",
            }}
          >
            {fileType === "image" ? (
              <img
                src={fileUrl}
                alt="Uploaded or Captured content"
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <iframe
                src={fileUrl}
                title="PDF Preview"
                style={{ width: "100%", height: "300px", border: "none" }}
              />
            )}
          </Card>
        )}

        <Card
          sx={{
            border: 1,
            boxShadow: 0,
            minHeight: "200px",
            borderRadius: 5,
            borderColor: "natural.medium",
            bgcolor: "background.default",
            p: 2,
          }}
        >
          {description ? (
            <Typography>{description}</Typography>
          ) : (
            <Typography
              variant="h5"
              color="natural.main"
              sx={{
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: "180px",
              }}
            >
              {loading ? "Analyzing file..." : "File description will appear here"}
            </Typography>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default ImageToText;