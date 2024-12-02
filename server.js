const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
// Create express app
const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://freshandclean.co.uk',
            'https://www.freshandclean.co.uk',
            'https://fresh-front.vercel.app'
          ]
        : ['http://localhost:5500', 'http://127.0.0.1:5501', 'http://localhost:3000'],
    methods: ['POST', 'OPTIONS'],  // Only allow POST since it's just a form submission
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
    const { website, ...formData } = req.body;

    // Check honeypot field
    if (website) {
        // If the honeypot field is filled, it's likely a bot
        return res.status(400).json({ error: 'Spam detected' });
    }

    try {
        // Log the received data
        console.log('Form data received:', formData);
        
        // Setup email data
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Enquiry by ' + formData.Name,
            text: `
                New Enquiry Received:
                
                Full Name: ${formData.Name}
                Phone Number: ${formData['Phone-Number']}
                Address: ${formData.Adress}
                Email: ${formData.Email}
                Requested Service: ${formData['Requested-service']}
                Preferred Date: ${formData['Day-of-service']}
                Additional Notes: ${formData.Message || 'None provided'}
                
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
