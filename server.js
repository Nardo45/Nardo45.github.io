const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; 
const dbURI = 'mongodb://localhost:27017/x_clone_db'; 

// --- Database Connection --- 
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// --- Middleware ---

// 1. Parse request bodies
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json()); 

// Serve static files
app.use(express.static(path.join(__dirname))); 

// The new script folder
app.use('/script', express.static(path.join(__dirname, 'script'))); 

// The js folder
app.use('/js', express.static(path.join(__dirname, 'js'))); 

// --- Routes ---

// The Root Route: Handles authentication check and directs to Home or Login
app.get('/', (req, res) => {
    
    // TODO: Implement Authentication Check here
    const isAuthenticated = false; // Currently hardcoded to false
    
    if (isAuthenticated) {
        res.sendFile(path.join(__dirname, 'pages', 'homePage.html'));
    } else {
        res.sendFile(path.join(__dirname, 'pages', 'loginPage.html'));
    }
});

// Route for the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'loginPage.html'));
});

// Route for the registration page (useful for linking)
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'registerPage.html'));
});

// Define routes for all major pages for navigation
app.get('/home', (req, res) => {
    // *** You should add an authentication check here later ***
    res.sendFile(path.join(__dirname, 'pages', 'homePage.html'));
});

app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'messagePage.html'));
});

app.get('/follow', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'followPage.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'searchPage.html'));
});

app.get('/recommend', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'recommendPage.html'));
});

app.get('/notice', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'noticePage.html'));
});

app.get('/setting', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'settingPage.html'));
});

app.get('/message', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'messagePage.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Open http://localhost:${port} to view the project.`);
});