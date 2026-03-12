'use strict';

let db = null;

try {
  const admin = require('firebase-admin');

  if (!admin.apps.length) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credentialsPath) {
      console.warn('[Firebase] GOOGLE_APPLICATION_CREDENTIALS not set — running without Firestore.');
    } else {
      const serviceAccount = require(require('path').resolve(credentialsPath));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      db = admin.firestore();
      console.log('[Firebase] Firestore connected.');
    }
  } else {
    db = admin.firestore();
  }
} catch (err) {
  console.warn('[Firebase] Could not initialise Firebase:', err.message);
}

module.exports = { db };
