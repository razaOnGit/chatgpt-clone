require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

(async () => {
  console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
  console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is missing. Set it in .env or environment.');
    process.exit(1);
  }

  try {
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Health check');
    const resp = await result.response;
    console.log('Gemini response:', resp.text());
  } catch (err) {
    console.error('Gemini test failed:', err.message || err);
    if (err.response) {
      try {
        console.error('Remote response body:', typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data, null, 2));
      } catch (e) {}
    }
    console.error(err.stack || err);
    process.exit(1);
  }
})();
