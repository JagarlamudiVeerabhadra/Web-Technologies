// Import required module
const http = require('http');

// Define port
const PORT = 3000;

// Create server
const server = http.createServer((req, res) => {
    
    // Log request details
    console.log(`Request received: ${req.method} ${req.url}`);

    // Set response header
    res.setHeader('Content-Type', 'text/html');

    // Handle different routes
    if (req.url === '/') {
        res.write('<h1>Welcome to Home Page</h1>');
        res.write('<p>This is a simple Node.js server</p>');
    } 
    else if (req.url === '/about') {
        res.write('<h1>About Page</h1>');
        res.write('<p>This server is built using Node.js HTTP module</p>');
    } 
    else {
        res.write('<h1>404 Not Found</h1>');
    }

    // End response
    res.end();
});

// Run server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});