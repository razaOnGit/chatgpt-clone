import React, { useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const authToken = localStorage.getItem("authToken");
  const loggedIn = Boolean(authToken);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    try {
      await axios.post("/api/v1/auth/logout");
      localStorage.removeItem("authToken");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
    border: 0,
    borderRadius: '20px',
    color: 'white',
    padding: '8px 16px',
    margin: '0 8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'none',
    boxShadow: '0 3px 10px rgba(156, 39, 176, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(156, 39, 176, 0.4)',
      background: 'linear-gradient(45deg, #673ab7 30%, #9c27b0 90%)',
    }
  };

  return (
    <Box
      component={motion.nav}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      width={"100%"}
      backgroundColor="rgba(255, 255, 255, 0.05)"
      backdropFilter="blur(10px)"
      p="1rem 6%"
      sx={{ 
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            cursor: 'pointer',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '3px',
              bottom: '-4px',
              left: 0,
              background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
              transform: 'scaleX(0)',
              transformOrigin: 'bottom right',
              transition: 'transform 0.3s ease-out',
            },
            '&:hover::after': {
              transform: 'scaleX(1)',
              transformOrigin: 'bottom left',
            }
          }}
          onClick={() => navigate("/homepage")}
        >
          AI GPT Clone
        </Typography>
      </motion.div>
      
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {loggedIn && (
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/homepage")}
            startIcon={<HomeIcon />}
            sx={buttonStyle}
          >
            Home
          </Button>
        )}
        
        {loggedIn ? (
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            startIcon={<LogoutIcon />}
            sx={buttonStyle}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        ) : (
          <>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              startIcon={<PersonAddIcon />}
              sx={buttonStyle}
            >
              Sign Up
            </Button>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              startIcon={<LoginIcon />}
              sx={buttonStyle}
            >
              Sign In
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
