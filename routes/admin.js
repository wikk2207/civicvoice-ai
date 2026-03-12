'use strict';

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Re-use the in-memory fallback from complaints route (shared module pattern)
// We require complaints to access its shared memStore indirectly via the route's list
const complaintsRouter = require('./complaints');

// GET /api/admin/stats
router.get('/stats', async (req, res, next) => {
  try {
    let complaints = [];

    if (db) {
      const snap = await db.collection('complaints').get();
      complaints = snap.docs.map((d) => d.data());
    } else {
      // Fetch from local complaints API handler (memory store)
      const fetch = await listFromMemory();
      complaints = fetch;
    }

    const total = complaints.length;
    const byStatus = {};
    const byCategory = {};
    const byPriority = {};
    const byDepartment = {};
    const byMonth = {};

    for (const c of complaints) {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      byCategory[c.categoryLabel || c.category] = (byCategory[c.categoryLabel || c.category] || 0) + 1;
      byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
      byDepartment[c.department] = (byDepartment[c.department] || 0) + 1;

      if (c.createdAt) {
        const month = c.createdAt.slice(0, 7); // YYYY-MM
        byMonth[month] = (byMonth[month] || 0) + 1;
      }
    }

    const recentComplaints = complaints
      .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
      .slice(0, 10);

    return res.json({
      total,
      pending: byStatus['submitted'] || 0,
      inProgress: (byStatus['in_progress'] || 0) + (byStatus['assigned'] || 0) + (byStatus['under_review'] || 0),
      resolved: (byStatus['resolved'] || 0) + (byStatus['closed'] || 0),
      byStatus,
      byCategory,
      byPriority,
      byDepartment,
      byMonth,
      recentComplaints,
    });
  } catch (err) {
    next(err);
  }
});

// Fallback: access memStore via internal HTTP (not used here — we share the reference)
async function listFromMemory() {
  // Access the shared memory store via the complaints module
  // Since it's a Map defined in the module scope, we reach it through a helper
  try {
    const { listAll } = require('./complaints');
    if (typeof listAll === 'function') return await listAll();
  } catch {}
  return [];
}

module.exports = router;
