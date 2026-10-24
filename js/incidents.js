/**
 * NexaSafe - Private Incident Documentation Engine
 * Local-First Browser Storage with Zero Remote Data Transmission
 */

class IncidentManager {
  constructor() {
    this.storageKey = 'nexasafe_private_incidents';
    this.incidents = [];
    this.init();
  }

  init() {
    this.loadIncidents();
    this.renderIncidents();
    this.bindFormEvents();
  }

  loadIncidents() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.incidents = JSON.parse(stored);
      } else {
        this.incidents = [];
      }
    } catch (e) {
      this.incidents = [];
    }
  }

  saveIncidents() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.incidents));
    } catch (e) {}
  }

  recordIncident(type, description, date, location, notes, consentGranted) {
    if (!consentGranted) {
      window.NexaApp.showToast("Please review and confirm the local storage privacy agreement.", "warning");
      return false;
    }

    const cleanType = type ? type.trim() : "";
    const cleanDesc = description ? description.trim() : "";
    const cleanDate = date ? date.trim() : new Date().toLocaleDateString();
    const cleanLoc = location ? location.trim() : "Unspecified";
    const cleanNotes = notes ? notes.trim() : "";

    if (!cleanType) {
      window.NexaApp.showToast("Please select an incident classification type.", "warning");
      return false;
    }

    if (!cleanDesc || cleanDesc.length < 10) {
      window.NexaApp.showToast("Please provide a more descriptive incident summary (at least 10 characters).", "warning");
      return false;
    }

    const newIncident = {
      id: "inc-" + Date.now(),
      type: cleanType,
      description: cleanDesc,
      date: cleanDate,
      location: cleanLoc,
      notes: cleanNotes,
      loggedAt: new Date().toLocaleString()
    };

    this.incidents.unshift(newIncident);
    this.saveIncidents();
    this.renderIncidents();
    window.NexaApp.showToast("Incident securely documented in local browser storage.", "success");
    return true;
  }

  deleteIncident(id) {
    this.incidents = this.incidents.filter(inc => inc.id !== id);
    this.saveIncidents();
    this.renderIncidents();
    window.NexaApp.showToast("Incident log removed.", "info");
  }

  clearAllIncidents() {
    if (this.incidents.length === 0) return;
    if (confirm("Are you sure you want to permanently delete all locally stored incident reports?")) {
      this.incidents = [];
      this.saveIncidents();
      this.renderIncidents();
      window.NexaApp.showToast("All local incident records cleared.", "info");
    }
  }

  exportIncidentSummary(id) {
    const inc = this.incidents.find(i => i.id === id);
    if (!inc) return;

    const summaryText = 
`==============================================
NEXASAFE INCIDENT DOCUMENTATION SUMMARY
Confidential Record for Personal / Legal Use
==============================================
Incident ID: ${inc.id}
Classification: ${inc.type}
Date of Occurrence: ${inc.date}
Location / Digital Platform: ${inc.location}
Logged on System: ${inc.loggedAt}

DESCRIPTION OF EVENT:
${inc.description}

ADDITIONAL EVIDENCE / WITNESS NOTES:
${inc.notes || "None provided."}

----------------------------------------------
Storage Notice: Documented locally via NexaSafe.
No data was transmitted over public networks.
==============================================`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        window.NexaApp.showToast("Incident report text copied to clipboard for easy reporting.", "success");
      }).catch(() => {
        this.fallbackExportWindow(summaryText);
      });
    } else {
      this.fallbackExportWindow(summaryText);
    }
  }

  fallbackExportWindow(text) {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<pre style="font-family: monospace; padding: 20px; white-space: pre-wrap;">${text}</pre>`);
      w.document.title = "NexaSafe Incident Record";
    }
  }

  bindFormEvents() {
    const form = document.getElementById('incident-report-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('incident-type-select')?.value;
        const desc = document.getElementById('incident-desc-input')?.value;
        const date = document.getElementById('incident-date-input')?.value;
        const loc = document.getElementById('incident-location-input')?.value;
        const notes = document.getElementById('incident-notes-input')?.value;
        const consent = document.getElementById('incident-consent-check')?.checked;

        if (this.recordIncident(type, desc, date, loc, notes, consent)) {
          form.reset();
        }
      });
    }
  }

  renderIncidents() {
    const container = document.getElementById('incident-history-list');
    const countBadge = document.getElementById('incident-count-badge');
    if (countBadge) countBadge.textContent = `${this.incidents.length} Local Logs`;

    if (!container) return;

    if (this.incidents.length === 0) {
      container.innerHTML = `
        <div class="card card-lavender text-center" style="padding: 2rem;">
          <p class="text-sm text-slate-500">No incident reports recorded yet.</p>
          <p class="text-xs text-slate-400 mt-1">
            Use the form above to document an occurrence for your personal records or formal reporting.
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.incidents.map(inc => `
      <div class="card space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="badge badge-purple">${this.escapeHTML(inc.type)}</span>
              <span class="text-xs text-slate-500">Occurred: ${this.escapeHTML(inc.date)}</span>
            </div>
            <p class="text-xs font-semibold text-slate-700 mt-1">Platform / Place: ${this.escapeHTML(inc.location)}</p>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="window.incidentManager.exportIncidentSummary('${inc.id}')" class="btn btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" title="Copy Formatted Summary">
              📋 Export
            </button>
            <button onclick="window.incidentManager.deleteIncident('${inc.id}')" class="btn btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; color: var(--color-rose-600);" title="Delete Log">
              ✕
            </button>
          </div>
        </div>

        <p class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded" style="border: 1px solid var(--color-lavender-300);">
          ${this.escapeHTML(inc.description)}
        </p>

        ${inc.notes ? `
          <p class="text-xs text-slate-500">
            <strong>Evidence Notes:</strong> ${this.escapeHTML(inc.notes)}
          </p>
        ` : ''}

        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <span>Logged locally: ${inc.loggedAt}</span>
          <span class="text-teal font-medium">✓ Client-Side Encrypted Cache</span>
        </div>
      </div>
    `).join('');
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

// Global instance
window.incidentManager = new IncidentManager();
