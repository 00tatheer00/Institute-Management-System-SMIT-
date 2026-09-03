# Mohsin and Huma IT Center × SMIT — Institute Management & Learning Platform

A production-grade, bilingual (English LTR & Urdu RTL) Institute Management and Learning Management System (LMS) built for the **Mohsin and Huma IT Center** in partnership with **Saylani Welfare International Trust (SMIT)**.

---

## 🚀 Key Highlights & Architecture

- **Frontend & App Framework**: Next.js 16 (App Router) + React 19 + TypeScript.
- **Styling & Design System**: Tailwind CSS v4 with custom HSL brand design tokens, CSS variables, and Lucide icons.
- **Bilingual & RTL**: Seamless locale routing via `next-intl` (`/en` and `/ur`), full RTL support with proper font hierarchies (Geist Sans + Noto Nastaliq Urdu).
- **Backend & Database**: PostgreSQL on [Supabase](https://supabase.com) with 25+ relational tables, Row-Level Security (RLS) on all user data, and automated database migrations.
- **Authentication**: Real Supabase Auth (email/password, password reset, session refresh, role-based redirects) with offline mock fallback for local development.
- **Object Storage**: Multi-bucket Supabase Storage architecture for student documents, profile images, certificates, course materials, and capstone projects.
- **Security & Privacy**: Strict PII sanitization (public `/verify-certificate` omits student CNIC, phone, email, and address).

---

## 🏛️ System Portals & Roles

| Portal | Audience | Key Capabilities |
|---|---|---|
| **Public Website** | Prospective Students & Public | Course directory, batch schedules, online admissions form, events, student project showcase, institute gallery, and authentic certificate verification. |
| **Student Portal** (`/student`) | Enrolled Students | Academic dashboard, attendance calendar (75% eligibility tracker), assignment submission with live URLs, quiz runner with anti-cheat sanitization, grades & GPA transcript, certificate locker, and support tickets. |
| **Trainer Portal** (`/trainer`) | Instructors | Cohort-specific gradebook, bulk attendance marker, assignment creator & 100-mark evaluator, quiz builder, and learning material uploads. |
| **Admin Portal** (`/admin`) | Registrars & Admins | Centralized operational console, student & batch management, attendance audits, council certificate issuance, Excel/CSV bulk importer, finance & grant tracking, data health diagnostics, and append-only audit logs. |

---

## 🛠️ Quick Start & Local Setup

### 1. Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### 2. Clone and Install
```bash
git clone https://github.com/00tatheer00/Institute-Management-System-SMIT-.git
cd Institute-Management-System-SMIT-
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```
*(Note: If left unconfigured or containing placeholder values, the platform automatically runs in graceful offline preview mode with comprehensive sample datasets).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Migrations

Database definitions and security rules are organized in [`supabase/migrations/`](./supabase/migrations/):

1. `001_initial_schema.sql` — Complete 25+ table relational schema, constraints, and indexes.
2. `002_row_level_security.sql` — Row Level Security policies for Student, Trainer, Staff, and Admin roles.
3. `003_storage_buckets.sql` — Storage bucket provisioning and access control policies.
4. `004_seed_data.sql` — Curriculum, instructor, lab, and student cohort seed data.
5. `005_communications_and_automation.sql` — Multi-channel notifications, bilingual templates, delivery logs, user preferences, and automation triggers.

Execute these SQL scripts in numerical sequence within the Supabase SQL Editor.

---

## 📦 Production Build & Testing

```bash
# Type check and production bundle compilation
npm run build

# Start production server
npm run start
```

---

## 🔒 Security & Compliance

- **Role-Based Isolation**: Database policies strictly confine students to their own submissions and trainers to their assigned batches. Staff access is scoped to operational functions.
- **Service Role Protection**: `SUPABASE_SERVICE_ROLE_KEY` is exclusively consumed on the server (`admin.ts`) and is never leaked to browser bundles.
- **Audit Ledger**: Critical operations (status changes, grade entries, imports, certificate issuance) write immutable records to `audit_logs`.
- **Sanitized Quizzes**: Correct answers are stripped from questions prior to transmission to student browsers to prevent DOM inspection cheating.
- **Search Engine Blocking**: `robots.txt` strictly disallows search engine indexing across all private portal routes (`/admin/*`, `/trainer/*`, `/student/*`, `/api/*`).

---

## 📄 Operational & Handover Documentation

- [Administrator Handover Guide](./ADMIN_HANDOVER.md) — Operational manual for institute administrators.
- [Trainer Handover Guide](./TRAINER_HANDOVER.md) — Guide for instructors and teaching assistants.
- [Student User Guide](./STUDENT_HANDOVER.md) — Guide for enrolled students.
- [Disaster Recovery & Backup Runbook](./BACKUP_RECOVERY.md) — Procedures for PostgreSQL snapshots, cold offsite backups, and emergency recovery.
- [Deployment Guide](./DEPLOYMENT.md) — Step-by-step production deployment guide for Vercel + Supabase.

---

## 📜 License
Developed for the **Mohsin and Huma IT Center × SMIT Portal**. All rights reserved.
