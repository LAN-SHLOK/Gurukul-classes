# Gurukul Classes Platform

A production-grade, enterprise-scale educational management system and AI-powered learning hub designed for Gurukul Classes, Ahmedabad. This ecosystem combines a high-performance Next.js frontend with a specialized Python AI microservice, backed by a robust asynchronous infrastructure.

---

## Technical Stack

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-FF4500?style=for-the-badge&logo=micro-strategy&logoColor=white)](https://bullmq.io/)
[![Pusher](https://img.shields.io/badge/Pusher-300D4F?style=for-the-badge&logo=pusher&logoColor=white)](https://pusher.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

---

## System Architecture

The platform follows a distributed microservices pattern to ensure zero-downtime background processing and high scalability.

```mermaid
graph TD
    User([User Browser]) -->|Next.js App| NextApp[Next.js Server]
    NextApp -->|HTTP| PythonAI[Python AI Service]
    NextApp -->|Add Job| Redis[(Redis Queue)]
    Redis -->|Process| Worker[Background Worker]
    Worker -->|Fetch| PythonAI
    Worker -->|Generate PDF| Worker
    Worker -->|Store| Cloudinary[Cloudinary]
    Worker -->|Email| SMTP[SMTP Server]
    NextApp -->|Real-time| Pusher((Pusher))
    NextApp -->|Auth| NextAuth[NextAuth.js]
    NextApp -->|Query| MongoDB[(MongoDB)]
```

---

## Ecosystem Modules

### 1. Student Portal (Public Ecosystem)
- **Academic Mentor**: Llama-3.3-70B powered tutor with deep knowledge of Gujarat Board (GSEB), NCERT, JEE, and NEET.
- **Course Catalog**: Comprehensive overview of Foundation, Board, and Competitive exam coaching.
- **Topper Gallery**: Performance tracking and public recognition for top-performing students.
- **Faculty & Events**: Dynamic directory of educators and real-time institute event calendars.
- **Admissions Pipeline**: Structured inquiry forms and career/faculty application portals.

### 2. Admin & Staff Control Center
- **Institutional Management**: Control over Faculty, Events, Toppers, and public Announcements.
- **Attendance & Schedules**: Centralized tracking of student attendance and dynamic classroom scheduling.
- **Content Architect**: AI-powered tool for generating branded, illustrated study modules (PDF) in the background.
- **Push Notification Engine**: Real-time admin alerts and system notifications via Pusher.
- **Staff Ecosystem**: Specialized dashboard for teaching staff to manage student data and classroom operations.

### 3. AI Learning Hub (`/ai-service`)
A dedicated Python/FastAPI microservice handling all intelligent computations.
- **RAG Engine**: Fetches live MongoDB context to ensure AI answers are grounded in Gurukul facts.
- **Note Architect**: Expert pedagogical generation with descriptive image prompts for complex topics.
- **Elite Personas**: PhD-level academic guidance optimized for STEM subjects.

---

## Infrastructure Core

### 1. Async Processing (BullMQ + Redis)
Offloads intensive tasks to background workers:
- **Async PDF Generation**: Auto-creates branded PDFs with embedded AI diagrams.
- **Notification Queue**: Background delivery of SMTP emails for inquiries and staff updates.

### 2. Observability (Winston)
Comprehensive logging layer for system health:
- **Request Tracing**: Middleware-level tracking of all incoming traffic.
- **Combined Logs**: Centralized JSON-structured log files for production monitoring.

### 3. Security Hardening
- **IP Rate Limiting**: Multi-tier throttling for public APIs and admin actions.
- **Auth.js Integration**: Secure Google OAuth and Credentials-based authentication.
- **Security Middleware**: Strict Content Security Policy (CSP), XSTS, and XSS protection.

---

## Data Models (MongoDB)

| Model | Purpose |
| :--- | :--- |
| **Student** | Core student records, performance, and contact info. |
| **Faculty** | Educator profiles, expertise, and roles. |
| **Topper** | Historical exam result data and achiever records. |
| **Event** | Institute holidays, exams, and event schedules. |
| **Note** | AI-generated study modules and PDF links. |
| **Inquiry** | Public admission and contact requests. |
| **Schedule** | Classroom timings and subject allocations. |
| **Attendance** | Daily student and staff activity tracking. |

---

## Directory Map

```text
├── ai-service/              # Python AI Microservice (Expert Brain)
├── scripts/                 # System utilities & worker runners
├── src/
│   ├── app/                 # Next.js App Router (Routes & APIs)
│   ├── components/          # UI Components (Shadcn + Framer)
│   ├── lib/
│   │   ├── db/              # Mongoose Models & Schemas
│   │   ├── queue/           # BullMQ Client & Workers
│   │   ├── services/        # AI, Email, and Cloudinary logic
│   │   ├── logger.ts        # Winston Logging Engine
│   │   └── rate-limiter.ts  # Advanced Throttling Logic
│   └── middleware.ts        # Security & Traffic Traces
└── logs/                    # Production JSON Log Storage
```

---

## Setup & Deployment

### Environment Configuration
The platform requires a `.env.local` containing:
- `MONGODB_URI`, `REDIS_HOST`, `GROQ_API_KEY`, `PYTHON_AI_URL`, `CLOUDINARY_URL`, `PUSHER_APP_ID`.

### Bootstrapping
1. **Frontend**: `npm run dev`
2. **AI Service**: `uvicorn main:app --port 8000`
3. **Background Workers**: `npx tsx scripts/run-workers.ts`

---

Proprietary Software of Gurukul Classes, Ahmedabad.
Established 2011.