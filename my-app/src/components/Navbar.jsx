import React, { useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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
    color: theme.palette.primary.main,
    textTransform: 'none',
    fontSize: '1rem',
    margin: '0 0.5rem',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: 'white',
    }
  };

  return (
    <Box
      width={"100%"}
      backgroundColor={theme.palette.background.alt}
      p="1rem 6%"
      sx={{ 
        boxShadow: 4, 
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Typography variant="h1" color="primary" fontWeight="bold">
        AI GPT Clone
      </Typography>
      
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {loggedIn && (
          <Button
            onClick={() => navigate("/homepage")}
            sx={buttonStyle}
          >
            Home
          </Button>
        )}
        
        {loggedIn ? (

          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                color: "white",
              }
            }}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        ) : (
          <>
            <Button
              onClick={() => navigate("/register")}
              sx={buttonStyle}
            >
              Sign Up
            </Button>
            <Button
              onClick={() => navigate("/login")}
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
