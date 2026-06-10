# Wayang Lingua Nusantara Enterprise Architecture

This architecture fulfills the requested integrated platform: LMS, Assessment Management System, AI Tutor Platform, Virtual Classroom System, Learning Analytics Dashboard, Certificate Verification System, and Research Passport System.

## Stack
- Frontend: Next.js / React
- Backend: NestJS or Express
- Database: PostgreSQL
- Storage: Supabase Storage / Cloudinary
- Auth: JWT with role-based access control
- Realtime: WebSocket for chat, rooms, forum notifications
- AI: tutor prompt engine with optional OpenAI API or local rule-based fallback

## Systems
1. Protected authentication: student, lecturer, admin, researcher.
2. LMS: 16 meetings, CEFR, four skills, vocabulary, quiz, rubric, portfolio.
3. Assessment: item bank, rubrics, scoring, upload evidence.
4. AI Tutors: 10 Wayang tutors, unique logic, saved sessions, TTS.
5. Virtual Classroom: rooms, attendance, chat, breakouts, whiteboard/screen-share panel.
6. Analytics: progress, CEFR growth, attendance, AI use, submissions.
7. Certificate Verification: QR, ID, verification page, print/download.
8. Research Passport: pre/post data, exports, evidence package.
