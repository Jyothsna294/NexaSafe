/**
 * NexaSafe - Digital Safety Checker Engine
 * Rule-Based Heuristic Analysis for Suspicious Messages, Phishing, & Harassment
 * Transparent Educational Disclaimers & Actionable Guidance
 */

class DigitalSafetyChecker {
  constructor() {
    // Rule Definitions
    this.rules = {
      sextortionAndBlackmail: {
        category: "Extortion / Blackmail Threats",
        severity: "high",
        keywords: [
          "recorded you", "webcam", "camera footage", "private video", "dirty video", 
          "leak your photos", "send to all your contacts", "send bitcoin", "btc", 
          "pay me or else", "compromised your device", "know your password", "humiliate you"
        ],
        explanation: "Contains classic extortion/sextortion intimidation patterns. Perpetrators often use leaked data breaches to falsely claim they have private footage."
      },
      phishingAndCredentials: {
        category: "Credential Phishing / Account Takeover",
        severity: "high",
        keywords: [
          "verify your account", "account suspended", "security alert", "enter your otp", 
          "password expired", "click here to unlock", "unusual activity detected", 
          "confirm your identity", "banking alert", "billing failed", "update payment"
        ],
        explanation: "Urges the recipient to click an external link and re-enter passwords or OTPs, which is typical of credential harvesting."
      },
      urgencyAndPressure: {
        category: "Artificial Urgency & Intimidation",
        severity: "medium",
        keywords: [
          "within 24 hours", "immediate action required", "warrant issued", 
          "final notice", "legal action will be taken", "act immediately", "urgent response"
        ],
        explanation: "Uses intense time pressure and fear to bypass critical thinking and force a hasty reaction."
      },
      financialScams: {
        category: "Financial / Lottery Scam",
        severity: "medium",
        keywords: [
          "you won", "cash prize", "lottery", "claim reward", "congratulations selected", 
          "free gift card", "investment guaranteed", "double your money"
        ],
        explanation: "Promises unexpected rewards to lure targets into paying processing fees or handing over financial credentials."
      }
    };

    this.urlRules = {
      suspiciousTLDs: [".xyz", ".top", ".buzz", ".cam", ".work", ".tk", ".ml", ".ga", ".cf", ".gq", ".click"],
      urlShorteners: ["bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy", "shorturl.at"],
      typoSquatting: [
        { brand: "google", typos: ["g00gle", "googel", "goog1e", "gooogle"] },
        { brand: "instagram", typos: ["instagrarn", "1nstagram", "instgram", "instagrann"] },
        { brand: "whatsapp", typos: ["whaatsapp", "whatsap", "watsapp", "whatsapp-verify"] },
        { brand: "paypal", typos: ["paypa1", "paypa-l", "pay-pal-secure"] },
        { brand: "apple", typos: ["app1e", "apple-id-verify", "apple-support-login"] },
        { brand: "facebook", typos: ["faceb00k", "face-book-login"] }
      ]
    };
  }

  scanContent(input) {
    const text = input ? input.trim() : "";
    if (!text) {
      window.NexaApp.showToast("Please paste a message or URL to analyze.", "warning");
      return null;
    }

    const lowerText = text.toLowerCase();
    const findings = [];
    let highestSeverity = "safe";

    // 1. Text Rule Matching
    for (const [key, rule] of Object.entries(this.rules)) {
      const matched = rule.keywords.filter(kw => lowerText.includes(kw));
      if (matched.length > 0) {
        findings.push({
          category: rule.category,
          severity: rule.severity,
          matchedKeywords: matched,
          explanation: rule.explanation
        });
        if (rule.severity === "high") highestSeverity = "high";
        else if (rule.severity === "medium" && highestSeverity !== "high") highestSeverity = "medium";
      }
    }

    // 2. URL Extraction & Analysis
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/gi;
    const extractedUrls = text.match(urlRegex) || [];
    const urlFindings = [];

    extractedUrls.forEach(urlStr => {
      const lowerUrl = urlStr.toLowerCase();

      // Check Suspicious TLD
      const matchedTLD = this.urlRules.suspiciousTLDs.find(tld => lowerUrl.includes(tld));
      if (matchedTLD) {
        urlFindings.push({
          type: "Unusual Top-Level Domain",
          detail: `Uses '${matchedTLD}', which is frequently associated with disposable malicious domains.`,
          severity: "medium"
        });
        if (highestSeverity === "safe") highestSeverity = "medium";
      }

      // Check URL Shortener
      const matchedShortener = this.urlRules.urlShorteners.find(sh => lowerUrl.includes(sh));
      if (matchedShortener) {
        urlFindings.push({
          type: "Shortened Link Destination Hidden",
          detail: `Uses a URL shortener (${matchedShortener}) to conceal the real destination address.`,
          severity: "medium"
        });
        if (highestSeverity === "safe") highestSeverity = "medium";
      }

      // Check IP Address as Hostname
      if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(lowerUrl)) {
        urlFindings.push({
          type: "Direct IP Address in URL",
          detail: "Links directly to an IP address instead of a legitimate registered domain name.",
          severity: "high"
        });
        highestSeverity = "high";
      }

      // Check Typosquatting
      this.urlRules.typoSquatting.forEach(ts => {
        const foundTypo = ts.typos.find(t => lowerUrl.includes(t));
        if (foundTypo) {
          urlFindings.push({
            type: "Impersonated Domain / Typosquatting",
            detail: `Appears to imitate '${ts.brand}' using the deceptive domain spelling '${foundTypo}'.`,
            severity: "high"
          });
          highestSeverity = "high";
        }
      });

      // Check Insecure HTTP
      if (lowerUrl.startsWith("http://")) {
        urlFindings.push({
          type: "Insecure Protocol (HTTP)",
          detail: "Lacks SSL/TLS encryption. Legitimate login pages always use HTTPS.",
          severity: "medium"
        });
        if (highestSeverity === "safe") highestSeverity = "medium";
      }
    });

