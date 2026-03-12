const admin = require('firebase-admin');
const path = require('path');

let db;

try {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './firebase-service-account.json';
  
  if (require('fs').existsSync(path.resolve(serviceAccountPath))) {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    db = admin.firestore();
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase service account not found. Using in-memory storage.');
    db = null;
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
  db = null;
}

const memoryStore = {
  complaints: [],
  users: []
};

module.exports = { admin, db, memoryStore };