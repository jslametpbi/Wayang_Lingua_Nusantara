# Wayang Lingua Nusantara

**AI-Powered Cultural Storytelling for EFL Skills**  
Copyright © Dr. Joko Slamet

Wayang Lingua Nusantara is a static GitHub Pages-ready educational app that integrates Indonesian Wayang storytelling, CEFR-aligned EFL modules, local AI-style feedback, lecturer dashboard, student progress tracking, and research-ready data export.

## Main Features

- Register and login for students or lecturers
- Wayang World character library
- CEFR-based story modules from A1 to C1
- Listening chamber with browser text-to-speech
- Reading comprehension tasks
- Speaking practice with browser speech recognition when supported
- Writing studio with local feedback and scoring
- Dalang performance portfolio
- AI Mentor Center with Semar, Gareng, Petruk, Bagong, and Dalang AI
- Student dashboard with skill analytics and badges
- Lecturer dashboard with local class analytics
- Research Passport with JSON/CSV export and printable certificate
- PWA manifest and service worker for installable/offline-ready behavior

## Deployment to GitHub Pages

1. Create a GitHub repository, for example: `Wayang-Lingua-Nusantara`.
2. Upload all files from this folder to the repository root:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.json`
   - `sw.js`
   - `assets/`
3. Open **Settings** → **Pages**.
4. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
5. Save and open the GitHub Pages URL after deployment.

## Important Notes

- No external API key is required.
- Data is stored locally in the user’s browser through `localStorage`.
- For institutional production use, connect the interface to a secure backend database and authentication system.
- The app intentionally contains no demo accounts and no default PIN.

## Recommended Research Use

This app can support classroom research on:

- Wayang-based digital storytelling for EFL learning
- AI-assisted feedback in speaking and writing
- Intercultural communicative competence
- CEFR-aligned EFL skill development
- Cultural heritage-based educational technology
- Learning analytics for language education

## Copyright

Copyright © Dr. Joko Slamet. All rights reserved.
