(function () {
  'use strict';

  const statsGrid    = document.getElementById('statsGrid');
  const tableBody    = document.getElementById('tableBody');
  const searchInput  = document.getElementById('searchInput');
  const filterStatus = document.getElementById('filterStatus');
  const filterCat    = document.getElementById('filterCategory');
  const filterPri    = document.getElementById('filterPriority');
  const refreshBtn   = document.getElementById('refreshBtn');
  const toastContainer = document.getElementById('toastContainer');

  let allComplaints = [];

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
    return new Date(iso).toLocaleDateString('en-IN', { dateStyle: 'medium' });
  }

  async function loadData() {
    try {
      const [statsResp, complaintsResp] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/complaints'),
      ]);
      const stats = await statsResp.json();
      const complaints = await complaintsResp.json();
      allComplaints = complaints;
      renderStats(stats);
      renderTable(complaints);
    } catch (err) {
      showToast('Failed to load data: ' + err.message, 'error');
    }
  }

  function renderStats(stats) {
    statsGrid.innerHTML = `
      <div class="admin-stat-card">
        <div class="admin-stat-icon stat-icon-total">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div><span class="admin-stat-num">${stats.total || 0}</span><div class="admin-stat-label">Total Complaints</div></div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon stat-icon-pending">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div><span class="admin-stat-num">${stats.pending || 0}</span><div class="admin-stat-label">Pending</div></div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon stat-icon-progress">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div><span class="admin-stat-num">${stats.inProgress || 0}</span><div class="admin-stat-label">In Progress</div></div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon stat-icon-resolved">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div><span class="admin-stat-num">${stats.resolved || 0}</span><div class="admin-stat-label">Resolved</div></div>
      </div>
    `;
  }

  function renderTable(complaints) {
    if (!complaints.length) {
      tableBody.innerHTML = '<tr><td colspan="9" class="table-empty">No complaints found.</td></tr>';
      return;
    }

    tableBody.innerHTML = complaints.map((c) => {
      const imgCell = (c.imageUrls && c.imageUrls.length > 0)
        ? `<img src="${c.imageUrls[0]}" alt="Evidence" class="table-thumb" />`
        : '—';

      const statusOptions = ['submitted','under_review','assigned','in_progress','escalated','resolved','closed','rejected']
        .map((s) => `<option value="${s}" ${s === c.status ? 'selected' : ''}>${s.replace(/_/g, ' ')}</option>`)
        .join('');

      return `
        <tr data-id="${c.trackingId}">
          <td class="table-id">${c.trackingId || '—'}</td>
          <td class="table-title" title="${(c.title || c.description || '').replace(/"/g, '&quot;')}">${truncate(c.title || c.description, 50)}</td>
          <td>${c.categoryLabel || c.category || '—'}</td>
          <td>${truncate(c.department, 30)}</td>
          <td><span class="priority-badge priority-${c.priority}">${c.priority || '—'}</span></td>
          <td>
            <select class="status-select-inline" data-id="${c.trackingId}" aria-label="Change status">
              ${statusOptions}
            </select>
          </td>
          <td>${formatDate(c.createdAt)}</td>
          <td>${imgCell}</td>
          <td>
            <a href="/track?id=${c.trackingId}" class="btn btn-dark btn-sm" target="_blank">View</a>
          </td>
        </tr>
      `;
    }).join('');

    // Attach status change listeners
    tableBody.querySelectorAll('.status-select-inline').forEach((sel) => {
      sel.addEventListener('change', async () => {
        const id = sel.dataset.id;
        const newStatus = sel.value;
        try {
          const resp = await fetch(`/api/complaints/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
          });
          if (!resp.ok) throw new Error('Update failed');
          showToast(`Status updated to "${newStatus.replace(/_/g, ' ')}"`, 'success');
        } catch (err) {
          showToast('Failed to update status: ' + err.message, 'error');
        }
      });
    });
  }

  function truncate(str, max) {
    if (!str) return '—';
    return str.length > max ? str.slice(0, max) + '…' : str;
  }

  function filterAndRender() {
    const query    = searchInput.value.toLowerCase();
    const status   = filterStatus.value;
    const category = filterCat.value;
    const priority = filterPri.value;

    const filtered = allComplaints.filter((c) => {
      const matchQuery = !query ||
        (c.trackingId || '').toLowerCase().includes(query) ||
        (c.title || '').toLowerCase().includes(query) ||
        (c.categoryLabel || '').toLowerCase().includes(query) ||
        (c.department || '').toLowerCase().includes(query);
      const matchStatus   = !status   || c.status === status;
      const matchCategory = !category || c.category === category;
      const matchPriority = !priority || c.priority === priority;
      return matchQuery && matchStatus && matchCategory && matchPriority;
    });
    renderTable(filtered);
  }

  searchInput.addEventListener('input', filterAndRender);
  filterStatus.addEventListener('change', filterAndRender);
  filterCat.addEventListener('change', filterAndRender);
  filterPri.addEventListener('change', filterAndRender);
  refreshBtn.addEventListener('click', loadData);

  loadData();
})();
