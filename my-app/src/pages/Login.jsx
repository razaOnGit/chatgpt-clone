import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { styled } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { motion } from 'framer-motion';
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
import { StyledButton } from "../components/StyledComponents";

const StyledBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.alt} 100%)`,
  borderRadius: '20px',
  padding: '2rem',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

// const StyledButton = styled(Button)(({ theme }) => ({
//   background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
//   border: 0,
//   borderRadius: '50px',
//   boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
//   color: 'white',
//   height: 48,
//   padding: '0 30px',
//   marginTop: '1rem',
//   transition: 'transform 0.2s',
//   '&:hover': {
//     transform: 'scale(1.02)',
//     background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`
//   }
// }));

const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    transition: {
      duration: 0.4
    }
  }
};

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
      // const response = await authAPI.login(formData);
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
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
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
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Welcome Back
            </Typography>
          </motion.div>
        </Box>

        <Collapse in={Boolean(error)}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
                borderRadius: '10px',
                animation: 'shake 0.5s',
                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                color: '#9c27b0',
                '& .MuiAlert-icon': {
                  color: '#9c27b0'
                }
              }}
            >
              {error}
            </Alert>
          </motion.div>
        </Collapse>

        <form onSubmit={handleSubmit}>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
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
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear" 
                }}
              >
                💫
              </motion.div>
            ) : (
              <span className="MuiButton-label">Sign In</span>
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
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </form>
      </StyledBox>
    </motion.div>
  );
};

export default Login;