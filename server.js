// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/x_clone_db';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// middleware that checks JWT (your existing middleware)
const authMiddleware = require('./middleware/auth');

// connect to DB
mongoose
  .connect(dbURI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// basic middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// serve static files (css, js, img, etc.)
app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/script', express.static(path.join(__dirname, 'script')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// simple request logger for debugging clicks in terminal
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.url}`);
  next();
});

// mount auth routes (register/login/logout)
app.use('/auth', require('./routes/auth'));

// post routes (protected)
app.use('/post', authMiddleware, require('./routes/post'));

// Root route: verify JWT then route appropriately
app.get('/', (req, res) => {
  const token = req.cookies && req.cookies.jwt;
  if (!token) return res.redirect('/login');

  try {
    jwt.verify(token, JWT_SECRET);
    return res.redirect('/home');
  } catch (err) {
    res.clearCookie('jwt');
    return res.redirect('/login');
  }
});

// Protected pages (require login)
app.get('/home', authMiddleware, (req, res) => {
  res.render('homePage', { username: req.user.username });
});

app.get('/recommend', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'recommendPage.html'));
});
app.get('/follow', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'followPage.html'));
});
app.get('/notice', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'noticePage.html'));
});
app.get('/message', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'messagePage.html'));
});
app.get('/setting', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'settingPage.html'));
});

// Public pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'loginPage.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'registerPage.html'));
});

// healthcheck (optional)
app.get('/healthz', (req, res) => res.send('ok'));

// 404 handler — logs requested URL then returns message
app.use((req, res) => {
  console.warn(`404: ${req.method} ${req.url}`);
  res.status(404).send('Not found');
});

// Set view engine
app.set('view engine', 'ejs');

// Set the folder where your templates (EJS files) live
app.set('views', path.join(__dirname, 'pages'));

// start
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
