import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  Collapse,
  Card,
  CircularProgress,
} from "@mui/material";

const ImageToText = () => {
  const theme = useTheme();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/gemini/image-to-text", {
        imageUrl
      });

      if (data.success) {
        setDescription(data.description);
        toast.success("Image analyzed successfully!");
      } else {
        setError(data.message || "Failed to analyze image");
        toast.error(data.message || "Failed to analyze image");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      const errorMessage = err.response?.data?.message || "Error analyzing image";
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

        <TextField
          placeholder="Enter image URL..."
          type="url"
          required
          margin="normal"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ color: "white", mt: 2 }}
          disabled={loading || !imageUrl.trim()}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze Image"}
        </Button>
        <Typography mt={2}>
          Not this tool? <Link to="/">GO BACK</Link>
        </Typography>
      </form>

      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {imageUrl && (
          <Card
            sx={{
              border: 1,
              boxShadow: 0,
              borderRadius: 5,
              borderColor: "natural.medium",
              bgcolor: "background.default",
              overflow: "hidden"
            }}
          >
            <img 
              src={imageUrl} 
              alt="Uploaded content" 
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'contain' 
              }} 
            />
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
            p: 2
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
              {loading ? "Analyzing image..." : "Image description will appear here"}
            </Typography>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default ImageToText;