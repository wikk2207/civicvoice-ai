/**
 * submit.js — Complaint submission logic for CivicVoice AI
 */

/* ── Toast ──────────────────────────────────────────────────── */
function showToast(msg, type = 'info') {
  const tc = document.getElementById('toastContainer');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>`;
  tc.appendChild(t);
  setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 350); }, 4500);
}

/* ── State ──────────────────────────────────────────────────── */
let uploadedFiles = [];
let pendingAudioBlob = null;
let pendingTranscript = '';
let voiceRecorder = null;

/* ── Voice setup ────────────────────────────────────────────── */
function setupVoice() {
  const voiceBtn     = document.getElementById('voiceBtn');
  const voiceStatus  = document.getElementById('voiceStatus');
  const descTextarea = document.getElementById('description');
  const audioConfirm = document.getElementById('audioConfirm');
  const audioPlayer  = document.getElementById('audioPlayer');
  const useBtn       = document.getElementById('useRecordingBtn');
  const rerecordBtn  = document.getElementById('rerecordBtn');
  const langSelect   = document.getElementById('language');

  if (!voiceBtn) return;

  // Map ISO lang codes to BCP47 for SpeechRecognition
  const langMap = {
    en:'en-US', hi:'hi-IN', es:'es-ES', fr:'fr-FR', ar:'ar-SA', zh:'zh-CN',
    pt:'pt-BR', ru:'ru-RU', de:'de-DE', ja:'ja-JP', ko:'ko-KR', it:'it-IT',
    nl:'nl-NL', tr:'tr-TR', bn:'bn-IN', ur:'ur-PK', mr:'mr-IN', ta:'ta-IN',
    te:'te-IN', gu:'gu-IN', kn:'kn-IN', ml:'ml-IN', pa:'pa-IN', th:'th-TH',
    vi:'vi-VN', id:'id-ID', sw:'sw-TZ'
  };

  voiceRecorder = new VoiceRecorder({
    lang: langMap[langSelect ? langSelect.value : 'en'] || 'en-US',
    onResult({ transcript, interim }) {
      if (transcript || interim) {
        voiceStatus.textContent = `Heard: "${(transcript + interim).slice(0, 60)}…"`;
        voiceStatus.classList.add('active');
      }
    },
    onEnd(transcript) {
      voiceStatus.textContent = pendingTranscript
        ? 'Recording stopped. Listen below.'
        : 'Recording stopped.';
    },
    onError(err) {
      if (err === 'microphone_denied') {
        showToast('Microphone access denied. Please allow it in browser settings.', 'error');
      } else {
        showToast(`Voice error: ${err}`, 'error');
      }
      voiceBtn.classList.remove('recording');
      voiceStatus.textContent = 'Click mic to record voice';
      voiceStatus.classList.remove('active');
    },
    onAudio(blob, transcript) {
      pendingAudioBlob   = blob;
      pendingTranscript  = transcript;

      // Show audio playback confirmation
      const url = URL.createObjectURL(blob);
      audioPlayer.src = url;
      audioConfirm.classList.add('visible');
      voiceStatus.textContent = 'Recording ready — listen before confirming';

      voiceBtn.classList.remove('recording');
    }
  });

  // Update language when selector changes
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      if (voiceRecorder) voiceRecorder.setLanguage(langMap[langSelect.value] || 'en-US');
    });
  }

  voiceBtn.addEventListener('click', async () => {
    if (!voiceRecorder.mediaSupported) {
      showToast('Audio recording is not supported in this browser.', 'error');
      return;
    }

    if (voiceRecorder.isRecording) {
      voiceRecorder.stopRecording();
      voiceBtn.classList.remove('recording');
      voiceStatus.textContent = 'Processing recording…';
      voiceStatus.classList.remove('active');
    } else {
      // Hide previous confirmation
      audioConfirm.classList.remove('visible');
      pendingAudioBlob   = null;
      pendingTranscript  = '';

      await voiceRecorder.startRecording();
      voiceBtn.classList.add('recording');
      voiceStatus.textContent = 'Recording… click again to stop';
      voiceStatus.classList.add('active');
    }
  });

  // Confirm — insert transcript into textarea
  useBtn.addEventListener('click', () => {
    if (pendingTranscript) {
      const existing = descTextarea.value.trim();
      descTextarea.value = existing
        ? `${existing} ${pendingTranscript}`
        : pendingTranscript;
      showToast('Voice text added to description.', 'success');
    } else {
      showToast('No speech was detected — please try again.', 'warning');
    }
    audioConfirm.classList.remove('visible');
    voiceStatus.textContent = 'Click mic to record voice';
    voiceStatus.classList.remove('active');
    pendingAudioBlob  = null;
    pendingTranscript = '';
  });

  // Re-record
  rerecordBtn.addEventListener('click', () => {
    audioConfirm.classList.remove('visible');
    pendingAudioBlob  = null;
    pendingTranscript = '';
    voiceStatus.textContent = 'Click mic to record voice';
    voiceStatus.classList.remove('active');
  });
}

/* ── Geolocation ─────────────────────────────────────────────── */
function setupGeolocation() {
  const geoBtn = document.getElementById('geoBtn');
  const locInput = document.getElementById('location');
  if (!geoBtn || !locInput) return;

  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    geoBtn.disabled = true;
    geoBtn.textContent = 'Detecting…';
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          locInput.value = data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        } catch {
          locInput.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        }
        geoBtn.disabled = false;
        geoBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg> Detect`;
      },
      () => {
        showToast('Could not detect location. Please enter manually.', 'warning');
        geoBtn.disabled = false;
        geoBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg> Detect`;
      }
    );
  });
}

/* ── Image Upload ─────────────────────────────────────────────── */
function setupImageUpload() {
  const uploadArea  = document.getElementById('uploadArea');
  const fileInput   = document.getElementById('fileInput');
  const previewGrid = document.getElementById('previewGrid');
  if (!uploadArea || !fileInput || !previewGrid) return;

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files));
  });
  fileInput.addEventListener('change', () => {
    handleFiles(Array.from(fileInput.files));
    fileInput.value = '';
  });

  function handleFiles(files) {
    const allowed = files.filter(f => f.type.startsWith('image/'));
    if (allowed.length !== files.length) showToast('Only image files are allowed.', 'warning');
    allowed.forEach(file => {
      if (uploadedFiles.length >= 5) { showToast('Maximum 5 images allowed.', 'warning'); return; }
      if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} exceeds 5 MB limit.`, 'warning'); return; }
      if (uploadedFiles.some(f => f.name === file.name && f.size === file.size)) return;
      uploadedFiles.push(file);
      addPreview(file, uploadedFiles.length - 1);
    });
  }

  function addPreview(file, idx) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.dataset.idx = idx;
      div.innerHTML = `
        <img src="${e.target.result}" alt="${file.name}" />
        <button class="preview-remove" title="Remove">&times;</button>
      `;
      div.querySelector('.preview-remove').addEventListener('click', () => {
        uploadedFiles.splice(idx, 1);
        div.remove();
        // Re-index
        previewGrid.querySelectorAll('.preview-item').forEach((el, i) => el.dataset.idx = i);
      });
      previewGrid.appendChild(div);
    };
    reader.readAsDataURL(file);
  }
}

