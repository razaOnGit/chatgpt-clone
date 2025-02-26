const { GoogleGenerativeAI } = require("@google/generative-ai");
const colors = require("colors");

// Verify API key with better error handling
const initializeGemini = () => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing in environment variables".red);
        throw new Error("GEMINI_API_KEY is missing in environment variables");
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        console.log("Gemini API initialized successfully".green);
        return genAI;
    } catch (error) {
        console.error("Failed to initialize Gemini API:".red, error);
        throw error;
    }
};

const genAI = initializeGemini();

// ...rest of your existing code...
// Add a test function to verify API connection
const testGeminiConnection = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Test connection");
    console.log("Gemini API connection test successful".green);
  } catch (error) {
    console.error("Gemini API connection test failed:".red, error);
    throw error;
  }
};

// Test connection on startup
testGeminiConnection();

// ...rest of your existing exports...

// Text Summarization (Long to Short)
exports.summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Please provide text to summarize"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Summarize this text in a concise way:\n${text}`;
    
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    console.error("Summarization Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in summarization",
      error: error.message
    });
  }
};

// Paragraph Generation
exports.generateParagraph = async (req, res) => {
  try {
    const { topic, tone = "informative", length = "medium" } = req.body;
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Please provide a topic"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Write a ${length} paragraph about ${topic} in a ${tone} tone.`;
    
    const result = await model.generateContent(prompt);
    const paragraph = result.response.text();

    res.status(200).json({
      success: true,
      paragraph
    });
  } catch (error) {
    console.error("Paragraph Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating paragraph",
      error: error.message
    });
  }
};

// AI Chatbot
exports.chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role === "assistant" ? "model" : msg.role, // Map "assistant" to "model"
        parts: [{ text: msg.content }] // Wrap content in an array
      }))
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      reply: text,
      conversationHistory: [...conversationHistory, 
        { role: "user", content: message },
        { role: "assistant", content: text }
      ]
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in chat",
      error: error.message
    });
  }
};

// English to JavaScript Code Conversion
exports.convertToJavaScript = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Please provide code description"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Convert this English description to JavaScript code:
    Description: ${description}
    Please provide clean, well-commented code.`;
    
    const result = await model.generateContent(prompt);
    const code = result.response.text();

    res.status(200).json({
      success: true,
      code
    });
  } catch (error) {
    console.error("Code Conversion Error:", error);
    res.status(500).json({
      success: false,
      message: "Error converting to code",
      error: error.message
    });
  }
};

// Image to Text (Updated)
exports.imageToText = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Input validation
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image"
      });
    }

    // Handle different image formats (data URLs)
    const isBase64Image = imageUrl.startsWith('data:image/');
    const isPdfDataUrl = imageUrl.startsWith('data:application/pdf');

    if (!isBase64Image && !isPdfDataUrl) {
      return res.status(400).json({
        success: false,
        message: "Invalid file format. Please provide a valid image or PDF."
      });
    }

    // Extract the base64 data
    const base64Data = imageUrl.split(',')[1];
    const mimeType = imageUrl.split(';')[0].split(':')[1];

    // Initialize Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Prepare prompt based on file type
    const prompt = isPdfDataUrl 
      ? "Analyze this PDF document and describe its contents in detail."
      : "Describe this image in detail, including what you see, any text present, and the overall context.";

    // Generate content using the model
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      prompt
    ]);

    const response = await result.response;
    const description = response.text();

    res.status(200).json({
      success: true,
      description,
      fileType: isPdfDataUrl ? 'pdf' : 'image'
    });

  } catch (error) {
    console.error("Image/PDF Analysis Error:".red, error);
    
    // Enhanced error handling
    let errorMessage = "Error processing file";
    let statusCode = 500;

    if (error.message.includes('API key')) {
      errorMessage = "Authentication failed: Invalid API key";
      statusCode = 401;
    } else if (error.message.includes('Too Large')) {
      errorMessage = "File size too large. Please use a smaller file.";
      statusCode = 413;
    } else if (error.message.includes('format')) {
      errorMessage = "Unsupported file format";
      statusCode = 415;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
};

// Add a function to validate file size
const validateFileSize = (base64String, maxSizeMB = 4) => {
  const sizeInBytes = Buffer.from(base64String, 'base64').length;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB <= maxSizeMB;
};

// Update the routes to match the frontend
exports.ImageToText = exports.imageToText; // Alias for consistent naming