'use strict';

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/firebase');
const { classify } = require('../services/classifier');
const { detectLanguage, translateText, LANGUAGE_NAMES } = require('../services/translator');

function generateTrackingId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `CV-${date}-${rand}`;
}

function estimatedResolution(priority) {
  const map = { critical: 24, high: 72, medium: 168, low: 336 };
  const hours = map[priority] || 168;
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

// In-memory fallback store when Firestore is unavailable
const memStore = new Map();

function saveComplaint(data) {
  if (db) {
    return db.collection('complaints').doc(data.trackingId).set(data);
  }
  memStore.set(data.trackingId, data);
  return Promise.resolve();
}

function getComplaint(trackingId) {
  if (db) {
    return db.collection('complaints').doc(trackingId).get().then((snap) => (snap.exists ? snap.data() : null));
  }
  return Promise.resolve(memStore.get(trackingId) || null);
}

function listComplaints(filters = {}) {
  if (db) {
    let ref = db.collection('complaints').orderBy('createdAt', 'desc');
    if (filters.status) ref = ref.where('status', '==', filters.status);
    if (filters.category) ref = ref.where('category', '==', filters.category);
    if (filters.priority) ref = ref.where('priority', '==', filters.priority);
    if (filters.limit) ref = ref.limit(parseInt(filters.limit, 10));
    return ref.get().then((snap) => snap.docs.map((d) => d.data()));
  }
  let arr = Array.from(memStore.values()).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  if (filters.status) arr = arr.filter((c) => c.status === filters.status);
  if (filters.category) arr = arr.filter((c) => c.category === filters.category);
  if (filters.priority) arr = arr.filter((c) => c.priority === filters.priority);
  if (filters.limit) arr = arr.slice(0, parseInt(filters.limit, 10));
  return Promise.resolve(arr);
}

// POST /api/complaints
router.post('/', async (req, res, next) => {
  try {
    const { title, description, name, email, phone, location, coordinates, imageUrls = [], inputLanguage = 'auto' } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters.' });
    }
    if (!location || location.trim().length < 3) {
      return res.status(400).json({ error: 'Location is required.' });
    }

    const detectedLang = detectLanguage(description);
    const langCode = inputLanguage === 'auto' ? detectedLang : inputLanguage;
    const { translatedText, method } = await translateText(description, 'en');
    const classification = classify(translatedText || description);
    const trackingId = generateTrackingId();
    const now = new Date().toISOString();

    const complaint = {
      trackingId,
      title: title || '',
      description,
      originalText: description,
      translatedText: translatedText || description,
      name: name || '',
      email: email || '',
      phone: phone || '',
      location,
      coordinates: coordinates || null,
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      inputLanguage: langCode,
      detectedLanguage: detectedLang,
      detectedLanguageName: LANGUAGE_NAMES[detectedLang] || 'Unknown',
      translationMethod: method,
      category: classification.category,
      categoryLabel: classification.label,
      categoryIcon: classification.icon,
      department: classification.department,
      priority: classification.priority,
      confidence: classification.confidence,
      status: 'submitted',
      estimatedResolution: estimatedResolution(classification.priority),
      statusHistory: [{ status: 'submitted', timestamp: now, note: 'Complaint submitted successfully.' }],
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    };

    await saveComplaint(complaint);

    return res.status(201).json({
      success: true,
      trackingId,
      category: classification.label,
      department: classification.department,
      priority: classification.priority,
      confidence: classification.confidence,
      estimatedResolution: complaint.estimatedResolution,
      status: 'submitted',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/complaints/track/:trackingId
router.get('/track/:trackingId', async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    const complaint = await getComplaint(trackingId.toUpperCase());
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }
    // Strip PII for public route
    const { email, phone, ...safe } = complaint;
    return res.json(safe);
  } catch (err) {
    next(err);
  }
});

// GET /api/complaints
router.get('/', async (req, res, next) => {
  try {
    const { status, category, priority, limit } = req.query;
    const complaints = await listComplaints({ status, category, priority, limit: limit || 200 });
    return res.json(complaints);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/complaints/:trackingId/status
router.patch('/:trackingId/status', async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    const { status, note } = req.body;

    const VALID_STATUSES = ['submitted', 'under_review', 'assigned', 'in_progress', 'escalated', 'resolved', 'closed', 'rejected'];
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const existing = await getComplaint(trackingId.toUpperCase());
    if (!existing) return res.status(404).json({ error: 'Complaint not found.' });

    const now = new Date().toISOString();
    const historyEntry = { status, timestamp: now, note: note || '' };
    const updated = {
      ...existing,
      status,
      updatedAt: now,
      statusHistory: [...(existing.statusHistory || []), historyEntry],
      resolvedAt: ['resolved', 'closed'].includes(status) ? now : existing.resolvedAt,
    };

    await saveComplaint(updated);
    return res.json({ success: true, status, updatedAt: now });
  } catch (err) {
    next(err);
  }
});

// Export listAll for admin route (memory fallback)
function listAll() {
  return listComplaints({});
}

router.listAll = listAll;
module.exports = router;
