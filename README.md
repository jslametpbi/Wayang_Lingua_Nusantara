# Wayang Lingua Nusantara Enterprise Full-Stack Rebuild

This package is a real full-stack architecture kit, not a static GitHub Pages demo.

## Stack
- Frontend: Next.js + React
- Backend: Express API
- Database: PostgreSQL schema via Prisma file
- Storage-ready: Supabase/Cloudinary environment placeholders
- Auth: JWT + bcrypt
- UI: premium dark-gold Wayang 6D visual direction using provided assets and generated tutor portraits

## Default Local Admin
- Email: `admin@wayanglingua.id`
- Password: `Admin@JS2026`

Change this immediately after production deployment.

## Run Locally
```bash
cp .env.example .env
npm install
npm run dev
```

Or with Docker:
```bash
docker compose up --build
```

Frontend: http://localhost:3000  
Backend API: http://localhost:4000/api/health

## Included Systems
1. Protected authentication and role-based session
2. LMS with 16 complete meetings
3. Material builder
4. Assessment management
5. AI tutor platform with 10 tutors
6. Virtual classroom room center
7. Learning analytics
8. Certificate verification API and certificate studio
9. Research passport
10. Admin console
11. Profile/photo editor
12. Chat, Forum, Help Desk interface

## Production Note
For real production, replace the in-memory backend store in `backend/src/server.js` with Prisma Client persistence using `backend/prisma/schema.prisma`, configure Supabase/Cloudinary storage, and deploy frontend/backend separately.
