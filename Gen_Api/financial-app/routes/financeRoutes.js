const express = require('express');
const { analyzeDocument, chatWithAssistant } = require('../controllers/financeController');
const multer = require('multer'); // To handle file uploads

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Directory for file uploads

// Route for financial document upload and analysis
router.post('/upload', upload.single('document'), analyzeDocument);

// Route for chatting with the financial assistant
router.post('/chat', chatWithAssistant);

module.exports = router;
