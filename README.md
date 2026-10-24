# 🛡️ NexaSafe — Women’s Safety & Digital Empowerment Platform

> **College Hackathon Edition • Modern, Responsive, Ethical & Transparent**  
> **Color Palette:** Purple, Soft Lavender, Clean White, and Teal Accent.

NexaSafe is a modern, accessible web platform built to help women respond proactively to **physical safety risks**, **online harassment**, **privacy breaches**, **suspicious messages**, and **identity misuse**.

Designed with ethical transparency at its core, NexaSafe never claims an alert was sent unless it was actually delivered, provides clear heuristic disclaimers, and keeps sensitive incident documentation strictly local to the user's browser.

---

## 🎨 Visual Design & Usability

* **Primary Colors:** Deep Purple (`#5b21b6`), Royal Violet (`#7c3aed`), and Soft Lavender (`#f3f0ff`, `#ddd6fe`).
* **Security & Action Accent:** Teal (`#0d9488`, `#14b8a6`) for verification, safe status, and trusted actions.
* **Alert & Emergency:** Rose (`#e11d48`) for emergency controls.
* **Accessibility:** High-contrast text, clear typography (Plus Jakarta Sans), large touch targets, mobile-responsive bottom navigation, and screen-reader-friendly semantic HTML.

---

## 🌟 The 7 Core Features

### 1. 🏠 Home Dashboard
* **Warm Welcome Banner:** Reassuring, clear orientation for first-time visitors.
* **Safety Tips Carousel:** Contextual daily advice covering rideshares, social media check-in delays, and 2FA upgrades.
* **Quick-Action Grid:** 6 accessible cards navigating directly to SOS, Safe Journey, Scanner, Incident Logs, Privacy Center, and Helplines.

### 2. 🚨 Emergency SOS (Demo Mode with Ethical Transparency)
* **Prominent SOS Button:** High-visibility pulsing button with a **3-second abort window** to prevent accidental clicks.
* **Explicit Demo Labels:** Transparently informs judges and users: *"Simulated SOS Demo: No real cellular SMS was dispatched. In production, an SMS gateway (e.g., Twilio) is required."*
* **Trusted Contacts Management:** Full CRUD interface to add, view, and remove trusted contacts with input validation (minimum 2 letters, 7+ digits for phone numbers). Pre-loaded with clearly labelled sample demo contacts.
* **Direct Emergency Dials:** Real, functional 1-tap call links to **112** (Universal Emergency), **1091** (Women Helpline), and **1930** (Cyber Crime).
* **Manual WhatsApp Broadcast Generator:** Pre-fills an emergency alert link so users can review and approve sending before dispatch.

### 3. 🚶‍♀️ Safe Journey Check-in
* **Journey Setup:** Enter a destination, select a trusted contact, and choose a check-in duration (5, 10, 15, 20, 30 minutes).
* **Transparent Technical Disclaimer:** Clearly states: *"Notice: Real-time background GPS tracking requires native smartphone background permissions and a live server backend. This module demonstrates the client-side journey countdown and check-in prompt workflow."*
* **Functional Countdown & Chime:** Live countdown timer, visual progress bar, audio reminder chime, and a check-in prompt modal upon expiration.
* **Safe Arrival Confirmation:** One-tap button confirming arrival and safely ending the session.

### 4. 🛡️ Digital Safety Checker (Message & Link Scanner)
* **Rule-Based Heuristic Engine:** Analyzes pasted text, DMs, emails, and URLs against categorized rule patterns:
  1. **Blackmail / Sextortion:** Scans for intimidation phrases (*"recorded you"*, *"pay bitcoin"*, *"leak your photos"*, *"send to contacts"*).
  2. **Credential Phishing:** Scans for account takeover lures (*"account suspended"*, *"verify password"*, *"enter your OTP"*, *"click to unlock"*).
  3. **Artificial Urgency:** Flags manipulation tactics (*"within 24 hours"*, *"warrant issued"*, *"final notice"*).
  4. **Suspicious Domain Anomalies:** Detects suspicious disposable TLDs (`.xyz`, `.top`, `.buzz`, `.cam`), URL shorteners concealing destinations (`bit.ly`, `tinyurl`), direct IP address links, and typosquatting domain imitations (`instagrarn`, `paypa1`, `g00gle`).
