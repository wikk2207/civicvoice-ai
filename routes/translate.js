'use strict';

const express = require('express');
const router = express.Router();
const { detectLanguage, translateText, LANGUAGE_NAMES } = require('../services/translator');

// POST /api/translate
router.post('/', async (req, res, next) => {
  try {
    const { text, targetLang = 'en' } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required.' });

    const detected = detectLanguage(text);
    const { translatedText, method } = await translateText(text, targetLang);

    return res.json({
      originalText: text,
      translatedText,
      detectedLanguage: detected,
      detectedLanguageName: LANGUAGE_NAMES[detected] || 'Unknown',
      method,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/translate/languages
router.get('/languages', (req, res) => {
  const languages = Object.entries(LANGUAGE_NAMES).map(([code, name]) => ({ code, name }));
  return res.json(languages);
});

module.exports = router;
