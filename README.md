# Wayang Lingua Nusantara (WLN)

**AI-Powered Wayang Storytelling for EFL Skills**  
© Dr. Joko Slamet 2026 — All rights reserved

A full-featured, offline-capable English as a Foreign Language (EFL) learning platform built around the Indonesian wayang tradition. Students develop language skills through shadow-puppet storytelling; lecturers track progress and export research-grade data; administrators manage the platform end-to-end.

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | `siti.nur@student.ac.id` | `Student@2026` |
| Lecturer | `lecturer@wayanglingua.id` | `Lecturer@2026` |
| Admin | `admin@wayanglingua.id` | `Admin@JS2026` |

---

## Features

### Student Experience
- **6-Step Lesson Journey** — Explore → Listen & Read → Speak & Perform → Write & Reflect → AI Feedback → Achieve
- **16 Lakon Stories** across A1 – C2 (CEFR)
- **Shadow Speaking Theatre** — browser speech recognition with live pronunciation/fluency scoring
- **5 Wayang AI Mentors** (Semar, Gareng, Petruk, Bagong, Dalang AI) + 5 hero mentors (Arjuna, Srikandi, Bima, Gatotkaca, Kresna)
- **Gamification** — XP, streaks, 8 achievement badges, A1→C2 learning path
- **Progress tracking** — radar chart, pre/post test, skill bars

### Lecturer Interface
- **Dashboard** — class overview, CEFR distribution, pending reviews, activity feed
- **Student Profiles** — per-student radar chart, pre/post comparison, engagement stats
- **Assessment Builder** — create Speaking/Writing/Quiz/Listening tasks with rubrics
- **Assignment Review** — score ring, Feedback/Rubric/AI Insights tabs
- **Analytics** — cohort-wide skill comparison, class progress charts
- **Research Passport** — aggregate pre/post data, vocab growth chart, export CSV / SPSS syntax / JSON
- **Virtual Rooms** — Jitsi integration with agenda, attendance, and chat
- **Certificates** — ornate printable certificates with QR verification

### Admin Console
- User management (add/remove/role)
- Anthropic API key configuration (enables live AI mentor responses)
- Activity log, system stats, data reset

---

## Deploying to GitHub Pages

### First-time setup

1. **Fork or push** this repository to your GitHub account.

2. In your repo, go to **Settings → Pages**.

3. Under **Source**, select **GitHub Actions**.

4. Push any change to `main` — the workflow in `.github/workflows/pages.yml` will build and deploy automatically.

5. Your app will be live at:  
   `https://<your-username>.github.io/<repo-name>/`

### Local development (no build step required)

```bash
# Clone the repo
git clone https://github.com/<your-username>/wayang-lingua-nusantara.git
cd wayang-lingua-nusantara

# Serve with any static file server, e.g.:
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

> **Note:** Speech recognition requires HTTPS in production (GitHub Pages provides this automatically).

---

## Project Structure

```
wayang-lingua-nusantara/
├── index.html               # Entry point
├── manifest.json            # PWA manifest
├── .nojekyll                # Bypass Jekyll on GitHub Pages
├── css/
│   └── styles.css           # Full design system (dark navy + gold wayang theme)
├── js/
│   ├── data.js              # All content: lessons, mentors, badges, seed data
│   ├── charts.js            # Dependency-free SVG charts (donut, radar, bars, line, ring)
│   ├── core.js              # State, auth, gamification, speech engine, AI mentor
│   ├── views-student.js     # Student-facing views
│   ├── views-teacher.js     # Lecturer & admin views
│   └── main.js              # App shell, router, auth landing, boot
├── assets/                  # Logos and imagery
└── .github/
    └── workflows/
        └── pages.yml        # Auto-deploy to GitHub Pages
```

---

## Optional: Live AI Feedback

To enable real-time AI mentor responses and assessment insights:

1. Sign in as Admin.
2. Go to **Admin Console → Anthropic API Key**.
3. Paste your `sk-ant-…` key and save.

The app uses `claude-sonnet-4-6` via the Anthropic API. The key is stored locally in `localStorage` and never transmitted except directly to `api.anthropic.com`.

---

## Technology

- **Pure HTML/CSS/JS** — no build tools, no npm, no framework dependencies
- **Web Speech API** — browser-native speech recognition and synthesis
- **localStorage** — offline-first state persistence
- **Jitsi Meet** — virtual classroom integration
- **GitHub Actions** — zero-config CI/CD to GitHub Pages

---

*Wayang Lingua Nusantara is a pedagogical research tool developed by Dr. Joko Slamet. All wayang characters and cultural references are used with deep respect for Javanese artistic traditions.*
