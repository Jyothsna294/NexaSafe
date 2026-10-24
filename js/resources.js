/**
 * NexaSafe - Verified Emergency Help & Support Directory
 * Verified National & Cyber Helplines with 1-Click Dialing & Official Links
 */

class ResourcesEngine {
  constructor() {
    this.helplines = [
      {
        name: "National Emergency Service (All-in-One)",
        number: "112",
        category: "Emergency & Police",
        desc: "Immediate integration of police, fire, and medical emergency dispatch.",
        actionUrl: "tel:112",
        actionText: "📞 Call 112",
        badge: "24/7 Universal"
      },
      {
        name: "Women Helpline (National Commission for Women)",
        number: "1091",
        category: "Women's Safety",
        desc: "Dedicated rapid response for women in distress or immediate safety threats.",
        actionUrl: "tel:1091",
        actionText: "📞 Call 1091",
        badge: "Toll-Free"
      },
      {
        name: "National Cyber Crime Reporting Helpline",
        number: "1930",
        category: "Cyber Safety & Extortion",
        desc: "Immediate reporting for financial fraud, sextortion, impersonation, and cyber harassment.",
        actionUrl: "tel:1930",
        actionText: "📞 Call 1930",
        portalUrl: "https://cybercrime.gov.in",
        portalText: "Visit Portal",
        badge: "Official Portal"
      },
      {
        name: "Women in Distress Helpline",
        number: "181",
        category: "Crisis & Counseling",
        desc: "24/7 confidential crisis intervention, legal aid referral, and shelter coordination.",
        actionUrl: "tel:181",
        actionText: "📞 Call 181",
        badge: "24/7 Helpline"
      },
      {
        name: "NCW WhatsApp Grievance Helpline",
        number: "+91 78271 70170",
        category: "Domestic Abuse & Harassment",
        desc: "Direct WhatsApp support managed by the National Commission for Women.",
        actionUrl: "https://api.whatsapp.com/send?phone=917827170170",
        actionText: "💬 WhatsApp NCW",
        badge: "WhatsApp Cell"
      },
      {
        name: "iCall Psychosocial Support (TISS)",
        number: "+91 91529 87821",
        category: "Mental Health & Trauma",
        desc: "Free, confidential telephone and email counseling by qualified mental health professionals.",
        actionUrl: "tel:9152987821",
        actionText: "📞 Call iCall",
        badge: "Mon-Sat 10am-8pm"
      }
    ];
  }

  renderHelplines() {
    const container = document.getElementById('resources-helplines-list');
    if (!container) return;

    container.innerHTML = this.helplines.map(hl => `
      <div class="card flex flex-col justify-between gap-3">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="badge badge-purple text-[10px]">${hl.category}</span>
            <span class="badge badge-teal text-[10px]">${hl.badge}</span>
          </div>
          <h4 class="text-base font-bold text-slate-800">${hl.name}</h4>
          <p class="text-xs font-mono font-bold text-purple mt-0.5">${hl.number}</p>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">${hl.desc}</p>
        </div>
        <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
          <a href="${hl.actionUrl}" class="btn btn-primary" style="padding: 0.45rem 0.95rem; font-size: 0.8125rem;">
            ${hl.actionText}
          </a>
          ${hl.portalUrl ? `
            <a href="${hl.portalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding: 0.45rem 0.85rem; font-size: 0.8125rem;">
              🌐 ${hl.portalText}
            </a>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
}

// Global instance
window.resourcesEngine = new ResourcesEngine();
