const express = require('express');
const cors = require('cors');
const app = express();

// Basic logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

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

// Health check endpoint
app.get('/health', (req, res) => {
    try {
        res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ error: 'Health check failed' });
    }
});

// Form submission endpoint
app.post('/submit-form', async (req, res) => {
    try {
        console.log('Received form data:', req.body);
        
        // Validate the request body
        if (!req.body) {
            throw new Error('No form data received');
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Form submitted successfully',
            data: req.body
        });

    } catch (error) {
        console.error('Form submission error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Server error occurred',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Only start the server if not being imported as a module
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
