/**
 * NexaSafe - Emergency SOS Engine
 * Transparent Demo Mode with Trusted Contact Management & Real Dial Links
 */

class SOSEngine {
  constructor() {
    this.countdownSeconds = 3;
    this.countdownTimer = null;
    this.isCountdownActive = false;
    this.isDemoActive = false;
    this.audioCtx = null;
  }

  // --- SOS Button Trigger ---
  startSOSCountdown() {
    if (this.isCountdownActive) return;

    this.isCountdownActive = true;
    let count = this.countdownSeconds;

    const modal = document.getElementById('sos-countdown-modal');
    const countEl = document.getElementById('sos-countdown-number');

    if (modal && countEl) {
      modal.classList.remove('hidden');
      countEl.textContent = count;
      this.playBeep(520);

      this.countdownTimer = setInterval(() => {
        count--;
        if (count > 0) {
          countEl.textContent = count;
          this.playBeep(520 + (3 - count) * 120);
        } else {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
          this.isCountdownActive = false;
          modal.classList.add('hidden');
          this.showDemoActiveModal();
        }
      }, 1000);
    }
  }

  cancelSOSCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    this.isCountdownActive = false;
    const modal = document.getElementById('sos-countdown-modal');
    if (modal) modal.classList.add('hidden');
    window.NexaApp.showToast("Emergency countdown aborted.", "info");
  }

  // --- Show Active SOS Modal (Honest Demo Simulation) ---
  showDemoActiveModal() {
    this.isDemoActive = true;
    const modal = document.getElementById('sos-demo-active-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }

    // Prepare WhatsApp Distress Link for trusted contacts
    const contacts = window.contactsEngine ? window.contactsEngine.getContacts() : [];
    const waLink = document.getElementById('sos-whatsapp-btn');
    if (waLink) {
      const message = encodeURIComponent(
        "EMERGENCY ALERT: I may be in danger and need assistance. Please check on me or contact emergency services immediately."
      );
      waLink.href = `https://api.whatsapp.com/send?text=${message}`;
    }

    window.NexaApp.showToast("Demo SOS simulation active. Notice: Real cellular SMS requires backend integration.", "warning");
  }

  closeDemoActiveModal() {
    this.isDemoActive = false;
    const modal = document.getElementById('sos-demo-active-modal');
    if (modal) modal.classList.add('hidden');
    window.NexaApp.showToast("SOS demo simulation concluded.", "info");
  }

  playBeep(freq = 600) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio fallback
    }
  }
}

// Global instance
window.sosEngine = new SOSEngine();
