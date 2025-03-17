import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import { themeSettings } from "./theme";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Summary from "./pages/Summary";
import ChatBot from "./pages/ChatBot";
import JsConverter from "./pages/JsConverter";
import Paragraph from "./pages/Paragraph";
import ImageToText from "./pages/ImageToText";
import PyConverter from "./pages/PyConverter";

function App() {
  const theme = useMemo(() => createTheme(themeSettings()), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/Homepage" element={<Homepage />} />
         <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/paragraph" element={<Paragraph />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/js-converter" element={<JsConverter />} />
        <Route path="/ImageToText" element={<ImageToText />} />
        <Route path="/py-converter" element={<PyConverter />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
