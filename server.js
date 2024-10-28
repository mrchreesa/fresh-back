const express = require('express');
const cors = require('cors');
const app = express();

// Add debug logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 3000;

// Configure CORS middleware
app.use(cors({
    origin: 'https://fresh-front.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With'],
    credentials: true
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a test endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// Handle form submission
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
