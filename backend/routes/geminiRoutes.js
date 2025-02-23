const express = require("express");
const {
  summarizeText,
  generateParagraph,
  chatWithAI,
  convertToJavaScript,
  ImageToText,
} = require("../controllers/geminiController");

const router = express.Router();

router.post("/summarize", summarizeText);
router.post("/paragraph", generateParagraph);
router.post("/chat", chatWithAI);
router.post("/code", convertToJavaScript);
router.post("/ImageToText", ImageToText);
router.post("/ImageToText", ImageToText); // Alias route for backward compatibility

module.exports = router;
