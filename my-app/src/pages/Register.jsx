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
  Alert,
  Collapse,
} from "@mui/material";
import { motion } from "framer-motion";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { StyledBox, StyledButton ,StyledTextField} from '../components/StyledComponents';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledBox
        width={isNotMobile ? "40%" : "90%"}
        m={"2rem auto"}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </motion.div>
          <Typography 
            variant="h3" 
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Create Account
          </Typography>
        </Box>

        <Collapse in={Boolean(error)}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              borderRadius: '10px',
              animation: 'shake 0.5s'
            }}
          >
            {error}
          </Alert>
        </Collapse>

        <form onSubmit={handleSubmit}>
        <StyledTextField
            label="Name"
            name="username"
            required
            margin="normal"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            error={Boolean(error)}
            InputProps={{
              sx: {
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            }}
          />
            <StyledTextField
            label="Email"
            name="email"
            type="email"
            required
            margin="normal"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={Boolean(error)}
            InputProps={{
              sx: {
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            }}
          />
          <TextField
            label="Password (min. 6 characters)"
            name="password"
            type="password"
            required
            margin="normal"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            error={Boolean(error)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                '&:hover fieldset': {
                  //borderColor: 'primary.main',
                  color: 'rgba(223, 231, 241, 0.84)',
                },
              },
            }}
          />
          <StyledButton
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⌛
              </motion.div>
            ) : (
              "Sign Up"
            )}
          </StyledButton>

          <Typography 
            mt={2} 
            textAlign="center"
            sx={{ 
              color: 'text.secondary',
              '& a': {
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }
            }}
          >
            Already have an account? <Link to="/login">Sign In</Link>
          </Typography>
        </form>
      </StyledBox>
    </motion.div>
  );
};

export default Register;