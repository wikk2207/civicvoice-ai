/**
 * admin.js — Admin dashboard logic for CivicVoice AI
 */

let allComplaints = [];
let currentTrackingId = null;

function showToast(msg, type = 'info') {
  const tc = document.getElementById('toastContainer');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>`;
  tc.appendChild(t);
  setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 350); }, 4500);
}

function statusBadge(status) {
  const map = {
    submitted: { cls:'status-submitted', label:'Submitted' },
    under_review: { cls:'status-under_review', label:'Under Review' },
    assigned: { cls:'status-assigned', label:'Assigned' },
    in_progress: { cls:'status-in_progress', label:'In Progress' },
    resolved: { cls:'status-resolved', label:'Resolved' },
    rejected: { cls:'status-rejected', label:'Rejected' }
  };
  const s = map[status] || { cls:'status-submitted', label: status };
  return `<span class="status-badge ${s.cls}">${s.label}</span>`;
}

function priorityBadge(priority) {
  const label = priority ? (priority.charAt(0).toUpperCase() + priority.slice(1)) : 'Medium';
  return `<span class="priority-badge priority-${priority || 'medium'}">${label}</span>`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncate(str, n = 60) {
  if (!str) return '—';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function renderTable(complaints) {
  const tbody = document.getElementById('complaintsBody');
  const info  = document.getElementById('paginationInfo');
  if (!tbody) return;

  if (!complaints.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--dark-muted);">No complaints found</td></tr>`;
    if (info) info.textContent = '';
    return;
  }

  tbody.innerHTML = complaints.map(c => `
    <tr>
      <td><span style="font-family:monospace;font-weight:700;color:var(--primary-light);">${c.trackingId || '—'}</span></td>
      <td title="${c.description || ''}">${truncate(c.description, 55)}</td>
      <td>${truncate(c.location, 30)}</td>
      <td style="font-size:0.8rem;">${c.category || '—'}</td>
      <td>${priorityBadge(c.priority)}</td>
      <td>${statusBadge(c.status)}</td>
      <td style="font-size:0.8rem;color:var(--dark-muted);">${formatDate(c.createdAt)}</td>
      <td>
        <button class="btn-dark" style="padding:0.3rem 0.7rem;font-size:0.78rem;" onclick="openModal('${c.trackingId}')">
          Edit
        </button>
      </td>
    </tr>
  `).join('');

  if (info) info.textContent = `Showing ${complaints.length} complaint${complaints.length !== 1 ? 's' : ''}`;
}

function updateStats(complaints) {
  const total      = complaints.length;
  const pending    = complaints.filter(c => ['submitted','under_review'].includes(c.status)).length;
  const inProgress = complaints.filter(c => ['assigned','in_progress'].includes(c.status)).length;
  const resolved   = complaints.filter(c => c.status === 'resolved').length;

  document.getElementById('statTotal').textContent      = total;
  document.getElementById('statPending').textContent    = pending;
  document.getElementById('statInProgress').textContent = inProgress;
  document.getElementById('statResolved').textContent   = resolved;
}

