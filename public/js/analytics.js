/**
 * analytics.js — Analytics charts using Canvas API (no external libraries)
 */

const COLORS = {
  primary:  '#8B0000',
  red:      '#c0392b',
  orange:   '#e67e22',
  yellow:   '#f1c40f',
  green:    '#2ecc71',
  teal:     '#1abc9c',
  blue:     '#3498db',
  purple:   '#9b59b6',
  grey:     '#7f8c8d',
  dark:     '#444',
  bg:       '#1e1e1e',
  border:   '#333',
  text:     '#e0e0e0',
  muted:    '#888'
};

const CATEGORY_COLORS = ['#8B0000','#c0392b','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#7f8c8d','#555'];
const STATUS_COLORS   = { submitted:'#3498db', under_review:'#e67e22', assigned:'#9b59b6', in_progress:'#8B0000', resolved:'#2ecc71', rejected:'#c0392b' };
const PRIORITY_COLORS = { critical:'#c0392b', high:'#e67e22', medium:'#3498db', low:'#2ecc71' };

function showToast(msg, type = 'info') {
  const tc = document.getElementById('toastContainer');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>`;
  tc.appendChild(t);
  setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 350); }, 4500);
}

/* ── Canvas helpers ─────────────────────────────────────────── */
function clearCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return ctx;
}

function setupCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  canvas.width  = canvas.offsetWidth  || canvas.parentElement.clientWidth  || 400;
  // Preserve explicit height attribute; fall back to offsetHeight or default
  const attrH = parseInt(canvas.getAttribute('height'), 10);
  if (!attrH) canvas.height = canvas.offsetHeight || 260;
  return canvas;
}

/* ── Bar Chart ──────────────────────────────────────────────── */
function drawBarChart(canvasId, labels, values, colors) {
  const canvas = setupCanvas(canvasId);
  if (!canvas) return;
  const ctx  = clearCanvas(canvas);
  const W    = canvas.width;
  const H    = canvas.height;
  const pad  = { top: 20, right: 20, bottom: 60, left: 40 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top  - pad.bottom;
  const max  = Math.max(...values, 1);

  // Grid lines
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 0.5;
  const gridLines = 4;
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + chartH - (i / gridLines) * chartH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
    ctx.fillStyle = COLORS.muted;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / gridLines) * max), pad.left - 6, y + 4);
  }

  // Bars
  const barW   = Math.min(chartW / labels.length * 0.65, 50);
  const gap    = chartW / labels.length;

  labels.forEach((label, i) => {
    const x   = pad.left + i * gap + (gap - barW) / 2;
    const barH = (values[i] / max) * chartH;
    const y   = pad.top + chartH - barH;
    const color = Array.isArray(colors) ? (colors[i % colors.length]) : colors;

    // Bar
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, barH, 4) : ctx.rect(x, y, barW, barH);
    ctx.fill();

    // Value label
    ctx.fillStyle = COLORS.text;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    if (values[i] > 0) ctx.fillText(values[i], x + barW / 2, y - 4);

    // X label — rotate if long
    ctx.save();
    ctx.translate(x + barW / 2, pad.top + chartH + 8);
    ctx.rotate(-0.45);
    ctx.fillStyle = COLORS.muted;
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(label.length > 14 ? label.slice(0, 12) + '…' : label, 0, 0);
    ctx.restore();
  });
}

/* ── Pie / Donut Chart ──────────────────────────────────────── */
function drawPieChart(canvasId, labels, values, colors, donut = true) {
  const canvas = setupCanvas(canvasId);
  if (!canvas) return;
  const ctx  = clearCanvas(canvas);
  const W    = canvas.width;
  const H    = canvas.height;
  const cx   = W * 0.38;
  const cy   = H / 2;
  const r    = Math.min(cx, cy) - 18;
  const total = values.reduce((a, b) => a + b, 0) || 1;

  let startAngle = -Math.PI / 2;
  labels.forEach((label, i) => {
    const slice = (values[i] / total) * 2 * Math.PI;
    const color = Array.isArray(colors) ? colors[i % colors.length] : colors;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = COLORS.bg;
    ctx.lineWidth = 2;
    ctx.stroke();
    startAngle += slice;
  });

  // Donut hole
  if (donut) {
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.52, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.bg;
    ctx.fill();
    ctx.fillStyle = COLORS.muted;
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(values.reduce((a, b) => a + b, 0), cx, cy + 6);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = COLORS.muted;
    ctx.fillText('total', cx, cy + 20);
  }

  // Legend
  const legendX = W * 0.66;
  const lineH   = 22;
  const startY  = cy - (labels.length * lineH) / 2;
  labels.forEach((label, i) => {
    const y = startY + i * lineH;
    const color = Array.isArray(colors) ? colors[i % colors.length] : colors;
    ctx.fillStyle = color;
    ctx.fillRect(legendX, y - 8, 12, 12);
    ctx.fillStyle = COLORS.text;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    const pct = total > 0 ? Math.round((values[i] / total) * 100) : 0;
    ctx.fillText(`${label} (${pct}%)`, legendX + 16, y + 2);
  });
}

/* ── Line Chart ─────────────────────────────────────────────── */
function drawLineChart(canvasId, labels, values, color = COLORS.primary) {
  const canvas = setupCanvas(canvasId);
  if (!canvas) return;
  const ctx  = clearCanvas(canvas);
  const W    = canvas.width;
  const H    = canvas.height;
  const pad  = { top: 20, right: 30, bottom: 50, left: 45 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top  - pad.bottom;
  const max  = Math.max(...values, 1);

  // Grid
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 0.5;
  const gridLines = 4;
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + chartH - (i / gridLines) * chartH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
    ctx.fillStyle = COLORS.muted;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / gridLines) * max), pad.left - 6, y + 4);
  }

  if (labels.length < 2) return;

  const xStep = chartW / (labels.length - 1);

  // Fill under line
  const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  gradient.addColorStop(0,   color + '55');
  gradient.addColorStop(1,   color + '05');
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH);
  labels.forEach((_, i) => {
    const x = pad.left + i * xStep;
    const y = pad.top + chartH - (values[i] / max) * chartH;
    i === 0 ? ctx.lineTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + (labels.length - 1) * xStep, pad.top + chartH);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  labels.forEach((_, i) => {
    const x = pad.left + i * xStep;
    const y = pad.top + chartH - (values[i] / max) * chartH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots + X labels
  labels.forEach((label, i) => {
    const x = pad.left + i * xStep;
    const y = pad.top + chartH - (values[i] / max) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // X label
    if (i % Math.ceil(labels.length / 10) === 0 || i === labels.length - 1) {
      ctx.fillStyle = COLORS.muted;
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, pad.top + chartH + 16);
    }
  });
}

/* ── Fetch & Render ─────────────────────────────────────────── */
async function loadAnalytics() {
  try {
    const res  = await fetch('/api/admin/stats');
    const data = await res.json();
    if (!data.success) { showToast('Failed to load stats.', 'error'); return; }

    const { stats } = data;

    // Summary
    const total    = stats.total || 0;
    const resolved = stats.resolved || 0;
    const pending  = stats.pending  || 0;
    const rate     = total > 0 ? Math.round((resolved / total) * 100) : 0;

    document.getElementById('aTotalComplaints').textContent = total;
    document.getElementById('aResolved').textContent        = resolved;
    document.getElementById('aPending').textContent         = pending;
    document.getElementById('aResolutionRate').textContent  = rate + '%';

    const updated = document.getElementById('analyticsUpdated');
    if (updated) updated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

    // Category bar chart
    const catKeys  = Object.keys(stats.byCategory || {});
    const catVals  = catKeys.map(k => stats.byCategory[k]);
    drawBarChart('categoryChart', catKeys, catVals, CATEGORY_COLORS);

    // Status pie chart
    const stKeys = Object.keys(stats.byStatus || {});
    const stVals = stKeys.map(k => stats.byStatus[k]);
    const stColors = stKeys.map(k => STATUS_COLORS[k] || COLORS.grey);
    drawPieChart('statusChart', stKeys.map(k => k.replace(/_/g,' ')), stVals, stColors);

    // Timeline line chart (last 14 days)
    const today = new Date();
    const days  = [];
    const counts = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(key.slice(5));   // MM-DD
      counts.push((stats.byDate || {})[key] || 0);
    }
    drawLineChart('timelineChart', days, counts, COLORS.primary);

    // Priority pie
    const priKeys  = Object.keys(stats.byPriority || {});
    const priVals  = priKeys.map(k => stats.byPriority[k]);
    const priClrs  = priKeys.map(k => PRIORITY_COLORS[k] || COLORS.grey);
    drawPieChart('priorityChart', priKeys.map(k => k.charAt(0).toUpperCase()+k.slice(1)), priVals, priClrs);

    // Department horizontal bar
    const deptKeys = Object.keys(stats.byDepartment || {}).slice(0, 8);
    const deptVals = deptKeys.map(k => stats.byDepartment[k]);
    const deptLabels = deptKeys.map(k => k.replace(' Department','').replace(' Board','').replace(' &','&'));
    drawBarChart('deptChart', deptLabels, deptVals, CATEGORY_COLORS.slice(0, deptKeys.length));

  } catch (err) {
    showToast('Failed to load analytics.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAnalytics();
  document.getElementById('refreshAnalytics')?.addEventListener('click', loadAnalytics);
  setInterval(loadAnalytics, 120000);
});
