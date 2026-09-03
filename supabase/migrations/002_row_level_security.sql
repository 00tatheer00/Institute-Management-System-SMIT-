-- =============================================================================
-- MOHSIN AND HUMA IT CENTER (MHIT) × SMIT PORTAL
-- Migration 002: Row Level Security (RLS) & Role-Based Authorization Policies
-- =============================================================================

-- Helper functions for role identification
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_super()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super-admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_student_id()
RETURNS text AS $$
  SELECT id FROM students WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_trainer_id()
RETURNS text AS $$
  SELECT id FROM trainers WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =============================================================================
-- ENABLE RLS ON ALL TABLES
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 1. PROFILES POLICIES
-- =============================================================================

CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin_or_super());

CREATE POLICY "Users can update their own profile details"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  USING (is_admin_or_super());

-- =============================================================================
-- 2. STUDENTS POLICIES
-- =============================================================================

CREATE POLICY "Students can read own record"
  ON students FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Trainers can view enrolled students in their batches"
  ON students FOR SELECT
  USING (
    batch_id IN (
      SELECT id FROM batches WHERE trainer_id = current_trainer_id()
    )
  );

CREATE POLICY "Admins have full access to students"
  ON students FOR ALL
  USING (is_admin_or_super());

-- =============================================================================
-- 3. STUDENT DOCUMENTS POLICIES
-- =============================================================================

CREATE POLICY "Students can view their own documents"
  ON student_documents FOR SELECT
  USING (student_id = current_student_id());

CREATE POLICY "Students can upload their own documents"
  ON student_documents FOR INSERT
  WITH CHECK (student_id = current_student_id());

CREATE POLICY "Admins can view and verify all documents"
  ON student_documents FOR ALL
  USING (is_admin_or_super());

-- =============================================================================
-- 4. ATTENDANCE POLICIES
-- =============================================================================

CREATE POLICY "Students can view their own attendance"
  ON attendance_records FOR SELECT
  USING (student_id = current_student_id());

CREATE POLICY "Trainers can view and mark attendance for their batches"
  ON attendance_records FOR ALL
  USING (
    batch_id IN (
      SELECT id FROM batches WHERE trainer_id = current_trainer_id()
    )
  );

CREATE POLICY "Admins have full access to attendance"
  ON attendance_records FOR ALL
  USING (is_admin_or_super());

-- =============================================================================
-- 5. ASSIGNMENTS & SUBMISSIONS POLICIES
-- =============================================================================

CREATE POLICY "Students can view assignments for their batch"
  ON assignments FOR SELECT
  USING (
    batch_id IN (
      SELECT batch_id FROM students WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can manage assignments for their batches"
  ON assignments FOR ALL
  USING (
    batch_id IN (
      SELECT id FROM batches WHERE trainer_id = current_trainer_id()
    )
  );

CREATE POLICY "Admins have full access to assignments"
  ON assignments FOR ALL
  USING (is_admin_or_super());

-- Submissions
CREATE POLICY "Students can view and submit own submissions"
  ON assignment_submissions FOR ALL
  USING (student_id = current_student_id())
  WITH CHECK (student_id = current_student_id());

CREATE POLICY "Trainers can view and grade submissions for their batches"
  ON assignment_submissions FOR ALL
  USING (
    assignment_id IN (
      SELECT a.id FROM assignments a
      JOIN batches b ON a.batch_id = b.id
      WHERE b.trainer_id = current_trainer_id()
    )
  );

CREATE POLICY "Admins have full access to submissions"
  ON assignment_submissions FOR ALL
  USING (is_admin_or_super());

-- =============================================================================
-- 6. CERTIFICATES & PUBLIC VERIFICATION POLICIES
-- =============================================================================

CREATE POLICY "Public can verify valid certificates"
  ON certificates FOR SELECT
  USING (status = 'issued');

CREATE POLICY "Students can view their own certificates"
  ON certificates FOR SELECT
  USING (student_id = current_student_id());

CREATE POLICY "Admins can manage certificates"
  ON certificates FOR ALL
  USING (is_admin_or_super());

-- =============================================================================
-- 7. STUDENT PROJECTS & PUBLIC SHOWCASE
-- =============================================================================

CREATE POLICY "Public can view published projects"
  ON student_projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Students can manage their own projects"
  ON student_projects FOR ALL
  USING (student_id = current_student_id())
  WITH CHECK (student_id = current_student_id());

CREATE POLICY "Admins can manage all projects"
  ON student_projects FOR ALL
  USING (is_admin_or_super());

-- =============================================================================
-- 8. SUPPORT TICKETS POLICIES
-- =============================================================================

CREATE POLICY "Students can view and create their own tickets"
  ON support_tickets FOR ALL
  USING (student_id = current_student_id())
  WITH CHECK (student_id = current_student_id());

CREATE POLICY "Admins and Staff can manage all tickets"
  ON support_tickets FOR ALL
  USING (is_admin_or_super() OR current_user_role() = 'staff');

CREATE POLICY "Participants can view and send ticket messages"
  ON support_messages FOR ALL
  USING (
    ticket_id IN (SELECT id FROM support_tickets WHERE student_id = current_student_id())
    OR is_admin_or_super()
    OR current_user_role() = 'staff'
  );

-- =============================================================================
-- 9. AUDIT LOGS POLICIES
-- =============================================================================

CREATE POLICY "Admins and Super-Admins can query audit logs"
  ON audit_logs FOR SELECT
  USING (is_admin_or_super());

CREATE POLICY "System and authorized services can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- =============================================================================
-- 10. PUBLIC CATALOG (COURSES, EVENTS, ANNOUNCEMENTS)
-- =============================================================================

CREATE POLICY "Public can view published courses"
  ON courses FOR SELECT
  USING (is_published = true OR is_admin_or_super());

CREATE POLICY "Admins can manage courses"
  ON courses FOR ALL
  USING (is_admin_or_super());

CREATE POLICY "Public can view upcoming events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Public can register for events"
  ON event_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view announcements"
  ON announcements FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage finance and grants"
  ON funding_grants FOR ALL
  USING (is_admin_or_super());

CREATE POLICY "Admins can manage expenses"
  ON expenses FOR ALL
  USING (is_admin_or_super());
