# API Contract

Base URL: `/api`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /users/me`
- `PUT /users/me`
- `GET /users` admin only

## LMS Materials
- `GET /materials`
- `GET /materials/:id`
- `POST /materials` admin/lecturer
- `PUT /materials/:id` admin/lecturer
- `DELETE /materials/:id` admin/lecturer

## Assessment
- `GET /assessments`
- `POST /assessments` admin/lecturer
- `POST /submissions`
- `POST /scores` admin/lecturer

## AI Tutor
- `GET /ai/tutors`
- `POST /ai/respond`

## Virtual Classroom
- `GET /rooms`
- `POST /rooms`
- `PUT /rooms/:id`
- `POST /rooms/:id/join`
- `POST /rooms/:id/chat`

## Analytics / Certificate / Research
- `GET /analytics/overview`
- `POST /certificates`
- `GET /certificates/verify/:no`
- `GET /research-passport`
