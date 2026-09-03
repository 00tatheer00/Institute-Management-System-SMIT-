# Mohsin and Huma IT Center × SMIT Portal
## Disaster Recovery, Backup & Restoration Runbook

This document defines the production backup procedures, disaster recovery (DR) protocols, and operational retention policies for the **Mohsin and Huma IT Center × SMIT Portal**.

---

## 1. Backup Strategy Overview

| Asset | Frequency | Storage Location | Retention | Automation Method |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL Database** | Daily Automated Snapshot | Supabase Managed Cloud (AWS EU/US) | 30 Days | Supabase Daily Backup & PITR |
| **Database Schema Dumps** | On Every Git Release | GitHub Repository (`supabase/migrations/`) | Permanent | Git Version Control |
| **Encrypted Offsite Dump** | Weekly (Sundays 02:00 UTC) | Encrypted S3 / Cloudflare R2 Bucket | 90 Days | Scheduled GitHub Action via `pg_dump` |
| **Storage Buckets** (Uploads) | Continuous Mirroring | Supabase S3 Object Storage | Redundant | Cross-Region Replication |

---

## 2. Automated PostgreSQL Dump Procedure

To take an on-demand full database backup:

```bash
# Set your production database URL
export DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"

# Execute schema + data compressed export
pg_dump "$DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="mhit_backup_$(date +%Y%m%d_%H%M%S).dump"
```

To export schema only (without student records):
```bash
pg_dump "$DATABASE_URL" --schema-only --file="mhit_schema_$(date +%Y%m%d).sql"
```

---

## 3. Storage Bucket Backup Procedure

Supabase Storage files are organized into 7 buckets:
1. `course-materials`
2. `student-submissions`
3. `certificates`
4. `verification-docs`
5. `project-assets`
6. `gallery-photos`
7. `system-assets`

Use the AWS S3 CLI or Rclone with Supabase S3-compatible credentials:
```bash
# Sync all uploaded files to cold offsite storage
aws s3 sync s3://mhit-storage-bucket/ s3://mhit-cold-backup/ --delete
```

---

## 4. Disaster Recovery & Restoration Runbook

In the event of database corruption or hardware failure:

### Step 1: Provision Clean Supabase Instance
1. Create a new Supabase project on the cloud console.
2. Retrieve the new Database URL, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Step 2: Apply Sequential Schema Migrations
Apply the migrations in order:
```bash
supabase db push
# OR apply manually via psql:
psql "$DATABASE_URL" -f supabase/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/002_row_level_security.sql
psql "$DATABASE_URL" -f supabase/migrations/003_storage_buckets.sql
psql "$DATABASE_URL" -f supabase/migrations/004_seed_data.sql
psql "$DATABASE_URL" -f supabase/migrations/005_communications_and_automation.sql
```

### Step 3: Restore Data Snapshot
```bash
pg_restore \
  --dbname="$DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  "mhit_backup_latest.dump"
```

### Step 4: Verify Data Health & Relational Integrity
1. Log in to `/admin/data-management`.
2. Run the **Automated Data Diagnostics** scan:
   - Check orphaned student records: 0
   - Check batch enrollment consistency: 100%
   - Check attendance date integrity: Valid
3. Test public certificate verification at `/verify-certificate`.

### Step 5: Update Production DNS & Environment
1. Update Vercel environment variables with the new Supabase credentials.
2. Trigger production deployment.
3. Conduct sanity check on `/login`.
