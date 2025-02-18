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

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/register", formData);
      if (response.data.success) {
        toast.success(response.data.message || "Registration successful");
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed");
        toast.error(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
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
        <Typography variant="h3">Sign Up</Typography>
        <TextField
          label="Username"
          name="username"
          required
          margin="normal"
          fullWidth
          value={formData.username}
          onChange={handleChange}
          error={Boolean(error)}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          margin="normal"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          error={Boolean(error)}
        />
        <TextField
          label="minimum password 6 digits or characters"
          name="password"
          type="password"
          required
          margin="normal"
          fullWidth
          value={formData.password}
          onChange={handleChange}
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
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
        <Typography mt={2}>
          Already have an account? <Link to="/login">Please Login</Link>
        </Typography>
      </form>
    </Box>
  );
};

export default Register;