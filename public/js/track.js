(function () {
  'use strict';

  const trackingInput = document.getElementById('trackingInput');
  const trackBtn      = document.getElementById('trackBtn');
  const trackLoading  = document.getElementById('trackLoading');
  const notFound      = document.getElementById('notFound');
  const resultsPanel  = document.getElementById('resultsPanel');
  const toastContainer= document.getElementById('toastContainer');

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-msg">${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slide-out 0.3s ease forwards';
      setTimeout(() => toast.remove(), 320);
    }, 4000);
  }

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function statusClass(status) {
    return 'status-' + (status || 'submitted');
  }

  function priorityClass(priority) {
    return 'priority-' + (priority || 'medium');
  }

  async function track() {
    const id = trackingInput.value.trim().toUpperCase();
    if (!id) { showToast('Please enter a tracking ID.', 'error'); return; }
    if (!/^CV-\d{8}-[A-Z0-9]{8}$/.test(id)) {
      showToast('Invalid tracking ID format. Expected: CV-YYYYMMDD-XXXXXXXX', 'error');
      return;
    }

    // Reset UI
    notFound.hidden = true;
    resultsPanel.hidden = true;
    trackLoading.hidden = false;

    try {
      const resp = await fetch(`/api/complaints/track/${id}`);
      trackLoading.hidden = true;

      if (resp.status === 404) { notFound.hidden = false; return; }
      if (!resp.ok) throw new Error('Server error. Please try again.');

      const complaint = await resp.json();
      renderResults(complaint);
    } catch (err) {
      trackLoading.hidden = true;
      showToast('Error: ' + err.message, 'error');
    }
  }

  function renderResults(c) {
    resultsPanel.hidden = false;

    // Badges
    const sb = document.getElementById('statusBadge');
    const pb = document.getElementById('priorityBadge');
    sb.textContent = (c.status || 'submitted').replace(/_/g, ' ').toUpperCase();
    sb.className = 'status-badge ' + statusClass(c.status);
    pb.textContent = (c.priority || 'medium').toUpperCase();
    pb.className = 'priority-badge ' + priorityClass(c.priority);

    // Meta
    document.getElementById('metaTrackingId').textContent  = c.trackingId || '—';
    document.getElementById('metaCategory').textContent    = c.categoryLabel || c.category || '—';
    document.getElementById('metaDepartment').textContent  = c.department || '—';
    document.getElementById('metaDate').textContent        = formatDate(c.createdAt);

    // Description & Location
    document.getElementById('detailDescription').textContent = c.description || '—';
    document.getElementById('detailLocation').textContent    = c.location || '—';

    // Images
    const imagesCard = document.getElementById('imagesCard');
    const trackImages = document.getElementById('trackImages');
    if (c.imageUrls && c.imageUrls.length > 0) {
      imagesCard.hidden = false;
      trackImages.innerHTML = c.imageUrls.map((url) =>
        `<img src="${url}" alt="Complaint image" loading="lazy" />`
      ).join('');
    } else {
      imagesCard.hidden = true;
    }

    // Timeline
    renderTimeline(c.statusHistory || [], c.status);
  }

  const TIMELINE_STEPS = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved'];

  function renderTimeline(history, currentStatus) {
    const container = document.getElementById('timeline');
    container.innerHTML = '';

    if (history.length === 0) {
      container.innerHTML = '<p style="color:var(--clr-gray-400);font-size:0.9rem;">No status history available.</p>';
      return;
    }

    history.forEach((entry, i) => {
      const isActive = i === history.length - 1 && !['resolved', 'closed', 'rejected'].includes(currentStatus);
      const isDone   = i < history.length - 1 || ['resolved', 'closed'].includes(entry.status);

      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-dot ${isActive ? 'active' : isDone ? 'done' : ''}"></div>
        <div class="timeline-date">${formatDate(entry.timestamp)}</div>
        <div class="timeline-status">${(entry.status || '').replace(/_/g, ' ')}</div>
        ${entry.note ? `<div class="timeline-note">${entry.note}</div>` : ''}
      `;
      container.appendChild(item);
    });
  }

  trackBtn.addEventListener('click', track);
  trackingInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') track(); });
  trackingInput.addEventListener('input', () => {
    trackingInput.value = trackingInput.value.toUpperCase();
  });

  // Auto-track from URL query param
  const params = new URLSearchParams(window.location.search);
  const preId = params.get('id');
  if (preId) {
    trackingInput.value = preId.toUpperCase();
    track();
  }
})();
