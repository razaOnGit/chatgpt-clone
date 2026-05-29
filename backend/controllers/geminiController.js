const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini Config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// ======================================
// TEXT SUMMARIZATION
// ======================================
exports.summarizeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Please provide text",
      });
    }

    const prompt = `Summarize this text:\n${text}`;

    const result = await model.generateContent(prompt);

    res.status(200).json({
      success: true,
      summary: result.response.text(),
    });

  } catch (error) {
    // 1. CRITICAL: Log the real, raw error to your terminal console so you can see it
    console.error('--- DETAILED GEMINI API ERROR ---');
    console.error(error);
    console.error('---------------------------------');

    // 2. Check if the error explicitly carries an HTTP 429 status code
    const upstreamStatus = error.status || (error.response && error.response.status);
    // Only return a 429 if the upstream status is strictly 429 or the message explicitly says "quota exceeded"
    const isActualRateLimit = upstreamStatus === 429 || /quota exceeded|too many requests/i.test(error.message);
    const statusCode = isActualRateLimit ? 429 : 500;

    let retrySeconds;
    try {
      const m = (error.message || '').match(/Please retry in ([0-9.]+)s/i);
      if (m && m[1]) retrySeconds = Math.ceil(Number(m[1]));
    } catch (e) {}
    if (retrySeconds && isActualRateLimit) res.setHeader('Retry-After', String(retrySeconds));

    const payload = {
      success: false,
      message: error.message,
    };
    if (process.env.NODE_ENV !== 'production') payload.stack = error.stack;

    res.status(statusCode).json(payload);
  }
};

// ======================================
// PARAGRAPH GENERATOR
// ======================================
exports.generateParagraph = async (req, res) => {
  try {
    console.log('generateParagraph body:', req.body);

    // Accept multiple possible field names from frontend for robustness
    const { tone = "informative", length = "medium" } = req.body;
    const topic = req.body.topic || req.body.text || req.body.prompt;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Please provide a topic",
      });
    }

    const prompt = `Write a ${length} paragraph about ${topic} in a ${tone} tone.`;

    const result = await model.generateContent(prompt);

    res.status(200).json({
      success: true,
      paragraph: result.response.text(),
    });

  } catch (error) {
    console.error('Paragraph Generation Error:', error.stack || error);

    // Map upstream quota/429 errors to 429 and set Retry-After when available
    const upstreamStatus = error.response && error.response.status;
    const statusCode = upstreamStatus === 429 || /quota|too many requests|rate limit/i.test(error.message) ? 429 : 500;

    let retrySeconds;
    try {
      const m = (error.message || '').match(/Please retry in ([0-9.]+)s/i);
      if (m && m[1]) retrySeconds = Math.ceil(Number(m[1]));
    } catch (e) {}
    if (retrySeconds) res.setHeader('Retry-After', String(retrySeconds));

    const payload = { success: false, message: error.message };
    if (process.env.NODE_ENV !== 'production') payload.stack = error.stack;

    res.status(statusCode).json(payload);
  }
};

// ======================================
// AI CHAT (multi-turn, Gemini SDK format)
// ======================================
exports.chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid message string",
      });
    }

    // 1. Map history into Gemini standard format (user vs model)
    const formattedHistory = (conversationHistory || []).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // 2. Start chat with the provided history
    const chat = model.startChat({
      history: formattedHistory,
    });

    // 3. Send the new message
    const result = await chat.sendMessage(message);
    const aiResponseText = result.response.text();

    // 4. Pack updated history to match frontend state shape
    const updatedHistory = [
      ...(conversationHistory || []),
      { role: "user", content: message },
      { role: "model", content: aiResponseText },
    ];

    res.status(200).json({
      success: true,
      conversationHistory: updatedHistory,
    });

  } catch (error) {
    console.error("Gemini Chat Error:", error.stack || error);
    res.status(500).json({
      success: false,
      message: error.message || "Error generating chat response",
    });
  }
};

// ======================================
// JAVASCRIPT CODE GENERATOR
// ======================================
exports.convertToJavaScript = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Please provide prompt",
      });
    }

    const finalPrompt = `
Convert this into JavaScript code:

${prompt}

Provide clean code.
`;

    const result = await model.generateContent(finalPrompt);

    res.status(200).json({
      success: true,
      code: result.response.text(),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// PYTHON CODE GENERATOR
// ======================================
exports.convertToPython = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Please provide prompt",
      });
    }

    const finalPrompt = `
Convert this into Python code:

${prompt}

Provide clean code.
`;

    const result = await model.generateContent(finalPrompt);

    res.status(200).json({
      success: true,
      code: result.response.text(),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ======================================
// UNIVERSAL MULTIMODAL ANALYZER (ANTI-CRASH PRO)
// ======================================
exports.ImageToText = async (req, res) => {
  try {
    const { imageUrl, prompt } = req.body;

    // 1. Basic check for body presence
    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.includes(",")) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload format. Expected Base64 Data URL.",
      });
    }

    // 2. Safe parsing wrapper to block split() runtime crashes
    let base64Data, mimeType;
    try {
      const parts = imageUrl.split(",");
      base64Data = parts[1];
      mimeType = parts[0].split(";")[0].split(":")[1];
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Failed to parse Media metadata strings correctly.",
      });
    }

    // 3. Audio dynamic normalization (Gemini core requirement)
    // Agar webm format chromium ya mobile browser se aaye toh use fallback mapping milti hai
    if (mimeType.includes("audio/webm")) {
      mimeType = "audio/webm";
    }

    const finalPrompt = prompt?.trim() ? prompt : "Analyze and describe this content in detail.";

    // 4. API Call to Gemini (2.5 / 3.5 Flash)
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
      finalPrompt,
    ]);

    // 5. Secure extraction of textual result
    const responseText = result?.response ? result.response.text() : "No response generated from AI.";

    res.status(200).json({
      success: true,
      response: responseText,
    });

  } catch (error) {
    // Server logs the real error stack internally but never exposes raw internal breaks to user
    console.error('--- SECURE MULTIMODAL ERROR LOG ---');
    console.error(error.stack || error);
    console.error('------------------------------------');

    res.status(500).json({
      success: false,
      message: error.status === 429 ? "Rate limit reached. Try again later." : "Internal model processing failed cleanly.",
    });
  }
};