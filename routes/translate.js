'use strict';

const express = require('express');
const router = express.Router();
const { translateText, LANGUAGE_CODES } = require('../services/translator');

// POST / - Translate text
router.post('/', async (req, res, next) => {
  try {
    const { text, targetLang, sourceLang } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    const result = await translateText(text, targetLang || 'en', sourceLang || null);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// GET /languages - List supported languages
router.get('/languages', (_req, res) => {
  res.json({ success: true, languages: LANGUAGE_CODES });
});

module.exports = router;
