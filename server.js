const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
// Create express app
const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://freshandclean.co.uk'
        : 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Form submission route
app.post('/submit-form', async (req, res) => {
    try {
        // Log the received data
        console.log('Form data received:', req.body);
        
        // Setup email data
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Enquiry by ' + req.body.Name,
            text: `
                New Enquiry Received:
                
                Full Name: ${req.body.Name}
                Phone Number: ${req.body['Phone-Number']}
                Address: ${req.body.Adress}
                Email: ${req.body.Email}
                Requested Service: ${req.body['Requested-service']}
                Preferred Date: ${req.body['Day-of-service']}
                Additional Notes: ${req.body.Message || 'None provided'}
                
                Submitted on: ${new Date().toLocaleString()}
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        // Send success response
        res.status(200).json({
            success: true,
            message: 'Form submitted and email sent successfully'
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

// Start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the app
module.exports = app;
