require('dotenv').config();
const colors = require('colors');

console.log('Environment Variables Test'.yellow);
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present'.green : 'Missing'.red);
console.log('PORT:', process.env.PORT ? 'Present'.green : 'Missing'.red);
console.log('DEV_MODE:', process.env.DEV_MODE ? 'Present'.green : 'Missing'.red);