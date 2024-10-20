const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Analyze financial document using Gemini Flash
exports.analyzeDocument = async (req, res) => {
    try {
        const filePath = req.file.path; // Path of the uploaded document
        const fileData = fs.readFileSync(filePath, 'base64'); // Convert to base64

        // Call Gemini Flash API for analysis
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const imageParts = [{ inlineData: { data: fileData, mimeType: req.file.mimetype } }];
        const result = await model.generateContent(['', ...imageParts]);

        const response = await result.response;
        const text = await response.text();

        res.status(200).json({ analysis: text });
    } catch (error) {
        res.status(500).json({ message: 'Error analyzing document', error });
    }
};

// Chat with the financial assistant using Gemini Pro
exports.chatWithAssistant = async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const chat = model.startChat({ history: [], generationConfig: { maxOutputTokens: 500 } });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = await response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        res.status(500).json({ message: 'Error chatting with assistant', error });
    }
};
