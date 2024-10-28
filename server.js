const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
const corsOptions = {
    origin: ['https://fresh-front.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200 // Important for legacy browser support
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add preflight handler
app.options('*', cors(corsOptions));

// Test endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// Form submission endpoint
app.post('/submit-form', (req, res) => {
    console.log('Received form submission:', req.body);
    try {
        // Your form handling logic here
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;
