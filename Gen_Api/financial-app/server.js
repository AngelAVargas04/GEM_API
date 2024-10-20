// Dependencies
const dotenv = require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// MongoDB setup
const app = express();
const port = process.env.PORT || 3000;

(async () => {
    const URI = process.env.NODE_ENV === "test" ? process.env.DB_TEST : process.env.DB_DEV;

    try {
        await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        
        // Start the server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
})();

// Middleware for parsing JSON and file uploads
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

// Financial document analysis route
app.post('/api/finance/upload', upload.single('document'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileData = fs.readFileSync(filePath, 'base64');
        
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const imageParts = [{ inlineData: { data: fileData, mimeType: req.file.mimetype } }];
        const result = await model.generateContent(['', ...imageParts]);

        const response = await result.response;
        const text = await response.text();

        res.status(200).json({ analysis: text });
    } catch (error) {
        res.status(500).json({ message: 'Error analyzing document', error });
    }
});

// Financial assistant chat route
app.post('/api/finance/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const chat = model.startChat({
            history: [],
            generationConfig: { maxOutputTokens: 500 },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = await response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        res.status(500).json({ message: 'Error chatting with assistant', error });
    }
});

// Root route for server status
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected to server' });
});

