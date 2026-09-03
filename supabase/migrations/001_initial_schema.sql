-- =============================================================================
-- MOHSIN AND HUMA IT CENTER (MHIT) × SMIT PORTAL
-- Migration 001: Normalized Production Database Schema
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM ('super-admin', 'admin', 'trainer', 'student', 'staff');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE batch_status AS ENUM ('upcoming', 'enrolling', 'in-progress', 'completed', 'cancelled');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated', 'dropped', 'suspended');
CREATE TYPE application_status AS ENUM ('pending', 'under-review', 'approved', 'rejected', 'waitlisted');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE assignment_state AS ENUM ('draft', 'published', 'closed', 'archived');
CREATE TYPE submission_status AS ENUM ('not-submitted', 'submitted', 'late', 'graded', 'returned');
CREATE TYPE quiz_status AS ENUM ('draft', 'published', 'open', 'closed', 'archived');
CREATE TYPE document_status AS ENUM ('verified', 'pending', 'rejected');
CREATE TYPE certificate_status AS ENUM ('issued', 'revoked', 'pending');
CREATE TYPE ticket_status AS ENUM ('open', 'in-progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- =============================================================================
-- 1. PROFILES & RBAC
-- =============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role user_role NOT NULL,
  permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- =============================================================================
-- 2. ACADEMIC STRUCTURE (COURSES, MODULES, TRAINERS, ROOMS, BATCHES)
-- =============================================================================

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY DEFAULT ('course-' || substr(md5(random()::text), 1, 8)),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  level course_level NOT NULL DEFAULT 'beginner',
  duration_weeks INT NOT NULL DEFAULT 16,
  description TEXT NOT NULL,
  syllabus TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_modules (
  id TEXT PRIMARY KEY DEFAULT ('mod-' || substr(md5(random()::text), 1, 8)),
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 1,
  duration_weeks INT NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY DEFAULT ('room-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL UNIQUE,
  capacity INT NOT NULL DEFAULT 30,
  room_type TEXT NOT NULL DEFAULT 'Computer Lab',
  floor TEXT NOT NULL DEFAULT '1st Floor',
  has_projector BOOLEAN NOT NULL DEFAULT true,
  has_ac BOOLEAN NOT NULL DEFAULT true,
  has_solar_backup BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY DEFAULT ('trainer-' || substr(md5(random()::text), 1, 8)),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  title TEXT NOT NULL DEFAULT 'Senior Faculty',
  bio TEXT,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY DEFAULT ('batch-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  trainer_id TEXT NOT NULL REFERENCES trainers(id) ON DELETE RESTRICT,
  room_id TEXT REFERENCES rooms(id) ON DELETE SET NULL,
  campus TEXT NOT NULL DEFAULT 'Main Campus',
  total_seats INT NOT NULL DEFAULT 40,
  enrolled_seats INT NOT NULL DEFAULT 0,
  status batch_status NOT NULL DEFAULT 'upcoming',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  schedule_days TEXT[] NOT NULL DEFAULT '{"Monday", "Wednesday", "Friday"}',
  start_time TIME NOT NULL DEFAULT '09:00:00',
  end_time TIME NOT NULL DEFAULT '11:00:00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_sessions (
  id TEXT PRIMARY KEY DEFAULT ('cls-' || substr(md5(random()::text), 1, 8)),
  batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_id TEXT REFERENCES rooms(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. STUDENTS & ADMISSIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY DEFAULT ('std-' || substr(md5(random()::text), 1, 8)),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  registration_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  cnic TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL DEFAULT 'Karachi',
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE RESTRICT,
  status student_status NOT NULL DEFAULT 'active',
  attendance_percentage NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  gpa NUMERIC(3,2) NOT NULL DEFAULT 4.00,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_profiles (
  student_id TEXT PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  address TEXT,
  education TEXT,
  gender TEXT NOT NULL DEFAULT 'male',
  date_of_birth DATE,
  github_url TEXT,
  linkedin_url TEXT,
  emergency_name TEXT,
  emergency_phone TEXT,
  emergency_relation TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY DEFAULT ('app-' || substr(md5(random()::text), 1, 8)),
  application_id TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cnic TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Karachi',
  education TEXT NOT NULL DEFAULT 'Intermediate',
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  preferred_batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
  motivation TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS student_documents (
  id TEXT PRIMARY KEY DEFAULT ('doc-' || substr(md5(random()::text), 1, 8)),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT NOT NULL DEFAULT 0,
  status document_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- =============================================================================
-- 4. ACADEMIC LMS: ATTENDANCE, ASSIGNMENTS & QUIZZES
-- =============================================================================

CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY DEFAULT ('att-' || substr(md5(random()::text), 1, 8)),
  class_session_id TEXT REFERENCES class_sessions(id) ON DELETE CASCADE,
  batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'present',
  marked_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(batch_id, student_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY DEFAULT ('asg-' || substr(md5(random()::text), 1, 8)),
  batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  total_marks INT NOT NULL DEFAULT 100,
  status assignment_state NOT NULL DEFAULT 'published',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id TEXT PRIMARY KEY DEFAULT ('sub-' || substr(md5(random()::text), 1, 8)),
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  deployed_url TEXT NOT NULL,
  github_url TEXT,
  notes TEXT,
  status submission_status NOT NULL DEFAULT 'submitted',
  marks INT CHECK (marks IS NULL OR (marks >= 0 AND marks <= 100)),
  feedback TEXT,
  graded_by TEXT,
  graded_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY DEFAULT ('qz-' || substr(md5(random()::text), 1, 8)),
  batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  passing_percentage INT NOT NULL DEFAULT 60,
  total_questions INT NOT NULL DEFAULT 10,
  status quiz_status NOT NULL DEFAULT 'published',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY DEFAULT ('qq-' || substr(md5(random()::text), 1, 8)),
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple-choice',
  points INT NOT NULL DEFAULT 1,
  order_index INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS quiz_options (
  id TEXT PRIMARY KEY DEFAULT ('qo-' || substr(md5(random()::text), 1, 8)),
  question_id TEXT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_index INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY DEFAULT ('qa-' || substr(md5(random()::text), 1, 8)),
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  total_points INT NOT NULL DEFAULT 10,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'submitted'
);

CREATE TABLE IF NOT EXISTS learning_materials (
  id TEXT PRIMARY KEY DEFAULT ('mat-' || substr(md5(random()::text), 1, 8)),
  batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  material_type TEXT NOT NULL DEFAULT 'document',
  file_url TEXT,
  external_link TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. CERTIFICATES & PUBLIC VERIFICATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY DEFAULT ('cert-' || substr(md5(random()::text), 1, 8)),
  certificate_number TEXT NOT NULL UNIQUE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  student_name TEXT NOT NULL,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  course_name TEXT NOT NULL,
  batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE RESTRICT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  verification_hash TEXT NOT NULL UNIQUE,
  status certificate_status NOT NULL DEFAULT 'issued',
  grade TEXT NOT NULL DEFAULT 'A',
  qr_code_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. STUDENT PORTFOLIO, PROJECTS & CAMPUS OPERATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS student_projects (
  id TEXT PRIMARY KEY DEFAULT ('prj-' || substr(md5(random()::text), 1, 8)),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Full Stack Web',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT NOT NULL,
  live_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY DEFAULT ('tkt-' || substr(md5(random()::text), 1, 8)),
  ticket_number TEXT NOT NULL UNIQUE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'academic',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_messages (
  id TEXT PRIMARY KEY DEFAULT ('msg-' || substr(md5(random()::text), 1, 8)),
  ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY DEFAULT ('fb-' || substr(md5(random()::text), 1, 8)),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  trainer_id TEXT REFERENCES trainers(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY DEFAULT ('evt-' || substr(md5(random()::text), 1, 8)),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Main Auditorium',
  capacity INT NOT NULL DEFAULT 100,
  registered_count INT NOT NULL DEFAULT 0,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id TEXT PRIMARY KEY DEFAULT ('reg-' || substr(md5(random()::text), 1, 8)),
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, email)
);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY DEFAULT ('anc-' || substr(md5(random()::text), 1, 8)),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'academic',
  target_audience TEXT NOT NULL DEFAULT 'all',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. FINANCE & CAREER PLACEMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS funding_grants (
  id TEXT PRIMARY KEY DEFAULT ('grt-' || substr(md5(random()::text), 1, 8)),
  source_name TEXT NOT NULL,
  grant_number TEXT NOT NULL UNIQUE,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  purpose TEXT NOT NULL,
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY DEFAULT ('exp-' || substr(md5(random()::text), 1, 8)),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'settled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_profiles (
  id TEXT PRIMARY KEY DEFAULT ('car-' || substr(md5(random()::text), 1, 8)),
  student_id TEXT NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  employment_status TEXT NOT NULL DEFAULT 'looking',
  skills TEXT[] NOT NULL DEFAULT '{}',
  cv_readiness INT NOT NULL DEFAULT 75,
  desired_role TEXT NOT NULL DEFAULT 'Full Stack Developer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS placements (
  id TEXT PRIMARY KEY DEFAULT ('plc-' || substr(md5(random()::text), 1, 8)),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  placement_type TEXT NOT NULL DEFAULT 'internship',
  monthly_stipend INT NOT NULL DEFAULT 45000,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. AUDIT LOGS & BULK IMPORT JOBS
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT ('aud-' || substr(md5(random()::text), 1, 8)),
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  details TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS import_jobs (
  id TEXT PRIMARY KEY DEFAULT ('imp-' || substr(md5(random()::text), 1, 8)),
  file_name TEXT NOT NULL,
  file_size INT NOT NULL DEFAULT 0,
  data_type TEXT NOT NULL,
  total_rows INT NOT NULL DEFAULT 0,
  imported_rows INT NOT NULL DEFAULT 0,
  failed_rows INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  imported_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_students_course_batch ON students(course_id, batch_id);
CREATE INDEX IF NOT EXISTS idx_students_cnic ON students(cnic);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_attendance_batch_date ON attendance_records(batch_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_submissions_asg_student ON assignment_submissions(assignment_id, student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_cert_num ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_hash ON certificates(verification_hash);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_student ON support_tickets(student_id);
