'use strict';

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { db, memoryStore } = require('../config/firebase');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + (process.env.AUTH_SECRET || 'civicvoice-secret')).digest('hex');
}

function generateToken(userId) {
  const payload = Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64');
  const sig = crypto.createHmac('sha256', process.env.AUTH_SECRET || 'civicvoice-secret')
    .update(payload).digest('hex');
  return `${payload}.${sig}`;
}

// POST /register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    let existing = null;
    if (db) {
      const snap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get();
      if (!snap.empty) existing = snap.docs[0].data();
    } else {
      existing = memoryStore.users.find(u => u.email === email.toLowerCase());
    }

    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const user = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password: hashPassword(password),
      role: 'user',
      createdAt: new Date().toISOString()
    };

    if (db) {
      await db.collection('users').doc(user.id).set(user);
    } else {
      memoryStore.users.push(user);
    }

    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (err) {
    next(err);
  }
});

// POST /login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    let user = null;
    if (db) {
      const snap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get();
      if (!snap.empty) user = snap.docs[0].data();
    } else {
      user = memoryStore.users.find(u => u.email === email.toLowerCase());
    }

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
