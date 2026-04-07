const express = require('express');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send('REST API Server is running');
});

// User routes
app.use('/users', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});