'use strict';

const https = require('https');

const LANGUAGE_NAMES = {
  en: 'English', hi: 'Hindi', bn: 'Bengali', te: 'Telugu', mr: 'Marathi',
  ta: 'Tamil', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi',
  ur: 'Urdu', or: 'Odia', as: 'Assamese', ne: 'Nepali', si: 'Sinhala',
  ar: 'Arabic', fr: 'French', de: 'German', es: 'Spanish', pt: 'Portuguese',
  ru: 'Russian', zh: 'Chinese', ja: 'Japanese', ko: 'Korean',
};

// Unicode range detection for common scripts.
// Note: Languages sharing a script (Devanagari: hi/mr/ne; Arabic-script: ur/ar)
// are detected by the first matching entry; users can always override via the
// language selector on the submission form.
const SCRIPT_PATTERNS = [
  { lang: 'hi', range: /[\u0900-\u097F]/ },   // Devanagari (hi/mr/ne all share this range)
  { lang: 'bn', range: /[\u0980-\u09FF]/ },
  { lang: 'te', range: /[\u0C00-\u0C7F]/ },
  { lang: 'ta', range: /[\u0B80-\u0BFF]/ },
  { lang: 'gu', range: /[\u0A80-\u0AFF]/ },
  { lang: 'kn', range: /[\u0C80-\u0CFF]/ },
  { lang: 'ml', range: /[\u0D00-\u0D7F]/ },
  { lang: 'pa', range: /[\u0A00-\u0A7F]/ },
  { lang: 'ur', range: /[\u0600-\u06FF]/ },   // Arabic-script (ur/ar share this range)
  { lang: 'ru', range: /[\u0400-\u04FF]/ },
  { lang: 'zh', range: /[\u4E00-\u9FFF]/ },
  { lang: 'ja', range: /[\u3040-\u309F\u30A0-\u30FF]/ },
  { lang: 'ko', range: /[\uAC00-\uD7AF]/ },
  { lang: 'si', range: /[\u0D80-\u0DFF]/ },
  { lang: 'or', range: /[\u0B00-\u0B7F]/ },
];

function detectLanguage(text) {
  if (!text) return 'en';
  for (const { lang, range } of SCRIPT_PATTERNS) {
    if (range.test(text)) return lang;
  }
  return 'en';
}

function translateText(text, targetLang = 'en') {
  return new Promise((resolve) => {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey || apiKey === 'your-google-translate-api-key') {
      return resolve({ translatedText: text, method: 'passthrough' });
    }

    const postData = JSON.stringify({ q: text, target: targetLang, format: 'text' });
    const options = {
      hostname: 'translation.googleapis.com',
      path: `/language/translate/v2?key=${apiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const translated = parsed.data && parsed.data.translations && parsed.data.translations[0]
            ? parsed.data.translations[0].translatedText
            : text;
          resolve({ translatedText: translated, method: 'google' });
        } catch {
          resolve({ translatedText: text, method: 'passthrough' });
        }
      });
    });

    req.on('error', () => resolve({ translatedText: text, method: 'passthrough' }));
    req.write(postData);
    req.end();
  });
}

module.exports = { detectLanguage, translateText, LANGUAGE_NAMES };
