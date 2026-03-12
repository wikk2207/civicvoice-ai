(function () {
  'use strict';

  // --- DOM Refs ---
  const form            = document.getElementById('complaintForm');
  const formWrapper     = document.getElementById('formWrapper');
  const loadingOverlay  = document.getElementById('loadingOverlay');
  const successPanel    = document.getElementById('successPanel');
  const trackingDisplay = document.getElementById('trackingIdDisplay');
  const copyBtn         = document.getElementById('copyBtn');
  const classResults    = document.getElementById('classificationResults');
  const trackBtn        = document.getElementById('trackBtn');
  const submitAnotherBtn= document.getElementById('submitAnotherBtn');
  const voiceBtn        = document.getElementById('voiceBtn');
  const voiceBtnLabel   = document.getElementById('voiceBtnLabel');
  const voiceStatus     = document.getElementById('voiceStatus');
  const voiceStatusText = document.getElementById('voiceStatusText');
  const descriptionEl   = document.getElementById('description');
  const languageEl      = document.getElementById('language');
  const geoBtn          = document.getElementById('geoBtn');
  const locationEl      = document.getElementById('location');
  const dropZone        = document.getElementById('dropZone');
  const imageInput      = document.getElementById('imageInput');
  const imagePreviews   = document.getElementById('imagePreviews');
  const toastContainer  = document.getElementById('toastContainer');

  // --- State ---
  const uploadedUrls = [];
  const fileObjects  = [];

  // --- Toast Notifications ---
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

  // --- Voice Input ---
  let voiceRecorder = null;
  let accumulatedTranscript = '';

  if (window.VoiceRecorder) {
    voiceRecorder = new VoiceRecorder({
      language: languageEl.value === 'auto' ? 'en' : languageEl.value,
      onStart: () => {
        voiceBtn.classList.add('recording');
        voiceBtnLabel.textContent = 'Stop Recording';
        voiceStatus.hidden = false;
        voiceStatusText.textContent = 'Listening…';
        accumulatedTranscript = descriptionEl.value;
      },
      onResult: (transcript) => {
        descriptionEl.value = accumulatedTranscript + (accumulatedTranscript ? ' ' : '') + transcript;
      },
      onStop: () => {
        voiceBtn.classList.remove('recording');
        voiceBtnLabel.textContent = 'Voice Input';
        voiceStatus.hidden = true;
      },
      onError: (err) => {
        voiceBtn.classList.remove('recording');
        voiceBtnLabel.textContent = 'Voice Input';
        voiceStatus.hidden = true;
        showToast(err, 'error');
      },
    });
  }

  voiceBtn.addEventListener('click', () => {
    if (!voiceRecorder) {
      showToast('Voice input is not supported in this browser.', 'error');
      return;
    }
    voiceRecorder.toggle();
  });

  languageEl.addEventListener('change', () => {
    if (voiceRecorder) {
      voiceRecorder.setLanguage(languageEl.value === 'auto' ? 'en' : languageEl.value);
    }
  });

  // --- Geolocation ---
  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    geoBtn.textContent = 'Detecting…';
    geoBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await resp.json();
          locationEl.value = data.display_name || `${latitude}, ${longitude}`;
        } catch {
          locationEl.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }
        geoBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> Detect Location`;
        geoBtn.disabled = false;
      },
      () => {
        showToast('Could not detect location. Please enter it manually.', 'error');
        geoBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> Detect Location`;
        geoBtn.disabled = false;
      }
    );
  });

  // --- File Upload & Drag-drop ---
  dropZone.addEventListener('click', () => imageInput.click());
  dropZone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') imageInput.click(); });

  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(Array.from(e.dataTransfer.files));
  });

  imageInput.addEventListener('change', () => handleFiles(Array.from(imageInput.files)));

  function handleFiles(files) {
    const remaining = 5 - fileObjects.length;
    if (remaining <= 0) { showToast('Maximum 5 images allowed.', 'error'); return; }
    files.slice(0, remaining).forEach((file) => {
      if (!file.type.startsWith('image/')) { showToast(`${file.name} is not an image.`, 'error'); return; }
      if (file.size > 10 * 1024 * 1024) { showToast(`${file.name} exceeds 10MB.`, 'error'); return; }
      fileObjects.push(file);
      addPreview(file, fileObjects.length - 1);
    });
  }

  function addPreview(file, idx) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const item = document.createElement('div');
      item.className = 'preview-item';
      item.dataset.idx = idx;
      item.innerHTML = `
        <img src="${e.target.result}" alt="Preview ${idx + 1}" />
        <button class="preview-remove" type="button" aria-label="Remove image">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;
      item.querySelector('.preview-remove').addEventListener('click', () => {
        fileObjects.splice(idx, 1);
        item.remove();
      });
      imagePreviews.appendChild(item);
    };
    reader.readAsDataURL(file);
  }

  async function uploadImages() {
    const urls = [];
    for (const file of fileObjects) {
      const fd = new FormData();
      fd.append('image', file);
      const resp = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await resp.json();
      if (data.url) urls.push(data.url);
    }
    return urls;
  }

  // --- Form Submission ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (voiceRecorder && voiceRecorder.isRecording) voiceRecorder.stop();

    const description = descriptionEl.value.trim();
    const location    = locationEl.value.trim();

    if (description.length < 10) { showToast('Description must be at least 10 characters.', 'error'); return; }
    if (!location) { showToast('Please enter a location.', 'error'); return; }

    loadingOverlay.hidden = false;

    try {
      const imageUrls = await uploadImages();

      const payload = {
        title:       document.getElementById('title').value.trim(),
        description,
        name:        document.getElementById('name').value.trim(),
        email:       document.getElementById('email').value.trim(),
        phone:       document.getElementById('phone').value.trim(),
        location,
        inputLanguage: languageEl.value,
        imageUrls,
      };

      const resp = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) throw new Error(data.error || 'Submission failed.');

      loadingOverlay.hidden = true;
      showSuccess(data);
    } catch (err) {
      loadingOverlay.hidden = true;
      showToast('Error: ' + err.message, 'error');
    }
  });

  function showSuccess(data) {
    formWrapper.hidden = true;
    successPanel.hidden = false;

    trackingDisplay.textContent = data.trackingId;
    trackBtn.href = `/track?id=${data.trackingId}`;

    classResults.innerHTML = `
      <div class="class-item"><span class="class-label">Category</span><span class="class-value">${data.category || '—'}</span></div>
      <div class="class-item"><span class="class-label">Department</span><span class="class-value">${data.department || '—'}</span></div>
      <div class="class-item"><span class="class-label">Priority</span><span class="class-value">${capitalise(data.priority)}</span></div>
      <div class="class-item"><span class="class-label">Confidence</span><span class="class-value">${Math.round((data.confidence || 0) * 100)}%</span></div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  copyBtn.addEventListener('click', () => {
    const id = trackingDisplay.textContent;
    navigator.clipboard.writeText(id).then(() => showToast('Tracking ID copied!', 'success')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = id;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Tracking ID copied!', 'success');
    });
  });

  submitAnotherBtn.addEventListener('click', () => {
    successPanel.hidden = true;
    formWrapper.hidden = false;
    form.reset();
    imagePreviews.innerHTML = '';
    fileObjects.length = 0;
    uploadedUrls.length = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function capitalise(str) {
    if (!str) return '—';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Pre-fill tracking ID from query param if present
  const params = new URLSearchParams(window.location.search);
  const preId = params.get('id');
  if (preId) {
    const titleInput = document.getElementById('title');
    if (titleInput) titleInput.focus();
  }
})();
