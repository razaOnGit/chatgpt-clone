import React from "react";
import { Box, Link,Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
//import { NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const loggedIn = JSON.parse(localStorage.getItem("authToken"));

  //handle logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/auth/logout");
      localStorage.removeItem("authToken");
      toast.success("logout successfully ");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box
      width={"100%"}
      backgroundColor={theme.palette.background.alt}
      p="1rem 6%"
      textAlign={"center"}
      sx={{ boxShadow: 3, mb: 2 }}
    >
      <Typography variant="h1" color="primary" fontWeight="bold">
        AI GPT Clone
      </Typography>
      {loggedIn ? (
        <>
          <Link href="/" p={1}>
            Home
          </Link>
          <Link href="/login" onClick={handleLogout} p={1}>
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link href="/register" p={1}>
            Sign Up
          </Link>
          <Link href="/login" p={1}>
            Sign In
          </Link>
        </>
      )}
    </Box>
  );
};

export default Navbar;
