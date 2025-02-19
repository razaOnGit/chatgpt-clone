const validateEnv = () => {
    const requiredEnvVars = [
        'GEMINI_API_KEY',
        'PORT',
        'DEV_MODE',
        // Add other required env variables
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
};

module.exports = validateEnv;