(function () {
  'use strict';

  const analyticsStats = document.getElementById('analyticsStats');
  const refreshBtn     = document.getElementById('refreshBtn');

  const PRIORITY_COLORS = {
    critical: '#7f1d1d',
    high:     '#b45309',
    medium:   '#1d4ed8',
    low:      '#166534',
  };

  const CATEGORY_COLORS = ['#8B0000','#b45309','#1d4ed8','#166534','#6b21a8','#0e7490','#be123c'];

  async function loadStats() {
    try {
      const resp = await fetch('/api/admin/stats');
      const stats = await resp.json();
      render(stats);
    } catch (err) {
      console.error('Analytics load error:', err);
    }
  }

  function render(stats) {
    renderSummaryCards(stats);
    renderBarChart('categoryChart', stats.byCategory || {}, CATEGORY_COLORS);
    renderPieChart('priorityChart', 'priorityLegend', stats.byPriority || {}, PRIORITY_COLORS);
    renderBarChart('departmentChart', stats.byDepartment || {}, CATEGORY_COLORS);
    renderBarChart('monthlyChart', sortedByMonth(stats.byMonth || {}), CATEGORY_COLORS);
    renderLocations(stats.recentComplaints || []);
  }

  function renderSummaryCards(stats) {
    analyticsStats.innerHTML = `
      <div class="admin-stat-card">
        <div class="admin-stat-icon stat-icon-total">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </div>
        <div><span class="admin-stat-num">${stats.total || 0}</span><div class="admin-stat-label">Total</div></div>
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

  function renderBarChart(containerId, dataObj, colors) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const entries = Object.entries(dataObj);
    if (!entries.length) { container.innerHTML = '<p style="color:#666;font-size:0.9rem;text-align:center;padding:1rem">No data available</p>'; return; }

    const max = Math.max(...entries.map(([, v]) => v), 1);
    container.innerHTML = entries
      .sort((a, b) => b[1] - a[1])
      .map(([label, count], i) => {
        const pct = Math.round((count / max) * 100);
        const color = colors[i % colors.length];
        return `
          <div class="bar-row">
            <div class="bar-label" title="${label}">${label}</div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${pct}%;background:${color}"></div>
            </div>
            <div class="bar-count">${count}</div>
          </div>
        `;
      }).join('');
  }

  function renderPieChart(chartId, legendId, dataObj, colorMap) {
    const chart  = document.getElementById(chartId);
    const legend = document.getElementById(legendId);
    if (!chart || !legend) return;

    const entries = Object.entries(dataObj);
    if (!entries.length) { chart.style.background = '#333'; legend.innerHTML = '<p style="color:#666;font-size:0.9rem">No data</p>'; return; }

    const total = entries.reduce((s, [, v]) => s + v, 0);
    let cumulPct = 0;
    const segments = entries.map(([key, val], i) => {
      const pct = (val / total) * 100;
      const color = colorMap[key] || CATEGORY_COLORS[i % CATEGORY_COLORS.length];
      const from = cumulPct;
      cumulPct += pct;
      return { key, val, pct, color, from, to: cumulPct };
    });

    const gradient = segments.map((s) => `${s.color} ${s.from.toFixed(1)}% ${s.to.toFixed(1)}%`).join(', ');
    chart.style.background = `conic-gradient(${gradient})`;

    legend.innerHTML = segments.map((s) => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${s.color}"></span>
        <span>${capitalise(s.key)} (${s.val})</span>
      </div>
    `).join('');
  }

  function renderLocations(complaints) {
    const container = document.getElementById('locationList');
    if (!container) return;
    const locationCounts = {};
    complaints.forEach((c) => {
      if (c.location) {
        // Use first 40 chars of location as key
        const key = c.location.slice(0, 60);
        locationCounts[key] = (locationCounts[key] || 0) + 1;
      }
    });
    const entries = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    if (!entries.length) {
      container.innerHTML = '<p class="location-empty">No location data available.</p>';
      return;
    }
    container.innerHTML = entries.map(([loc, count]) => `
      <div class="location-item">
        <span class="location-name">${loc}</span>
        <span class="location-count">${count} complaint${count > 1 ? 's' : ''}</span>
      </div>
    `).join('');
  }

  function sortedByMonth(byMonth) {
    return Object.fromEntries(
      Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b))
    );
  }

  function capitalise(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  }

  if (refreshBtn) refreshBtn.addEventListener('click', loadStats);
  loadStats();
})();