* **Explicit Heuristic Disclaimer:** Clearly states: *"Results are heuristic indicators and are not a guarantee that a message or link is safe. Always exercise caution and verify sender identity."*
* **Actionable Guidance:** Provides immediate safety checklists (do not pay, preserve screenshots, file report at cybercrime.gov.in).
* **1-Click Test Presets:** Built-in buttons to test sample Sextortion, Phishing, and Safe messages for quick hackathon demonstrations.

### 5. 📝 Private Incident Documentation
* **Confidential Local Logging:** Record incident classification (Harassment, Stalking, Impersonation, Non-consensual Image Sharing, Threats), approximate date, platform/location, narrative description, and evidence notes.
* **Zero Remote Data Transmission Guarantee:** Prominently explains that all records are saved exclusively in the user's browser `localStorage`. No data is uploaded or transmitted across networks.
* **Form Validation:** Validates required fields, classification choice, and requires explicit user consent confirmation.
* **Export Summary:** Formats the incident into a structured, police-ready text report and copies it to the clipboard for formal complaint lodging.

### 6. 🔒 Privacy Center
* **Actionable Step-by-Step Security Guides:**
  1. **Location Permissions Audit:** How to audit and restrict background location sharing on iOS and Android.
  2. **Combating Online Impersonation:** Step-by-step protocol for reporting fake social media accounts and getting them removed.
  3. **Passphrase Strategy & Password Managers:** Why passphrases beat complex passwords and how to eliminate credential reuse.
  4. **Two-Factor Authentication (2FA):** Why Authenticator apps protect against SIM-swapping compared to vulnerable SMS 2FA.
  5. **Safe Evidence Preservation Checklist:** Crucial 5-step checklist for preserving full-screen timestamps and metadata before blocking abusers.

