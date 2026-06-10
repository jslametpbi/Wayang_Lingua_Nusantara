# Premium Architecture

## Frontend
Next.js protected one-screen landing, role-based dashboards, LMS, AI tutor canvas, virtual room center, assessment builder, reports, research passport, certificate studio, admin console.

## Backend
Express API with JWT, role protection, user sessions, LMS content, room actions, AI tutor logs, submissions, scores, certificates, research evidence.

## Database
PostgreSQL schema is provided in `backend/prisma/schema.prisma` for users, materials, assessments, submissions, scores, AI logs, rooms, attendance, certificates, research passport, forum, and help desk.

## Storage
Profile photos and material evidence are represented with upload endpoints. Production should connect Supabase Storage or Cloudinary.

## AI
The portable version uses rule-based tutor engines so it works without paid API. Production can route `/api/ai/respond` to OpenAI or a local LLM while preserving tutor personas.