/* ── Form Submission ─────────────────────────────────────────── */
async function uploadImages() {
  if (!uploadedFiles.length) return [];
  const formData = new FormData();
  uploadedFiles.forEach(f => formData.append('files', f));
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    return data.success ? data.files.map(f => f.path) : [];
  } catch { return []; }
}

async function handleSubmit(e) {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const location    = document.getElementById('location').value.trim();

  if (!description) { showToast('Please enter a description of the issue.', 'error'); return; }
  if (!location)    { showToast('Please provide the location of the issue.', 'error'); return; }

  const submitBtn     = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitSpinner = document.getElementById('submitSpinner');
  submitBtn.disabled = true;
  submitBtnText.textContent = 'Submitting…';
  if (submitSpinner) submitSpinner.style.display = 'inline-block';

  try {
    const filePaths = await uploadImages();

    const payload = {
      title:       document.getElementById('title')?.value.trim() || '',
      description,
      name:        document.getElementById('name')?.value.trim() || '',
      email:       document.getElementById('email')?.value.trim() || '',
      phone:       document.getElementById('phone')?.value.trim() || '',
      location,
      language:    document.getElementById('language')?.value || 'en',
      files:       filePaths
    };

    const res  = await fetch('/api/complaints', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();

    if (data.success) {
      document.getElementById('trackingIdText').textContent = data.trackingId;
      buildClassificationGrid(data.classification);
      document.getElementById('successPanel').classList.add('visible');
      document.getElementById('complaintForm').style.display = 'none';
      showToast('Complaint submitted successfully!', 'success');
      window.scrollTo({ top: document.getElementById('successPanel').offsetTop - 80, behavior: 'smooth' });
    } else {
      showToast(data.error || 'Submission failed. Please try again.', 'error');
    }
  } catch (err) {
    showToast('Network error. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtnText.textContent = 'Submit Complaint';
    if (submitSpinner) submitSpinner.style.display = 'none';
  }
}

function buildClassificationGrid(cls) {
  if (!cls) return;
  const grid = document.getElementById('classificationGrid');
  if (!grid) return;
  const priority = cls.priority || 'medium';
  const priorityColors = { critical:'#c0392b', high:'#e67e22', medium:'#1a6fa0', low:'#2d8a4e' };
  grid.innerHTML = `
    <div class="class-item"><label>Category</label><span>${cls.category || '—'}</span></div>
    <div class="class-item"><label>Department</label><span>${cls.department || '—'}</span></div>
    <div class="class-item"><label>Priority</label><span style="color:${priorityColors[priority] || '#666'};text-transform:capitalize;">${priority}</span></div>
    <div class="class-item"><label>Confidence</label><span>${cls.confidence || 0}%</span></div>
  `;
}

function copyTrackingId() {
  const id = document.getElementById('trackingIdText')?.textContent;
  if (!id || id === '—') return;
  navigator.clipboard.writeText(id).then(() => showToast('Tracking ID copied!', 'success')).catch(() => {});
}

function resetForm() {
  document.getElementById('complaintForm').style.display = '';
  document.getElementById('successPanel').classList.remove('visible');
  document.getElementById('complaintForm').reset();
  uploadedFiles = [];
  const grid = document.getElementById('previewGrid');
  if (grid) grid.innerHTML = '';
}

// Make copyTrackingId and resetForm global
window.copyTrackingId = copyTrackingId;
window.resetForm = resetForm;

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setupVoice();
  setupGeolocation();
  setupImageUpload();
  const form = document.getElementById('complaintForm');
  if (form) form.addEventListener('submit', handleSubmit);
});