### 7. 📞 Help & Verified Resources Directory
* **Verified National & Cyber Helplines:**
  * **112:** National Emergency Service (Police, Fire, Ambulance).
  * **1091:** Women Helpline (National Commission for Women 24/7 Rapid Response).
  * **1930:** National Cyber Crime Helpline & Portal ([cybercrime.gov.in](https://cybercrime.gov.in)).
  * **181:** Women in Distress Crisis & Counseling Helpline.
  * **+91 78271 70170:** NCW 24/7 WhatsApp Grievance Cell.
  * **+91 91529 87821:** iCall Psychosocial Support (TISS).
* **Campus POSH Act & ICC Guidance:** Explains student rights under University Grants Commission (UGC) regulations.

---

## 📂 File Structure

```
nexasafe/
├── index.html          # Semantic, accessible HTML single-page layout
├── manifest.json       # Web App Manifest for mobile installation
├── README.md           # Documentation, setup & testing guide
├── assets/
│   └── logo.svg        # Purple, Lavender & Teal shield brand asset
├── css/
│   └── styles.css      # Accessible design system, forms, buttons & responsive layout
└── js/
    ├── app.js          # Main app router, toast notifications & tips carousel
    ├── sos.js          # SOS countdown, demo mode controller & WhatsApp link builder
    ├── contacts.js     # Trusted contacts CRUD & localStorage persistence
    ├── journey.js      # Safe Journey check-in timer & audio reminder
    ├── checker.js      # Rule-based message & link heuristic scanner
    ├── incidents.js    # Client-side private incident recorder & report exporter
    └── resources.js    # Verified helplines directory renderer
```

---

## 🛠️ Step-by-Step Instructions to Run and Test

### 1. Running the Project Locally
NexaSafe uses pure frontend technologies (HTML5, CSS3, ES6 JavaScript) with **zero build steps or package installations required**.

* **Option A (Instant Direct Open):**
  1. Open your file explorer to `C:\Users\jyoth\.gemini\antigravity\scratch\nexasafe`.
  2. Double-click `index.html` (or right-click → *Open with Google Chrome / Edge / Firefox / Safari*).
* **Option B (Using Antigravity or VS Code Live Server):**
  1. Open `C:\Users\jyoth\.gemini\antigravity\scratch\nexasafe` as your active workspace.
  2. Right click `index.html` → *Open with Live Server* (if installed).

---

### 2. Testing the Main User Flows

#### Flow 1: Emergency SOS & Trusted Contacts
1. Click **Emergency SOS** on the navigation bar.
2. Read the **Simulation & Transparency Notice** (explaining that real cellular SMS requires a backend telephony gateway).
3. Click the big **SOS button**. Notice the **3-second abort window** counting down. Click **Cancel** to test aborting.
4. Click the SOS button again and let the 3 seconds elapse.
5. Notice the **Active SOS Demo Modal** opens with explicit demo tags, direct dial links for **112** / **1091**, and a **Send WhatsApp Alert** button.
6. Scroll down to **Trusted Contacts**. Click **+ Add Trusted Contact**.
7. Enter a name (e.g., `Neha Gupta`), relationship (`Roommate`), and phone number (`+91 98765 00000`). Click **Save Contact**.
8. Notice the contact appears in the list and is saved in your browser's local storage.

#### Flow 2: Safe Journey Check-in
1. Click **Safe Journey** in the navigation bar.
2. Review the **Architecture & Transparency Notice** (explaining that real-time background GPS tracking requires native app permissions).
3. In the setup form, enter a destination (e.g., `Hostel Gate 3`), pick an assigned contact, and choose a duration (e.g., `5 Minutes`).
4. Click **Start Safe Journey Session**.
5. Observe the live countdown timer (`05:00`), the animated progress bar, and the active session indicators.
6. Click **✓ I Have Arrived Safely** to confirm your safe arrival and conclude the journey.

#### Flow 3: Digital Safety Checker (Scanning Suspicious Messages & Links)
1. Click **Safety Checker** in the navigation bar.
2. Notice the **Heuristic Analysis Notice** explaining that rule-based checks do not guarantee 100% safety.
3. Under *Quick Test Samples*, click **Sextortion Scam**.
4. The scanner fills with a sample blackmail threat. Click **Analyze Message**.
5. View the structured results: **High Suspicion / Known Risk Signals Detected**, with identified indicators (`Extortion / Blackmail Threats`, `Artificial Urgency`) and recommended protective actions.
6. Under *Quick Test Samples*, click **Phishing Link**. Click **Analyze Message**.
7. View detected indicators for `Credential Phishing / Account Takeover` and `Unusual Top-Level Domain (.xyz)`.
8. Under *Quick Test Samples*, click **Safe Message**. Click **Analyze Message**. View the clean, reassuring result.

#### Flow 4: Private Incident Documentation
1. Click **Incident Report** in the navigation bar.
2. Notice the **Zero Remote Data Transmission Guarantee** notice.
3. Select an incident type (e.g., `Online Harassment / Abusive DMs`).
4. Enter an approximate date (`Today, 9:00 PM`) and location/platform (`Instagram DM`).
5. Enter a description (`Received repeated abusive DMs from an anonymous account claiming to know my campus schedule`).
6. Check the local storage privacy agreement and click **Save Incident Locally**.
7. Notice the incident appears in your **Documented Incident History**.
8. Click **📋 Export** on the saved card. The system formats the event into a police-ready summary and copies it to your clipboard!

#### Flow 5: Privacy Center & Verified Helplines
1. Click **Privacy Center** to explore the 5 interactive accordions:
   * Audit Smartphone Location Permissions.
   * Responding to Online Impersonation & Fake Profiles.
   * Strong Passwords & The Passphrase Strategy.
   * Why Authenticator Apps Beat SMS 2FA.
   * Safe Evidence Preservation Checklist Before Blocking Abusers.
2. Click **Helplines** to see verified contact cards for 112, 1091, 181, 1930 Cyber Cell, and NCW WhatsApp with direct dial and official portal links.

---

## 🔒 Security, Privacy & Ethical Guarantees

* **Zero Credentials Exposed:** NexaSafe uses no exposed API keys, secret credentials, or mock authorization tokens.
* **No Fabricated AI Claims:** The Digital Safety Checker is transparently documented as a **rule-based heuristic pattern analyzer**.
* **No Deceptive SOS Delivery:** NexaSafe never falsely claims an SMS was sent over cellular networks when running in client-side demo mode.
* **Privacy-First Data Architecture:** All trusted contacts and incident logs remain stored in the user's browser (`localStorage`) with no background telemetry or remote tracking.

---

## 👩‍⚖️ Hackathon Presentation Tips

1. **State the Dual Problem:** Emphasize that women face both **physical risks** (late night walks, unlit transit) and **digital risks** (online harassment, sextortion, fake social accounts).
2. **Highlight NexaSafe's Ethical Architecture:** Point out to the judges that unlike typical hackathon projects that fake live server dispatch, NexaSafe is designed with engineering honesty, clear demo labels, and local-first privacy.
3. **Showcase the Digital Safety Checker:** Run the one-click *Sextortion* and *Phishing* tests to demonstrate practical utility for students who receive intimidating DMs.
4. **Showcase Incident Export:** Demonstrate how easily a student can document an incident and click *Export* to generate a structured complaint for their college proctor or police.
