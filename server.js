const http = require('http');
const url = require('url');
const querystring = require('querystring');
const cors = require('cors'); // Import the cors package

const PORT = process.env.PORT || 3000;

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Requested-With'); // Allow specific headers

    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/submit-form') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            let formData;
            const contentType = req.headers['content-type'];
            
            if (contentType && contentType.includes('multipart/form-data')) {
                // Handle multipart form data
                // You might want to use a library like 'multiparty' for this
                formData = body; // You'll need to parse this properly
            } else {
                // Handle URL-encoded data
                formData = querystring.parse(body);
            }
            
            console.log('Form Data:', formData);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Form submitted successfully!');
        });
    } else {
        // Handle other routes or methods
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