async function loadComplaints(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.status)   params.set('status',   filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.category) params.set('category', filters.category);
    if (filters.search)   params.set('search',   filters.search);

    const res  = await fetch(`/api/admin/complaints?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      allComplaints = data.complaints || [];
      renderTable(allComplaints);
      updateStats(allComplaints);
      const updated = document.getElementById('lastUpdated');
      if (updated) updated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
  } catch (err) {
    showToast('Failed to load complaints.', 'error');
  }
}

function getFilters() {
  return {
    status:   document.getElementById('statusFilter')?.value   || '',
    priority: document.getElementById('priorityFilter')?.value || '',
    category: document.getElementById('categoryFilter')?.value || '',
    search:   document.getElementById('searchInput')?.value    || ''
  };
}

/* ── Modal ──────────────────────────────────────────────────── */
function openModal(trackingId) {
  currentTrackingId = trackingId;
  const complaint = allComplaints.find(c => c.trackingId === trackingId);
  if (!complaint) return;

  const content = document.getElementById('modalContent');
  if (!content) return;

  content.innerHTML = `
    <div style="margin-bottom:1rem;">
      <div style="color:var(--dark-muted);font-size:0.78rem;margin-bottom:0.8rem;">
        Tracking: <strong style="color:var(--primary-light);">${complaint.trackingId}</strong>
      </div>
      <p style="color:var(--dark-text);font-size:0.88rem;line-height:1.6;margin-bottom:1rem;">${complaint.description || '—'}</p>
    </div>

    <div class="form-group">
      <label class="form-label" style="color:var(--dark-muted);">Status</label>
      <select class="dark-select" id="modalStatus" style="width:100%;padding:0.6rem;">
        <option value="submitted"    ${complaint.status==='submitted'    ? 'selected':''}>Submitted</option>
        <option value="under_review" ${complaint.status==='under_review' ? 'selected':''}>Under Review</option>
        <option value="assigned"     ${complaint.status==='assigned'     ? 'selected':''}>Assigned</option>
        <option value="in_progress"  ${complaint.status==='in_progress'  ? 'selected':''}>In Progress</option>
        <option value="resolved"     ${complaint.status==='resolved'     ? 'selected':''}>Resolved</option>
        <option value="rejected"     ${complaint.status==='rejected'     ? 'selected':''}>Rejected</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label" style="color:var(--dark-muted);">Priority</label>
      <select class="dark-select" id="modalPriority" style="width:100%;padding:0.6rem;">
        <option value="critical" ${complaint.priority==='critical'?'selected':''}>Critical</option>
        <option value="high"     ${complaint.priority==='high'    ?'selected':''}>High</option>
        <option value="medium"   ${complaint.priority==='medium'  ?'selected':''}>Medium</option>
        <option value="low"      ${complaint.priority==='low'     ?'selected':''}>Low</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label" style="color:var(--dark-muted);">Note (optional)</label>
      <textarea class="dark-input" id="modalNote" rows="2" style="width:100%;padding:0.6rem;resize:vertical;" placeholder="Add a note about this update…"></textarea>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay')?.classList.remove('open');
  currentTrackingId = null;
}

async function saveModal() {
  if (!currentTrackingId) return;

  const status   = document.getElementById('modalStatus')?.value;
  const priority = document.getElementById('modalPriority')?.value;
  const note     = document.getElementById('modalNote')?.value.trim();

  const saveBtn  = document.getElementById('modalSave');
  const saveText = document.getElementById('modalSaveText');
  const spinner  = document.getElementById('modalSpinner');

  saveBtn.disabled = true;
  if (saveText) saveText.textContent = 'Saving…';
  if (spinner)  spinner.style.display = 'inline-block';

  try {
    const res = await fetch(`/api/admin/complaints/${currentTrackingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, priority, note })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Complaint updated successfully.', 'success');
      closeModal();
      loadComplaints(getFilters());
    } else {
      showToast(data.error || 'Update failed.', 'error');
    }
  } catch {
    showToast('Network error. Please try again.', 'error');
  } finally {
    saveBtn.disabled = false;
    if (saveText) saveText.textContent = 'Save';
    if (spinner)  spinner.style.display = 'none';
  }
}

window.openModal = openModal;

/* ── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadComplaints();

  document.getElementById('refreshBtn')?.addEventListener('click', () => loadComplaints(getFilters()));
  document.getElementById('applyFiltersBtn')?.addEventListener('click', () => loadComplaints(getFilters()));
  document.getElementById('clearFiltersBtn')?.addEventListener('click', () => {
    ['statusFilter','priorityFilter','categoryFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const si = document.getElementById('searchInput');
    if (si) si.value = '';
    loadComplaints();
  });

  document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loadComplaints(getFilters());
  });

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalSave')?.addEventListener('click', saveModal);
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  // Auto-refresh every 60 seconds
  setInterval(() => loadComplaints(getFilters()), 60000);
});
