const express = require("express");
const {
  summarizeText,
  generateParagraph,
  chatWithAI,
  convertToJavaScript,
  imageToText
} = require("../controllers/geminiController");

const router = express.Router();

router.post("/summarize", summarizeText);
router.post("/paragraph", generateParagraph);
router.post("/chat", chatWithAI);
router.post("/code", convertToJavaScript);
router.post("/image-to-text", imageToText);

module.exports = router;
