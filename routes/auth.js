const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

// GET Login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('/');
  }

  res.render('login', { error: 'Invalid username or password' });
});

// GET Register
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// POST Register
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const info = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(username, email, hashedPassword);
    
    const token = jwt.sign({ id: info.lastInsertRowid, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (error) {
    res.render('register', { error: 'Username or email already exists' });
  }
});

// GET Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
