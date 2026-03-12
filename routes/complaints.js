'use strict';

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db, memoryStore } = require('../config/firebase');
const { classifyComplaint } = require('../services/classifier');

function generateTrackingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'CV-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// POST / - Create new complaint
router.post('/', async (req, res, next) => {
  try {
    const { title, description, name, email, phone, location, language, files } = req.body;

    if (!description || !location) {
      return res.status(400).json({ success: false, error: 'Description and location are required' });
    }

    const classification = classifyComplaint(description);
    const trackingId = generateTrackingId();

    const complaint = {
      id: uuidv4(),
      trackingId,
      title: title || '',
      description,
      name: name || 'Anonymous',
      email: email || '',
      phone: phone || '',
      location,
      language: language || 'en',
      files: files || [],
      status: 'submitted',
      category: classification.category,
      department: classification.department,
      priority: classification.priority,
      confidence: classification.confidence,
      timeline: [
        { status: 'submitted', timestamp: new Date().toISOString(), note: 'Complaint received' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (db) {
      await db.collection('complaints').doc(complaint.id).set(complaint);
    } else {
      memoryStore.complaints.push(complaint);
    }

    res.status(201).json({
      success: true,
      trackingId,
      classification,
      message: 'Complaint submitted successfully'
    });
  } catch (err) {
    next(err);
  }
});

// GET /:trackingId - Get complaint by tracking ID
router.get('/:trackingId', async (req, res, next) => {
  try {
    const { trackingId } = req.params;

    let complaint;
    if (db) {
      const snapshot = await db.collection('complaints')
        .where('trackingId', '==', trackingId.toUpperCase())
        .limit(1)
        .get();
      if (!snapshot.empty) {
        complaint = snapshot.docs[0].data();
      }
    } else {
      complaint = memoryStore.complaints.find(
        c => c.trackingId === trackingId.toUpperCase()
      );
    }

    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    next(err);
  }
});

// PUT /:trackingId/status - Update complaint status
router.put('/:trackingId/status', async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const timelineEntry = {
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}`
    };

    if (db) {
      const snapshot = await db.collection('complaints')
        .where('trackingId', '==', trackingId.toUpperCase())
        .limit(1)
        .get();
      if (snapshot.empty) {
        return res.status(404).json({ success: false, error: 'Complaint not found' });
      }
      const doc = snapshot.docs[0];
      const existing = doc.data();
      await doc.ref.update({
        status,
        updatedAt: new Date().toISOString(),
        timeline: [...(existing.timeline || []), timelineEntry]
      });
    } else {
      const complaint = memoryStore.complaints.find(
        c => c.trackingId === trackingId.toUpperCase()
      );
      if (!complaint) {
        return res.status(404).json({ success: false, error: 'Complaint not found' });
      }
      complaint.status = status;
      complaint.updatedAt = new Date().toISOString();
      complaint.timeline = [...(complaint.timeline || []), timelineEntry];
    }

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
