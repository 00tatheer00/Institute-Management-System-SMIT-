# Production Deployment & Operations Runbook

**Mohsin and Huma IT Center × SMIT Portal**

---

## 1. Production Architecture Overview

The recommended and validated production hosting architecture is:
- **Frontend & App Layer**: [Vercel](https://vercel.com) (Next.js 16 with Edge routing & Turbopack SSR).
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL 15+ Managed Instance with Auth & RLS).
- **Object Storage**: Supabase Storage (S3-compatible global CDN).
- **DNS & CDN**: Vercel Edge Network with automatic TLS/SSL.

---

## 2. Step-by-Step Deployment Guide

### Step 1: Provision Supabase Project
1. Create a free or Pro organization account at [supabase.com](https://supabase.com).
2. Click **New Project** and configure:
   - **Name**: `mhit-portal-production`
   - **Database Password**: Generate a secure 32+ character password and store in a secrets vault.
   - **Region**: Select the closest geographic region to Pakistan (e.g. `ap-south-1` Mumbai or `me-central-1`).
3. Navigate to **Project Settings → API** and copy:
   - `Project URL`
   - `anon` `public` key
   - `service_role` `secret` key

### Step 2: Apply Database Migrations
Open the **SQL Editor** in your Supabase project dashboard and execute each migration file in sequence from `supabase/migrations/`:
1. `001_initial_schema.sql` (Creates all tables, constraints, foreign keys, and indexes).
2. `002_row_level_security.sql` (Enables RLS on every table and defines role-based access policies).
3. `003_storage_buckets.sql` (Creates the 7 storage buckets and applies storage RLS policies).
4. `004_seed_data.sql` *(Optional for initial courses, batches, and trainer accounts)*.

### Step 3: Deploy Frontend to Vercel
1. Log in to [vercel.com](https://vercel.com) and click **Add New → Project**.
2. Connect your GitHub repository: `00tatheer00/Institute-Management-System-SMIT-`.
3. Set Framework Preset: **Next.js**.
4. In the **Environment Variables** section, add:
   | Variable Name | Environment | Value Description |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Production & Preview | Supabase Project URL (`https://xyz.supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production & Preview | Public client anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Production & Preview | Restricted backend service role key |
5. Click **Deploy**.

### Step 4: Configure Auth URL & Redirects
In your Supabase project dashboard:
1. Navigate to **Authentication → URL Configuration**.
2. Set **Site URL** to your production domain: `https://your-domain.vercel.app`.
3. Add **Redirect URLs**:
   - `https://your-domain.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)

---

## 3. Database Backup & Disaster Recovery Readiness

| Category | Status | Details & Procedure |
|---|---|---|
| **Automated Point-in-Time Recovery** | Supabase Managed | Supabase automatically maintains daily database snapshots on Pro tiers (7-day retention) or automated daily backups on Free tiers. |
| **Manual Schema Backup** | **IMPLEMENTED** | All tables, functions, triggers, and policies are committed as version-controlled code in `supabase/migrations/`. |
| **CLI Disaster Recovery** | Documented | Use `supabase db dump -f backup.sql` via Supabase CLI to export full data and schema. |
| **Restore Procedure** | Documented | In event of corruption or accidental data loss, execute: `psql -h db.xyz.supabase.co -U postgres -d postgres -f backup.sql`. |

---

## 4. Environment Management Matrix

| Environment | Database URL | Demo Persona Switcher | Access Mode |
|---|---|---|---|
| **Local Development** | `.env.local` or Offline Fallback | Enabled (offline preview) | Local developer machine |
| **Staging / Preview** | Staging Supabase Instance | Disabled | CI/CD Preview Deployments |
| **Live Production** | Dedicated Production Supabase | Disabled | Verified institute users |

---

## 5. Security & Verification Checklist

- [x] RLS enabled on 100% of user data tables.
- [x] Storage buckets classified as Public (avatars, certificates, projects) vs. Private (student CNIC/documents, tickets).
- [x] No `service_role` key exposed to client components.
- [x] Public `/verify-certificate` route strips student phone numbers, CNIC, and internal records.
- [x] Quiz answer key sanitized prior to delivering questions to student browser.
- [x] Bilingual layout renders flawlessly in both English (LTR) and Urdu (RTL).
- [x] Production build passes with 0 errors across all 169 routes.
