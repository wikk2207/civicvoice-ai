/**
 * track.js — Complaint tracking logic for CivicVoice AI
 */

function showToast(msg, type = 'info') {
  const tc = document.getElementById('toastContainer');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>`;
  tc.appendChild(t);
  setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 350); }, 4500);
}

const STATUS_STEPS = [
  { key: 'submitted',    label: 'Submitted',    desc: 'Complaint received and logged' },
  { key: 'under_review', label: 'Under Review',  desc: 'Being reviewed by our team' },
  { key: 'assigned',     label: 'Assigned',       desc: 'Assigned to relevant department' },
  { key: 'in_progress',  label: 'In Progress',    desc: 'Department is working on it' },
  { key: 'resolved',     label: 'Resolved',       desc: 'Issue has been resolved' }
];

function statusClass(status) {
  const map = {
    submitted: 'status-submitted',
    under_review: 'status-under_review',
    assigned: 'status-assigned',
    in_progress: 'status-in_progress',
    resolved: 'status-resolved',
    rejected: 'status-rejected'
  };
  return map[status] || 'status-submitted';
}

function priorityClass(priority) {
  return `priority-${priority || 'medium'}`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function buildTimeline(complaint) {
  const container = document.getElementById('timelineSteps');
  if (!container) return;

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.key === complaint.status);
  const timelineEvents = {};
  (complaint.timeline || []).forEach(t => { timelineEvents[t.status] = t; });

  container.innerHTML = STATUS_STEPS.map((step, i) => {
    let cls = '';
    if (i < currentStatusIndex) cls = 'done';
    else if (i === currentStatusIndex) cls = 'active';
    const event = timelineEvents[step.key];
    const timeStr = event ? formatDate(event.timestamp) : '';
    const noteStr = event && event.note ? event.note : step.desc;
    return `
      <div class="timeline-step ${cls}">
        <div class="timeline-dot"></div>
        <h4>${step.label}</h4>
        <p>${noteStr}${timeStr ? ` — <em>${timeStr}</em>` : ''}</p>
      </div>
    `;
  }).join('');
}

function displayResult(complaint) {
  const panel = document.getElementById('resultPanel');
  const notFound = document.getElementById('notFoundPanel');
  if (!panel || !notFound) return;

  notFound.style.display = 'none';

  document.getElementById('resTrackingId').textContent = complaint.trackingId || '—';

  // Status badge
  const badge = document.getElementById('resBadge');
  const status = complaint.status || 'submitted';
  badge.className = `status-badge ${statusClass(status)}`;
  badge.textContent = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Priority badge
  const prioBadge = document.getElementById('resPriorityBadge');
  const priority = complaint.priority || 'medium';
  prioBadge.className = `priority-badge ${priorityClass(priority)}`;
  prioBadge.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);

  // Details grid
  const grid = document.getElementById('detailsGrid');
  grid.innerHTML = [
    { label: 'Category',   value: complaint.category   || '—' },
    { label: 'Department', value: complaint.department  || '—' },
    { label: 'Location',   value: complaint.location    || '—' },
    { label: 'Submitted',  value: formatDate(complaint.createdAt) },
    { label: 'Updated',    value: formatDate(complaint.updatedAt) },
    { label: 'Name',       value: complaint.name        || 'Anonymous' }
  ].map(({ label, value }) =>
    `<div class="detail-item"><label>${label}</label><span>${value}</span></div>`
  ).join('');

  // Description
  document.getElementById('resDescription').textContent = complaint.description || '—';

  // Timeline
  buildTimeline(complaint);

  panel.classList.add('visible');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function searchComplaint(trackingId) {
  const trackBtn     = document.getElementById('trackBtn');
  const trackBtnText = document.getElementById('trackBtnText');
  const trackSpinner = document.getElementById('trackSpinner');
  const resultPanel  = document.getElementById('resultPanel');
  const notFound     = document.getElementById('notFoundPanel');

  if (!trackingId) { showToast('Please enter a tracking ID.', 'error'); return; }

  const id = trackingId.trim().toUpperCase();
  if (!/^CV-[A-Z0-9]{6}$/.test(id)) {
    showToast('Invalid format. Expected CV-XXXXXX (e.g. CV-ABC123).', 'error');
    return;
  }

  trackBtn.disabled = true;
  if (trackBtnText) trackBtnText.textContent = 'Searching…';
  if (trackSpinner) trackSpinner.style.display = 'inline-block';
  if (resultPanel)  resultPanel.classList.remove('visible');
  if (notFound)     notFound.style.display = 'none';

  try {
    const res  = await fetch(`/api/complaints/${id}`);
    const data = await res.json();
    if (data.success && data.complaint) {
      displayResult(data.complaint);
    } else {
      if (notFound) notFound.style.display = 'block';
    }
  } catch {
    showToast('Network error. Please try again.', 'error');
  } finally {
    trackBtn.disabled = false;
    if (trackBtnText) trackBtnText.textContent = 'Search';
    if (trackSpinner) trackSpinner.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const trackInput = document.getElementById('trackInput');
  const trackBtn   = document.getElementById('trackBtn');

  if (trackInput) {
    trackInput.addEventListener('input', () => {
      trackInput.value = trackInput.value.toUpperCase();
    });
    trackInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchComplaint(trackInput.value);
    });
  }

  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      searchComplaint(trackInput ? trackInput.value : '');
    });
  }

  // Auto-search if ID in URL query
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  if (idParam && trackInput) {
    trackInput.value = idParam.toUpperCase();
    searchComplaint(idParam);
  }
});
