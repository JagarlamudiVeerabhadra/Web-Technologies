const express = require('express');
const app = express();
const PORT = 3000;

// Global middleware 1: log request details
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString();
    console.log(`[Global Middleware 1] Method: ${req.method}, URL: ${req.url}, Time: ${timestamp}`);
    next();
});

// Global middleware 2: request preprocessing
app.use((req, res, next) => {
    console.log('[Global Middleware 2] Request is being preprocessed');
    req.requestTime = new Date().toISOString();
    next();
});

// Route-level middleware
function routeMiddleware(req, res, next) {
    console.log('[Route Middleware] Accessing /about route');
    next();
}

// Home route
app.get('/', (req, res) => {
    console.log('[Route Handler] Home route executed');
    res.send('Welcome to the Home Page');
});

// About route with route-level middleware
app.get('/about', routeMiddleware, (req, res) => {
    console.log('[Route Handler] About route executed');
    res.send(`About Page - Request processed at ${req.requestTime}`);
});

// Multiple middleware chaining for /contact
app.get(
    '/contact',
    (req, res, next) => {
        console.log('[Middleware Layer 1] Contact route');
        next();
    },
    (req, res, next) => {
        console.log('[Middleware Layer 2] Contact route');
        next();
    },
    (req, res) => {
        console.log('[Route Handler] Contact route executed');
        res.send('Contact Page');
    }
);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});