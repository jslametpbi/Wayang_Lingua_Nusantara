# Wayang Lingua Nusantara
## AI-Powered Wayang Storytelling for EFL Skills

**Copyright © Dr. Joko Slamet**

Wayang Lingua Nusantara is a GitHub Pages-ready interactive web app for English as a Foreign Language learning through Indonesian Wayang heritage. The app integrates the original 5D visual concept, Wayang-based CEFR curriculum, AI-style local feedback, online room access, teacher dashboard, admin console, and research passport export.

## Admin Access

- Admin login is available from the landing page.
- Admin PIN: `JS2026`

## Included Features

- Original visual identity based on the provided Wayang Lingua Nusantara design references.
- Student and lecturer registration/login.
- Admin login using PIN `JS2026`.
- 16 ready-to-use CEFR modules from A1 to C2.
- Wayang World character library.
- Listening narration using browser speech synthesis.
- Speaking practice with browser speech recognition support when available.
- Reading notes and writing studio.
- Local AI-style mentor feedback through Semar, Gareng, Petruk, Bagong, and Dalang AI.
- Dalang performance portfolio.
- Teacher dashboard and review table.
- Online Room integration using generated Jitsi Meet links.
- Research Passport with CSV/JSON export.
- Printable certificate.
- PWA structure with manifest and service worker.

## GitHub Pages Deployment

1. Extract the ZIP.
2. Open the extracted folder.
3. Upload these files and folders directly into a GitHub repository:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.json`
   - `sw.js`
   - `assets/`
   - `README.md`
4. Go to repository **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch: `main`.
7. Select folder: `/root`.
8. Click **Save**.
9. Open the published URL after GitHub finishes deployment.

## Recommended Repository Name

`Wayang_Lingua_Nusantara`

Example GitHub Pages URL:

`https://yourusername.github.io/Wayang_Lingua_Nusantara/`

## Notes

This version is designed for immediate static deployment. Login, progress, user data, portfolio, rooms, and analytics are stored in the browser using localStorage. For institutional production, connect the interface to a protected backend database and encrypted authentication.
