'use strict';

const express = require('express');
const router = express.Router();
const { db, memoryStore } = require('../config/firebase');

// GET /complaints - Get all complaints with optional filters
router.get('/complaints', async (req, res, next) => {
  try {
    const { status, priority, category, department, search } = req.query;
    let complaints = [];

    if (db) {
      let query = db.collection('complaints').orderBy('createdAt', 'desc');
      if (status) query = query.where('status', '==', status);
      if (priority) query = query.where('priority', '==', priority);
      if (category) query = query.where('category', '==', category);
      if (department) query = query.where('department', '==', department);
      const snapshot = await query.get();
      complaints = snapshot.docs.map(d => d.data());
    } else {
      complaints = [...memoryStore.complaints].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      if (status) complaints = complaints.filter(c => c.status === status);
      if (priority) complaints = complaints.filter(c => c.priority === priority);
      if (category) complaints = complaints.filter(c => c.category === category);
      if (department) complaints = complaints.filter(c => c.department === department);
    }

    if (search) {
      const q = search.toLowerCase();
      complaints = complaints.filter(c =>
        (c.trackingId && c.trackingId.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, complaints, total: complaints.length });
  } catch (err) {
    next(err);
  }
});

// GET /stats - Dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    let complaints = [];

    if (db) {
      const snapshot = await db.collection('complaints').get();
      complaints = snapshot.docs.map(d => d.data());
    } else {
      complaints = memoryStore.complaints;
    }

    const total = complaints.length;
    const byStatus = {};
    const byCategory = {};
    const byPriority = {};
    const byDepartment = {};
    const byDate = {};

    for (const c of complaints) {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
      byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
      byDepartment[c.department] = (byDepartment[c.department] || 0) + 1;
      const date = (c.createdAt || '').slice(0, 10);
      if (date) byDate[date] = (byDate[date] || 0) + 1;
    }

    res.json({
      success: true,
      stats: {
        total,
        pending: (byStatus['submitted'] || 0) + (byStatus['under_review'] || 0),
        inProgress: (byStatus['assigned'] || 0) + (byStatus['in_progress'] || 0),
        resolved: byStatus['resolved'] || 0,
        byStatus,
        byCategory,
        byPriority,
        byDepartment,
        byDate
      }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /complaints/:trackingId - Update complaint
router.put('/complaints/:trackingId', async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    const updates = req.body;

    // Whitelist allowed fields
    const allowed = ['status', 'priority', 'category', 'department', 'assignedTo', 'notes'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) filtered[key] = updates[key];
    }
    filtered.updatedAt = new Date().toISOString();

    if (updates.status) {
      filtered['timeline'] = null; // handled below
    }

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
      const updateData = { ...filtered };
      delete updateData.timeline;
      if (updates.status) {
        updateData.timeline = [
          ...(existing.timeline || []),
          { status: updates.status, timestamp: new Date().toISOString(), note: updates.note || `Status updated to ${updates.status}` }
        ];
      }
      await doc.ref.update(updateData);
    } else {
      const complaint = memoryStore.complaints.find(
        c => c.trackingId === trackingId.toUpperCase()
      );
      if (!complaint) {
        return res.status(404).json({ success: false, error: 'Complaint not found' });
      }
      Object.assign(complaint, filtered);
      delete complaint.timeline;
      if (updates.status) {
        complaint.timeline = [
          ...(complaint.timeline || []),
          { status: updates.status, timestamp: new Date().toISOString(), note: updates.note || `Status updated to ${updates.status}` }
        ];
      }
    }

    res.json({ success: true, message: 'Complaint updated successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
