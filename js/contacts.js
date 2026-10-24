/**
 * NexaSafe - Trusted Contacts Management Engine
 * Secure LocalStorage CRUD with Input Validation & Sample Demo Data
 */

class ContactsEngine {
  constructor() {
    this.storageKey = 'nexasafe_trusted_contacts';
    this.sampleContacts = [
      { id: "sc-1", name: "Jyothi", relation: "Sister", phone: "+91 8919757241", isSample: true },
      { id: "sc-2", name: "Santhosha", relation: "Mother", phone: "+91 9346254477", isSample: true }
    ];
    this.contacts = [];
    this.init();
  }

  init() {
    this.loadContacts();
    this.renderContacts();
    this.bindFormEvents();
  }

  loadContacts() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.contacts = JSON.parse(stored);
      } else {
        // Load initial sample demo data
        this.contacts = [...this.sampleContacts];
        this.saveContacts();
      }
    } catch (e) {
      this.contacts = [...this.sampleContacts];
    }
  }

  saveContacts() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.contacts));
    } catch (e) {}
  }

  getContacts() {
    return this.contacts;
  }

  addContact(name, relation, phone) {
    // Validation
    const cleanName = name ? name.trim() : "";
    const cleanPhone = phone ? phone.trim() : "";
    const cleanRel = relation ? relation.trim() : "Trusted Contact";

    if (!cleanName || cleanName.length < 2) {
      window.NexaApp.showToast("Please enter a valid contact name (at least 2 letters).", "warning");
      return false;
    }

    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 7) {
      window.NexaApp.showToast("Please enter a valid phone number (at least 7 digits).", "warning");
      return false;
    }

    const newContact = {
      id: "tc-" + Date.now(),
      name: cleanName,
      relation: cleanRel,
      phone: cleanPhone,
      isSample: false
    };

    this.contacts.push(newContact);
    this.saveContacts();
    this.renderContacts();
    this.updateDropdowns();
    window.NexaApp.showToast(`Saved trusted contact: ${newContact.name}`, "success");
    return true;
  }

  deleteContact(id) {
    const contact = this.contacts.find(c => c.id === id);
    this.contacts = this.contacts.filter(c => c.id !== id);
    this.saveContacts();
    this.renderContacts();
    this.updateDropdowns();
    if (contact) {
      window.NexaApp.showToast(`Removed contact: ${contact.name}`, "info");
    }
  }

  bindFormEvents() {
    const form = document.getElementById('add-contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('contact-name-input');
        const relInput = document.getElementById('contact-rel-input');
        const phoneInput = document.getElementById('contact-phone-input');

        if (this.addContact(nameInput?.value, relInput?.value, phoneInput?.value)) {
          form.reset();
          const modal = document.getElementById('add-contact-modal');
          if (modal) modal.classList.add('hidden');
        }
      });
    }
  }

  renderContacts() {
    const listEl = document.getElementById('trusted-contacts-list');
    if (!listEl) return;

    if (this.contacts.length === 0) {
      listEl.innerHTML = `
        <div class="card card-lavender text-center" style="padding: 2rem;">
          <p class="text-sm text-slate-500">No trusted contacts added yet.</p>
          <button onclick="window.NexaApp.openModal('add-contact-modal')" class="btn btn-secondary mt-3">
            + Add First Contact
          </button>
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.contacts.map(c => `
      <div class="card flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="brand-icon" style="width: 38px; height: 38px; font-weight: 700; font-size: 0.95rem; background: linear-gradient(135deg, var(--color-purple-500), var(--color-purple-700));">
            ${c.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-slate-800">${this.escapeHTML(c.name)}</h4>
              ${c.isSample ? '<span class="badge badge-demo">Sample Data</span>' : ''}
            </div>
            <p class="text-xs text-slate-500">${this.escapeHTML(c.relation)} • <span class="font-medium">${this.escapeHTML(c.phone)}</span></p>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <a href="tel:${c.phone}" class="btn btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" title="Call Contact">
            📞 Call
          </a>
          <button onclick="window.contactsEngine.deleteContact('${c.id}')" class="btn btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; color: var(--color-rose-600);" title="Remove">
            ✕
          </button>
        </div>
      </div>
    `).join('');
  }

  updateDropdowns() {
    const dropdown = document.getElementById('journey-contact-select');
    if (!dropdown) return;

    dropdown.innerHTML = this.contacts.map(c => `
      <option value="${c.id}">${this.escapeHTML(c.name)} (${this.escapeHTML(c.relation)})</option>
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
window.contactsEngine = new ContactsEngine();
