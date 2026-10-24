/**
 * NexaSafe - Safe Journey Engine
 * Client-Side Journey Check-in Workflow with Explicit Backend Disclaimer
 */

class JourneyEngine {
  constructor() {
    this.isActive = false;
    this.destination = "";
    this.contactName = "";
    this.remainingSeconds = 0;
    this.totalSeconds = 0;
    this.journeyInterval = null;
    this.audioCtx = null;
  }

  startJourney(destination, contactId, minutes) {
    const cleanDest = destination ? destination.trim() : "";
    if (!cleanDest || cleanDest.length < 2) {
      window.NexaApp.showToast("Please enter a destination (e.g., Campus Library, Metro Gate 2).", "warning");
      return false;
    }

    const durationMins = parseInt(minutes, 10);
    if (isNaN(durationMins) || durationMins <= 0) {
      window.NexaApp.showToast("Please select a valid check-in time duration.", "warning");
      return false;
    }

    const contacts = window.contactsEngine ? window.contactsEngine.getContacts() : [];
    const contact = contacts.find(c => c.id === contactId) || contacts[0];
    this.contactName = contact ? contact.name : "Trusted Contact";

    this.destination = cleanDest;
    this.totalSeconds = durationMins * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isActive = true;

    this.updateUI();
    this.startTimer();

    window.NexaApp.showToast(`Journey started to ${this.destination}. Stay safe!`, "success");
    return true;
  }

  startTimer() {
    if (this.journeyInterval) clearInterval(this.journeyInterval);

    this.journeyInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateCountdownDisplay();
      } else {
        clearInterval(this.journeyInterval);
        this.journeyInterval = null;
        this.triggerArrivalReminder();
      }
    }, 1000);
  }

  updateCountdownDisplay() {
    const displayEl = document.getElementById('journey-countdown-text');
    const progressEl = document.getElementById('journey-progress-bar');

    const mins = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
    const secs = (this.remainingSeconds % 60).toString().padStart(2, '0');

    if (displayEl) {
      displayEl.textContent = `${mins}:${secs}`;
    }

    if (progressEl && this.totalSeconds > 0) {
      const pct = Math.max(0, Math.min(100, Math.round(((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100)));
      progressEl.style.width = `${pct}%`;
    }
  }

  triggerArrivalReminder() {
    this.playReminderChime();
    const reminderModal = document.getElementById('journey-reminder-modal');
    if (reminderModal) {
      reminderModal.classList.remove('hidden');
    }
    window.NexaApp.showToast("🔔 Scheduled check-in time reached. Have you arrived safely?", "warning");
  }

  confirmArrival() {
    this.stopJourney();
    const reminderModal = document.getElementById('journey-reminder-modal');
    if (reminderModal) reminderModal.classList.add('hidden');
    window.NexaApp.showToast(`🎉 Safe arrival at ${this.destination} confirmed. Journey completed!`, "success");
  }

  cancelJourney() {
    this.stopJourney();
    window.NexaApp.showToast("Safe Journey session ended.", "info");
  }

  stopJourney() {
    this.isActive = false;
    if (this.journeyInterval) {
      clearInterval(this.journeyInterval);
      this.journeyInterval = null;
    }
    this.updateUI();
  }

  updateUI() {
    const setupCard = document.getElementById('journey-setup-card');
    const activeCard = document.getElementById('journey-active-card');
    const destDisplay = document.getElementById('journey-active-dest');
    const contactDisplay = document.getElementById('journey-active-contact');

    if (this.isActive) {
      if (setupCard) setupCard.classList.add('hidden');
      if (activeCard) activeCard.classList.remove('hidden');
      if (destDisplay) destDisplay.textContent = this.destination;
      if (contactDisplay) contactDisplay.textContent = `Assigned Contact: ${this.contactName}`;
      this.updateCountdownDisplay();
    } else {
      if (setupCard) setupCard.classList.remove('hidden');
      if (activeCard) activeCard.classList.add('hidden');
    }
  }

  playReminderChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.6);
    } catch (e) {}
  }
}

// Global instance
window.journeyEngine = new JourneyEngine();
