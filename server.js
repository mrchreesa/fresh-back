const express = require('express');
const cors = require('cors');

// Create express app
const app = express();

// CORS configuration
app.use(cors({
    origin: 'https://fresh-front.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Form submission route
app.post('/submit-form', (req, res) => {
    try {
        // Log the received data
        console.log('Form data received:', req.body);
        
        // Send success response
        res.status(200).json({
            success: true,
            message: 'Form submitted successfully'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Export the app
module.exports = app;
