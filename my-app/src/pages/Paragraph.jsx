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

const Paragraph = () => {
  const theme = useTheme();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  
  const [text, setText] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/gemini/paragraph", {
        topic: text,
        tone: "informative",
        length: "medium"
      });

      if (data.success) {
        setParagraph(data.paragraph);
        toast.success("Paragraph generated successfully!");
      } else {
        setError(data.message || "Failed to generate paragraph");
        toast.error(data.message || "Failed to generate paragraph");
      }
    } catch (err) {
      console.error("Generation error:", err);
      const errorMessage = err.response?.data?.message || "Error generating paragraph";
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
        <Typography variant="h3">Generate Paragraph</Typography>

        <TextField
          placeholder="Enter a topic for paragraph generation..."
          type="text"
          multiline
          rows={4}
          required
          margin="normal"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ color: "white", mt: 2 }}
          disabled={loading || !text.trim()}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Generate"}
        </Button>
        <Typography mt={2}>
          Not this tool? <Link to="/Homepage">GO BACK</Link>
        </Typography>
      </form>

      <Card
        sx={{
          mt: 4,
          border: 1,
          boxShadow: 0,
          height: "500px",
          borderRadius: 5,
          borderColor: "natural.medium",
          bgcolor: "background.default",
          overflow: "auto",
        }}
      >
        {paragraph ? (
          <Typography p={2}>{paragraph}</Typography>
        ) : (
          <Typography
            variant="h5"
            color="natural.main"
            sx={{
              textAlign: "center",
              verticalAlign: "middle",
              lineHeight: "450px",
            }}
          >
            {loading ? "Generating..." : "Your Paragraph Will Appear Here"}
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default Paragraph;