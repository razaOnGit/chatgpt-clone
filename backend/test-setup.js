require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const colors = require("colors");

async function testSetup() {
    console.log("Testing environment setup...".yellow);
    
    // Check environment variables
    console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent("Hello World");
        const response = await result.response;
        
        console.log("Test successful!".green);
        console.log("API Response:", response.text());
    } catch (error) {
        console.error("Test failed:".red, error);
    }
}

testSetup();