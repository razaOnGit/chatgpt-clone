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

const ChatBot = () => {
  const theme = useTheme();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.post("/api/gemini/chat", {
        message,
        conversationHistory: conversation
      });

      if (data.success) {
        setConversation(data.conversationHistory);
        setMessage("");
        toast.success("Response received!");
      } else {
        setError("Failed to get response");
        toast.error("Failed to get response");
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong";
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
        <Typography variant="h3">Chat with Gemini AI</Typography>

        <TextField
          placeholder="Ask anything..."
          type="text"
          multiline
          rows={4}
          required
          margin="normal"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ color: "white", mt: 2 }}
          disabled={loading || !message.trim()}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Send Message"}
        </Button>
        <Typography mt={2}>
          Not this tool? <Link to="/">GO BACK</Link>
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
          padding: 2
        }}
      >
        {conversation.length > 0 ? (
          conversation.map((msg, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: msg.role === "user" ? 
                  theme.palette.primary.light : 
                  theme.palette.background.alt,
                color: msg.role === "user" ? 
                  theme.palette.primary.contrastText : 
                  theme.palette.text.primary
              }}
            >
              <Typography variant="body1">
                <strong>{msg.role === "user" ? "You: " : "AI: "}</strong>
                {msg.content}
              </Typography>
            </Box>
          ))
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
            Start a conversation with Gemini AI
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default ChatBot;