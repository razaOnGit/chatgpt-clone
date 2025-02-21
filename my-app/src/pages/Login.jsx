import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@mui/material";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/login", formData);
      
      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token);
        toast.success(response.data.message || "Login Successful");
        navigate("/homepage");
      } else {
        setError(response.data.message || "Login failed");
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred during login";
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
        <Typography variant="h3">Sign In</Typography>

        <TextField
          label="Email"
          type="email"
          name="email"
          required
          margin="normal"
          fullWidth
          value={formData.email}
          onChange={handleInputChange}
          error={Boolean(error)}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          required
          margin="normal"
          fullWidth
          value={formData.password}
          onChange={handleInputChange}
          error={Boolean(error)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ color: "white", mt: 2 }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <Typography mt={2}>
          Don't have an account? <Link to="/register">Please Register</Link>
        </Typography>
      </form>
    </Box>
  );
};

export default Login;