const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// === Middleware ===
// Serve static files (CSS, Images, JS)
// This allows the browser to find files like global.css 
// via relative paths (e.g., /css/global.css)
app.use(express.static(path.join(__dirname)));

// === Routes ===

// The Root Route: The first thing the application will check
app.get('/', (req, res) => {

    // TODO: Implement Authentication Check here
    const isAuthenticated = false; // Currently hardcoded to false

    if (isAuthenticated) {
        // If logged in, send them to the main application page
        // path.join to ensures paths work correctly across operating systems
        res.sendFile(path.join(__dirname, 'pages', 'homePage.html'));
    } else {
        // If not logged in, send them to the login page
        res.sendFile(path.join(__dirname, 'pages', 'loginPage.html'))
    }
});

// A route specifically for the login page, this is useful for navigation
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'loginPage.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Open http://localhost:${port} to view the project.`);
});