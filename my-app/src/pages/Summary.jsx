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

const Summary = () => {
  const theme = useTheme();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/gemini/summarize", {
        text: text
      });

      if (data.success) {
        setSummary(data.summary);
        toast.success("Text summarized successfully!");
      } else {
        setError(data.message || "Failed to summarize text");
        toast.error(data.message || "Failed to summarize text");
      }
    } catch (err) {
      console.error("Summarization error:", err);
      const errorMessage = err.response?.data?.message || "Error summarizing text";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      width={isNotMobile ? "80%" : "95%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={5}
      sx={{ 
        boxShadow: 5,
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column"
      }}
      backgroundColor={theme.palette.background.alt}
    >
      <Collapse in={Boolean(error)}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>
      <form onSubmit={handleSubmit}>
        <Typography variant="h3">Summarize Text</Typography>

        <TextField
          placeholder="Enter text to summarize..."
          type="text"
          multiline
          rows={6}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Summarize"}
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
          flex: 1,
          borderRadius: 5,
          borderColor: "natural.medium",
          bgcolor: "background.default",
          overflow: "auto",
          padding: 3,
        }}
      >
        {summary ? (
          <Typography p={2}>{summary}</Typography>
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
            {loading ? "Summarizing..." : "Summary Will Appear Here"}
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default Summary;