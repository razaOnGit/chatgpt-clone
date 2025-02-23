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

const JsConverter = () => {
  const theme = useTheme();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/gemini/code", {
        description: text
      });

      if (data.success) {
        setCode(data.code);
        toast.success("Code converted successfully!");
      } else {
        setError(data.message || "Failed to convert code");
        toast.error(data.message || "Failed to convert code");
      }
    } catch (err) {
      console.error("Conversion error:", err);
      const errorMessage = err.response?.data?.message || "Error converting to JavaScript";
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
        <Typography variant="h3">English to JavaScript Converter</Typography>

        <TextField
          placeholder="Describe what you want to convert to JavaScript..."
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Convert to JavaScript"}
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
        {code ? (
          <pre style={{ margin: 0, padding: '1rem' }}>
            <code>{code}</code>
          </pre>
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
            {loading ? "Converting..." : "Your JavaScript Code Will Appear Here"}
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default JsConverter;