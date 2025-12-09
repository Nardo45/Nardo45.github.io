// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES = '2d';

router.post('/register', async (req, res) => {
    try {
        const { username, password, passwordConfirm, email, birthday } = req.body;

        // Basic validation
        if (!username || !password || !passwordConfirm) {
            return res.status(400).send('Missing required fields');
        }
        if (password !== passwordConfirm) {
            return res.status(400).send('Passwords do not match');
        }
        // optionally: enforce password length
        if (password.length < 6) {
            return res.status(400).send('Password must be at least 6 characters');
        }

        // Check existing user
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(409).send('Username already exists');
        }

        // Create user document
        const user = new User({
            username,
            password,
            // store extras if your User model accepts them (optional)
            email: email || undefined,
            birthday: birthday || undefined
        });

        await user.save();

        // Sign token and set cookie
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 2 }); // 2 days
        return res.redirect('/home');

    } catch (err) {
        console.error('Register error:', err);

        // Duplicate key (race-case) fallback
        if (err.code === 11000) {
            return res.status(409).send('Username already exists');
        }

        // Send more descriptive error for dev; you can reduce this for production
        return res.status(500).send('Server error: ' + (err.message || 'unknown'));
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send('Missing credentials');

        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('Invalid credentials');

        const valid = await user.comparePassword(password);
        if (!valid) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 2 });
        return res.redirect('/home');

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).send('Server error');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});

module.exports = router;
