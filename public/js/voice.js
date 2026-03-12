(function () {
  'use strict';

  const VOICE_ERROR_MESSAGES = {
    'network':               'Voice input requires an internet connection. Please check your network and try again.',
    'not-allowed':           'Microphone access was denied. Please allow microphone permission in your browser settings.',
    'audio-capture':         'No microphone was found. Please ensure a microphone is connected.',
    'aborted':               'Voice input was cancelled.',
    'language-not-supported':'The selected language is not supported for voice input.',
    'service-not-allowed':   'Speech recognition service is not allowed. Please use Chrome or Edge browser.',
  };

  /**
   * VoiceRecorder — wraps the Web Speech API for live transcription.
   */
  class VoiceRecorder {
    constructor(options = {}) {
      this.onResult = options.onResult || function () {};
      this.onStart  = options.onStart  || function () {};
      this.onStop   = options.onStop   || function () {};
      this.onError  = options.onError  || function () {};

      this.recognition = null;
      this.isRecording = false;
      this.language = options.language || 'en-US';

      this._init();
    }

    _init() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        this.supported = false;
        return;
      }
      this.supported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.language;

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        this.onResult(transcript);
      };

      this.recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          // Not a real error — restart silently if still recording
          if (this.isRecording) {
            try { this.recognition.start(); } catch (_) {}
          }
          return;
        }
        this.isRecording = false;
        const friendlyMessage = VOICE_ERROR_MESSAGES[event.error] || 'Voice input error: ' + event.error;
        this.onError(friendlyMessage);
      };

      this.recognition.onend = () => {
        if (this.isRecording) {
          // Restart if we're still supposed to be recording (browser stopped automatically)
          try { this.recognition.start(); } catch (_) {}
        } else {
          this.onStop();
        }
      };
    }

    setLanguage(langCode) {
      // Map ISO 639-1 codes to BCP-47 tags
      const map = {
        en: 'en-US', hi: 'hi-IN', bn: 'bn-BD', te: 'te-IN', mr: 'mr-IN',
        ta: 'ta-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN',
        ur: 'ur-PK', or: 'or-IN', as: 'as-IN', ne: 'ne-NP', si: 'si-LK',
        ar: 'ar-SA', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', pt: 'pt-BR',
        ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR',
      };
      this.language = map[langCode] || (langCode + '-' + langCode.toUpperCase());
      if (this.recognition) this.recognition.lang = this.language;
    }

    toggle() {
      if (!this.supported) {
        this.onError('Voice input is not supported in this browser.');
        return;
      }
      if (this.isRecording) {
        this.stop();
      } else {
        this.start();
      }
    }

    start() {
      if (!this.supported || this.isRecording) return;
      try {
        this.recognition.start();
        this.isRecording = true;
        this.onStart();
      } catch (err) {
        this.onError(err.message);
      }
    }

    stop() {
      if (!this.isRecording) return;
      this.isRecording = false;
      try { this.recognition.stop(); } catch (_) {}
      this.onStop();
    }
  }

  // Expose globally
  window.VoiceRecorder = VoiceRecorder;
})();
