# API Contract

POST /auth/login
POST /auth/register
GET /me
GET /modules
GET /modules/:id
POST /materials
PATCH /materials/:id
POST /assessments
POST /submissions
POST /ai-tutors/:tutor/respond
GET /ai-tutors/sessions
POST /rooms
PATCH /rooms/:id
POST /rooms/:id/attendance
GET /analytics/student/:id
GET /analytics/admin
POST /certificates/issue
GET /verify/:certificateNo
GET /research-passport/:userId
