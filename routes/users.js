const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token: 'Bearer ' + token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;