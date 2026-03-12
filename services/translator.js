'use strict';

const https = require('https');

const LANGUAGE_CODES = {
  english: 'en',
  hindi: 'hi',
  spanish: 'es',
  french: 'fr',
  arabic: 'ar',
  chinese: 'zh',
  portuguese: 'pt',
  russian: 'ru',
  german: 'de',
  japanese: 'ja',
  korean: 'ko',
  italian: 'it',
  dutch: 'nl',
  turkish: 'tr',
  polish: 'pl',
  bengali: 'bn',
  urdu: 'ur',
  marathi: 'mr',
  tamil: 'ta',
  telugu: 'te',
  gujarati: 'gu',
  kannada: 'kn',
  malayalam: 'ml',
  punjabi: 'pa',
  thai: 'th',
  vietnamese: 'vi',
  indonesian: 'id',
  swahili: 'sw'
};

// Simple heuristic language detection based on Unicode ranges
function detectLanguage(text) {
  if (!text) return 'en';
  const sample = text.slice(0, 200);

  const patterns = [
    { code: 'ar', regex: /[\u0600-\u06FF]/ },
    { code: 'zh', regex: /[\u4E00-\u9FFF]/ },
    { code: 'ja', regex: /[\u3040-\u30FF]/ },
    { code: 'ko', regex: /[\uAC00-\uD7AF]/ },
    { code: 'hi', regex: /[\u0900-\u097F]/ },
    { code: 'bn', regex: /[\u0980-\u09FF]/ },
    { code: 'ta', regex: /[\u0B80-\u0BFF]/ },
    { code: 'te', regex: /[\u0C00-\u0C7F]/ },
    { code: 'kn', regex: /[\u0C80-\u0CFF]/ },
    { code: 'ml', regex: /[\u0D00-\u0D7F]/ },
    { code: 'gu', regex: /[\u0A80-\u0AFF]/ },
    { code: 'pa', regex: /[\u0A00-\u0A7F]/ },
    { code: 'ur', regex: /[\u0600-\u06FF\u0750-\u077F]/ },
    { code: 'th', regex: /[\u0E00-\u0E7F]/ },
    { code: 'ru', regex: /[\u0400-\u04FF]/ }
  ];

  for (const { code, regex } of patterns) {
    if (regex.test(sample)) return code;
  }
  return 'en';
}

function translateWithGoogleAPI(text, targetLang, sourceLang, apiKey) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      q: text,
      target: targetLang,
      source: sourceLang,
      key: apiKey,
      format: 'text'
    });
    const url = `https://translation.googleapis.com/language/translate/v2?${params.toString()}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.data && parsed.data.translations && parsed.data.translations[0]) {
            resolve(parsed.data.translations[0].translatedText);
          } else {
            reject(new Error(parsed.error ? parsed.error.message : 'Translation failed'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function translateText(text, targetLang = 'en', sourceLang = null) {
  if (!text) return { translatedText: text, detectedLanguage: 'en', originalText: text };

  const detected = sourceLang || detectLanguage(text);
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (detected === targetLang) {
    return { translatedText: text, detectedLanguage: detected, originalText: text };
  }

  if (apiKey && apiKey !== 'your-google-translate-api-key') {
    try {
      const translatedText = await translateWithGoogleAPI(text, targetLang, detected, apiKey);
      return { translatedText, detectedLanguage: detected, originalText: text };
    } catch (err) {
      console.warn('Google Translate API error:', err.message, '— returning original text');
    }
  }

  // Fallback: return original text
  return { translatedText: text, detectedLanguage: detected, originalText: text };
}

module.exports = { translateText, detectLanguage, LANGUAGE_CODES };