    return {
      analyzedText: text,
      extractedUrls,
      severity: highestSeverity,
      textFindings: findings,
      urlFindings: urlFindings,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  renderResults(result) {
    const container = document.getElementById('checker-results-container');
    if (!container || !result) return;

    container.classList.remove('hidden');

    let badgeClass = "badge-teal";
    let badgeText = "No Common Threat Patterns Detected";
    let cardBorder = "border-color: var(--color-teal-500);";

    if (result.severity === "high") {
      badgeClass = "badge-danger";
      badgeText = "🚨 High Suspicion / Known Risk Signals Detected";
      cardBorder = "border-color: var(--color-rose-600);";
    } else if (result.severity === "medium") {
      badgeClass = "badge-demo";
      badgeText = "⚠️ Warning: Suspicious Markers Present";
      cardBorder = "border-color: var(--color-amber-500);";
    }

    let html = `
      <div class="card" style="${cardBorder}">
        <div class="flex items-center justify-between mb-3">
          <span class="badge ${badgeClass}" style="font-size: 0.8125rem; padding: 0.4rem 0.85rem;">
            ${badgeText}
          </span>
          <span class="text-xs text-slate-500 font-mono">${result.timestamp}</span>
        </div>
    `;

    // Educational Disclaimer
    html += `
      <div class="notice-box notice-amber mb-3" style="font-size: 0.775rem;">
        <strong>Important Disclaimer:</strong> This rule-based tool scans for common keywords and domain anomalies. 
        <strong>Results are not a guarantee that a message or link is safe</strong>, nor do they replace cybersecurity verification. Always verify unexpected communications independently.
      </div>
    `;

    if (result.textFindings.length === 0 && result.urlFindings.length === 0) {
      html += `
        <div class="card card-teal mt-3">
          <h4 class="text-sm font-bold text-teal mb-1">✓ No Blacklisted Patterns Found</h4>
          <p class="text-xs text-slate-700">
            The input did not trigger any of our rule-based filters for sextortion, urgent credential harvesting, or deceptive URLs. However, if the message requests money, private information, or feels manipulative, still treat it with caution.
          </p>
        </div>
      `;
    } else {
      // Detected Signals Breakdown
      html += `<h4 class="text-sm font-bold text-slate-800 mt-3 mb-2">Identified Indicators:</h4><div class="space-y-2">`;
      
      result.textFindings.forEach(f => {
        html += `
          <div class="card card-lavender" style="padding: 0.85rem 1rem; margin-bottom: 0.5rem;">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-purple">${f.category}</span>
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${f.severity === 'high' ? 'badge-danger' : 'badge-demo'}">${f.severity}</span>
            </div>
            <p class="text-xs text-slate-700 mt-1">${f.explanation}</p>
            <div class="text-[11px] text-slate-500 mt-1">
              Trigger keywords: <code style="background: rgba(0,0,0,0.05); padding: 1px 4px; border-radius: 4px;">${f.matchedKeywords.join(', ')}</code>
            </div>
          </div>
        `;
      });

      result.urlFindings.forEach(u => {
        html += `
          <div class="card card-lavender" style="padding: 0.85rem 1rem; margin-bottom: 0.5rem;">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800">🔗 ${u.type}</span>
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${u.severity === 'high' ? 'badge-danger' : 'badge-demo'}">${u.severity}</span>
            </div>
            <p class="text-xs text-slate-700 mt-1">${u.detail}</p>
          </div>
        `;
      });

      html += `</div>`;

      // Recommended Next Steps Checklist
      html += `
        <div class="mt-4 pt-3 border-t border-slate-200">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Recommended Protective Actions:</h4>
          <ul class="text-xs text-slate-700 space-y-1.5" style="padding-left: 1.25rem; list-style-type: disc;">
            <li><strong>Do not click any embedded links</strong> or download attachments.</li>
            <li><strong>Never send cryptocurrency, gift cards, or money.</strong> Blackmailers rarely stop after the first payment.</li>
            <li><strong>Preserve evidence:</strong> Take full-screen screenshots showing the sender handle, timestamp, and message headers before blocking.</li>
            <li><strong>Report to authorities:</strong> In India, lodge an online complaint at <a href="https://cybercrime.gov.in" target="_blank" class="text-purple font-semibold">cybercrime.gov.in</a> or dial <strong>1930</strong>.</li>
          </ul>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  loadSample(sampleType) {
    const inputEl = document.getElementById('checker-input');
    if (!inputEl) return;

    if (sampleType === 'sextortion') {
      inputEl.value = "I have compromised your webcam and recorded you watching private videos. If you don't send $500 in bitcoin within 24 hours, I will leak your photos and send the video to all your contacts and family.";
    } else if (sampleType === 'phishing') {
      inputEl.value = "URGENT SECURITY ALERT: Your Instagram account has unusual activity and will be suspended within 24 hours. Click http://instagrarn-security-login.xyz to verify your password immediately and enter your OTP.";
    } else if (sampleType === 'safe') {
      inputEl.value = "Hi Priya! Just checking if we're still meeting at the campus library at 4:30 PM for our group project review. Let me know when you arrive!";
    }

    this.runScan();
  }

  runScan() {
    const inputEl = document.getElementById('checker-input');
    if (inputEl) {
      const result = this.scanContent(inputEl.value);
      if (result) this.renderResults(result);
    }
  }
}

// Global instance
window.digitalSafetyChecker = new DigitalSafetyChecker();
