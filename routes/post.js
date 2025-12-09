// routes/post.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create a new post
router.post('/create', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }

    // Create new post with author as logged-in username
    const post = new Post({
      author: req.user.username,
      content
    });

    await post.save();

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts for timeline (latest first)
router.get('/timeline', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
