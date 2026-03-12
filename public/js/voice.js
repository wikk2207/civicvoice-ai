/**
 * voice.js — Web Speech API + MediaRecorder wrapper for CivicVoice AI
 * Provides speech-to-text transcription AND audio blob recording
 * so the user can listen to the recording before confirming.
 */

class VoiceRecorder {
  constructor(options = {}) {
    this.lang = options.lang || 'en-US';
    this.onResult  = options.onResult  || (() => {});
    this.onEnd     = options.onEnd     || (() => {});
    this.onError   = options.onError   || (() => {});
    this.onAudio   = options.onAudio   || (() => {}); // called with Blob when recording stops

    this.recognition  = null;
    this.mediaRecorder = null;
    this.audioChunks  = [];
    this.isRecording  = false;
    this.transcript   = '';
    this.stream       = null;

    this._initSpeechRecognition();
  }

  _initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not supported in this browser.');
      return;
    }
    this.recognition = new SpeechRecognition();
    this.recognition.continuous      = true;
    this.recognition.interimResults  = true;
    this.recognition.lang            = this.lang;

    this.recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      if (final) this.transcript += final;
      this.onResult({ transcript: this.transcript, interim });
    };

    this.recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      // Don't trigger onEnd here — let stopRecording handle it
    };
  }

  setLanguage(lang) {
    this.lang = lang;
    if (this.recognition) this.recognition.lang = lang;
  }

  async startRecording() {
    if (this.isRecording) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      this.onError('microphone_denied');
      return;
    }

    this.audioChunks = [];
    this.transcript  = '';
    this.isRecording = true;

    // Start MediaRecorder for audio blob
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';
    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) this.audioChunks.push(e.data);
    };
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.audioChunks, { type: mimeType });
      this.onAudio(blob, this.transcript);
    };
    this.mediaRecorder.start(250);

    // Start speech recognition
    if (this.recognition) {
      try { this.recognition.start(); } catch (_) {}
    }
  }

  stopRecording() {
    if (!this.isRecording) return;
    this.isRecording = false;

    if (this.recognition) {
      try { this.recognition.stop(); } catch (_) {}
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }

    this.onEnd(this.transcript);
  }

  get supported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  get mediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }
}

// Expose globally
window.VoiceRecorder = VoiceRecorder;
