/**
 * NexaSafe - Core Application Controller
 * Handles Tab Navigation, Toast Notifications, Modals & Safety Tips
 */

class NexaAppController {
  constructor() {
    this.currentTab = 'dashboard';
    this.safetyTips = [
      {
        title: "Digital Footprint Awareness",
        tip: "Avoid tagging real-time locations on social media stories while you are still at the venue. Post check-ins after leaving.",
        category: "Online Safety"
      },
      {
        title: "Two-Factor Authentication",
        tip: "Upgrade from SMS 2FA to an Authenticator app (e.g. Google Authenticator) to protect accounts against SIM-swap attacks.",
        category: "Account Security"
      },
      {
        title: "Cab & Rideshare Protocol",
        tip: "Always verify the driver's name, vehicle make, and license plate number against your app before entering the vehicle.",
        category: "Physical Safety"
      },
      {
        title: "Preserving Harassment Evidence",
        tip: "Never delete abusive messages immediately. Take full screenshots showing timestamps and usernames before blocking the sender.",
        category: "Evidence Guide"
      },
      {
        title: "Unsolicited Video Calls",
        tip: "Cover your camera with a sticker or your finger when answering video calls from unknown numbers to prevent deepfake/blackmail traps.",
        category: "Privacy Breach"
      }
    ];
    this.currentTipIndex = 0;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.bindNavEvents();
      this.bindModalEvents();
      this.renderTip();
      this.switchTab('dashboard');

      // Initialize child modules
      if (window.contactsEngine) window.contactsEngine.updateDropdowns();
      if (window.resourcesEngine) window.resourcesEngine.renderHelplines();

      // Keyboard accessibility (Esc closes modals)
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAllModals();
        }
      });
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Hide all sections
    const sections = document.querySelectorAll('.tab-section');
    sections.forEach(sec => sec.classList.add('hidden'));

    // Show selected section
    const target = document.getElementById(`section-${tabId}`);
    if (target) {
      target.classList.remove('hidden');
    }

    // Update Desktop Nav Links
    const deskLinks = document.querySelectorAll('.nav-link');
    deskLinks.forEach(link => {
      if (link.dataset.tab === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Mobile Bottom Nav
    const mobLinks = document.querySelectorAll('.bottom-nav-item');
    mobLinks.forEach(link => {
      if (link.dataset.tab === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  bindNavEvents() {
    const navButtons = document.querySelectorAll('[data-tab]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    // Carousel buttons
    const prevTip = document.getElementById('prev-tip-btn');
    const nextTip = document.getElementById('next-tip-btn');
    if (prevTip) prevTip.addEventListener('click', () => this.rotateTip(-1));
    if (nextTip) nextTip.addEventListener('click', () => this.rotateTip(1));
  }

  renderTip() {
    const titleEl = document.getElementById('safety-tip-title');
    const textEl = document.getElementById('safety-tip-text');
    const catEl = document.getElementById('safety-tip-category');

    const tip = this.safetyTips[this.currentTipIndex];
    if (tip) {
      if (titleEl) titleEl.textContent = tip.title;
      if (textEl) textEl.textContent = tip.tip;
      if (catEl) catEl.textContent = tip.category;
    }
  }

  rotateTip(direction) {
    this.currentTipIndex = (this.currentTipIndex + direction + this.safetyTips.length) % this.safetyTips.length;
    this.renderTip();
  }

  // --- Modal Management ---
  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('hidden');
  }

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('hidden');
  }

  closeAllModals() {
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(m => m.classList.add('hidden'));
  }

  bindModalEvents() {
    const closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.closeModal;
        if (modalId) this.closeModal(modalId);
        else this.closeAllModals();
      });
    });
  }

  // --- Accordion Toggle ---
  toggleAccordion(btn) {
    const item = btn.closest('.accordion-item');
    const body = item?.querySelector('.accordion-body');
    const icon = btn.querySelector('.accordion-icon');

    if (body) {
      const isHidden = body.classList.contains('hidden');
      body.classList.toggle('hidden', !isHidden);
      if (icon) {
        icon.textContent = isHidden ? '−' : '+';
      }
    }
  }

  // --- Toast Notification Engine ---
  showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = "ℹ️";
    if (type === "success") icon = "✓";
    if (type === "danger") icon = "🚨";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `
      <span style="font-weight: bold; font-size: 1.1rem;">${icon}</span>
      <span style="flex: 1; font-size: 0.8125rem; font-weight: 500;">${message}</span>
      <button style="background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 1.1rem;">&times;</button>
    `;

    toast.querySelector('button').onclick = () => toast.remove();
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
      }
    }, 4500);
  }
}

// Global instance
window.NexaApp = new NexaAppController();
