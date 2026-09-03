-- =============================================================================
-- Migration 005: Communication Architecture, Multi-Channel Logs, Templates & Automation Rules
-- Mohsin and Huma IT Center × SMIT Portal
-- =============================================================================

-- 1. NOTIFICATIONS TABLE (In-App Feed)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'student',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  channel VARCHAR(50) NOT NULL DEFAULT 'in-app',
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- 2. NOTIFICATION TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  channels TEXT[] NOT NULL DEFAULT ARRAY['in-app'],
  title_en VARCHAR(255) NOT NULL,
  body_en TEXT NOT NULL,
  title_ur VARCHAR(255) NOT NULL,
  body_ur TEXT NOT NULL,
  variables TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_templates_code ON notification_templates(code);
CREATE INDEX IF NOT EXISTS idx_templates_category ON notification_templates(category);

-- 3. COMMUNICATION LOGS TABLE (Delivery Audit Trail)
CREATE TABLE IF NOT EXISTS communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  recipient_contact VARCHAR(255),
  recipient_role VARCHAR(50) NOT NULL DEFAULT 'student',
  channel VARCHAR(50) NOT NULL,
  template_code VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'queued', -- queued, sending, sent, delivered, failed, cancelled
  provider VARCHAR(100) NOT NULL,
  idempotency_key VARCHAR(255),
  error_message TEXT,
  retry_count INT NOT NULL DEFAULT 0,
  max_retries INT NOT NULL DEFAULT 3,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comm_logs_recipient ON communication_logs(recipient_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_channel_status ON communication_logs(channel, status);
CREATE INDEX IF NOT EXISTS idx_comm_logs_idempotency ON communication_logs(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_comm_logs_created ON communication_logs(created_at DESC);

-- 4. USER NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT true,
  academic_alerts BOOLEAN NOT NULL DEFAULT true,
  event_reminders BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_notif_pref ON user_notification_preferences(user_id);

-- 5. AUTOMATION RULES TABLE
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(100) UNIQUE NOT NULL,
  label VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  channels TEXT[] NOT NULL DEFAULT ARRAY['in-app'],
  template_code VARCHAR(100) NOT NULL,
  reminder_offset_hours INT DEFAULT 0
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Users can read their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid() OR is_admin_or_super());

CREATE POLICY "Users can update read status of own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
  ON notifications FOR ALL
  USING (is_admin_or_super());

-- Templates Policies
CREATE POLICY "Public & Authenticated can read active templates"
  ON notification_templates FOR SELECT
  USING (is_active = true OR is_admin_or_super());

CREATE POLICY "Admins can manage notification templates"
  ON notification_templates FOR ALL
  USING (is_admin_or_super());

-- Communication Logs Policies
CREATE POLICY "Admins can view and manage communication logs"
  ON communication_logs FOR ALL
  USING (is_admin_or_super());

-- User Preferences Policies
CREATE POLICY "Users can view and update own preferences"
  ON user_notification_preferences FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view user preferences"
  ON user_notification_preferences FOR SELECT
  USING (is_admin_or_super());

-- Automation Rules Policies
CREATE POLICY "Admins can manage automation rules"
  ON automation_rules FOR ALL
  USING (is_admin_or_super());

-- =============================================================================
-- SEED NOTIFICATION TEMPLATES (BILINGUAL)
-- =============================================================================

INSERT INTO notification_templates (code, name, category, channels, title_en, body_en, title_ur, body_ur, variables)
VALUES
  (
    'admission_received',
    'Application Received',
    'admission',
    ARRAY['in-app', 'email', 'whatsapp'],
    'Application Received: {{course_name}}',
    'Dear {{student_name}}, your admission application for {{course_name}} has been received. Your registration ID is {{registration_id}}.',
    'درخواست موصول ہوگئی: {{course_name}}',
    'محترم {{student_name}}، آپ کی {{course_name}} کے لیے داخلہ درخواست موصول ہو گئی ہے۔ آپ کی رجسٹریشن آئی ڈی {{registration_id}} ہے۔',
    ARRAY['student_name', 'course_name', 'registration_id']
  ),
  (
    'admission_shortlisted',
    'Application Shortlisted',
    'admission',
    ARRAY['in-app', 'email', 'whatsapp', 'sms'],
    'Admission Shortlist: {{course_name}}',
    'Congratulations {{student_name}}! You have been shortlisted for {{course_name}}. Your interview is scheduled on {{event_date}}.',
    'داخلہ شارٹ لسٹ: {{course_name}}',
    'مبارک ہو {{student_name}}! آپ کو {{course_name}} کے لیے شارٹ لسٹ کر لیا گیا ہے۔ آپ کا انٹرویو {{event_date}} کو ہے۔',
    ARRAY['student_name', 'course_name', 'event_date']
  ),
  (
    'attendance_absent',
    'Student Absent Alert',
    'attendance',
    ARRAY['in-app', 'whatsapp', 'sms'],
    'Absent Alert: {{course_name}} - {{batch_name}}',
    'Dear {{student_name}}, you were marked absent today for {{course_name}} ({{batch_name}}). Please maintain mandatory attendance.',
    'غیر حاضری کی اطلاع: {{course_name}} - {{batch_name}}',
    'محترم {{student_name}}، آج آپ {{course_name}} ({{batch_name}}) میں غیر حاضر مارک ہوئے ہیں۔ برائے مہربانی اپنی حاضری یقینی بنائیں۔',
    ARRAY['student_name', 'course_name', 'batch_name']
  ),
  (
    'attendance_warning',
    'Low Attendance Warning (<75%)',
    'attendance',
    ARRAY['in-app', 'email', 'whatsapp'],
    'Attendance Alert: Attendance below 75%',
    'Dear {{student_name}}, your attendance is currently {{attendance_percentage}}%, which is below the mandatory 75% SMIT council threshold.',
    'حاضری کا انتباہ: حاضری 75 فیصد سے کم ہے',
    'محترم {{student_name}}، آپ کی حاضری اس وقت {{attendance_percentage}} فیصد ہے، جو 75 فیصد کی لازمی حد سے کم ہے۔',
    ARRAY['student_name', 'attendance_percentage']
  ),
  (
    'assignment_published',
    'New Assignment Published',
    'academic',
    ARRAY['in-app', 'whatsapp', 'email'],
    'New Assignment: {{assignment_name}}',
    'A new assignment "{{assignment_name}}" has been posted for {{batch_name}}. Deadline: {{event_date}}.',
    'نیا اسائنمنٹ شائع ہوا: {{assignment_name}}',
    'بیچ {{batch_name}} کے لیے نیا اسائنمنٹ "{{assignment_name}}" پوسٹ کر دیا گیا ہے۔ آخری تاریخ: {{event_date}}۔',
    ARRAY['assignment_name', 'batch_name', 'event_date']
  ),
  (
    'assignment_graded',
    'Assignment Graded',
    'academic',
    ARRAY['in-app', 'email'],
    'Assignment Evaluated: {{assignment_name}}',
    'Dear {{student_name}}, your submission for "{{assignment_name}}" has been graded. Marks: {{result}}.',
    'اسائنمنٹ چیک ہو گیا: {{assignment_name}}',
    'محترم {{student_name}}، آپ کا اسائنمنٹ "{{assignment_name}}" چیک ہو چکا ہے۔ حاصل کردہ نمبر: {{result}}۔',
    ARRAY['student_name', 'assignment_name', 'result']
  ),
  (
    'quiz_published',
    'New Quiz Announced',
    'academic',
    ARRAY['in-app', 'whatsapp'],
    'New Quiz Scheduled: {{quiz_name}}',
    'A new quiz "{{quiz_name}}" is scheduled for {{batch_name}}. Please prepare according to syllabus.',
    'نیا کوئز شیڈول: {{quiz_name}}',
    'بیچ {{batch_name}} کے لیے نیا کوئز "{{quiz_name}}" شیڈول کیا گیا ہے۔',
    ARRAY['quiz_name', 'batch_name']
  ),
  (
    'result_published',
    'Official Result Published',
    'academic',
    ARRAY['in-app', 'email', 'whatsapp'],
    'Academic Result Published: {{course_name}}',
    'Official academic results for {{batch_name}} are now published. Check your student transcript portal.',
    'سرکاری نتیجہ جاری: {{course_name}}',
    'بیچ {{batch_name}} کے سرکاری نتائج جاری کر دیے گئے ہیں۔ اپنے سٹوڈنٹ پورٹل میں ٹرانسکرپٹ دیکھیں۔',
    ARRAY['course_name', 'batch_name']
  ),
  (
    'certificate_issued',
    'Certificate Issued',
    'certificate',
    ARRAY['in-app', 'email', 'whatsapp'],
    'Congratulations! Certificate Issued: {{certificate_serial}}',
    'Dear {{student_name}}, your official graduation certificate for {{course_name}} (Serial: {{certificate_serial}}) has been issued.',
    'مبارک ہو! سرٹیفکیٹ جاری: {{certificate_serial}}',
    'محترم {{student_name}}، {{course_name}} کے لیے آپ کا گریجویشن سرٹیفکیٹ (سیریل: {{certificate_serial}}) جاری کر دیا گیا ہے۔',
    ARRAY['student_name', 'course_name', 'certificate_serial']
  ),
  (
    'support_ticket_reply',
    'Support Ticket Reply',
    'support',
    ARRAY['in-app', 'email'],
    'Support Update: Ticket #{{support_ticket_id}}',
    'Staff has replied to your support request #{{support_ticket_id}}. Please visit the helpdesk console to view details.',
    'سپورٹ اپ ڈیٹ: ٹکٹ #{{support_ticket_id}}',
    'ہیلپ ڈیسک عملے نے آپ کے ٹکٹ #{{support_ticket_id}} کا جواب دیا ہے۔ تفصیلات دیکھنے کے لیے پورٹل وزٹ کریں۔',
    ARRAY['support_ticket_id']
  )
ON CONFLICT (code) DO NOTHING;

-- Seed Automation Rules
INSERT INTO automation_rules (event_name, label, category, is_enabled, channels, template_code)
VALUES
  ('on_admission_applied', 'Application Submitted Confirmation', 'admission', true, ARRAY['in-app', 'email'], 'admission_received'),
  ('on_admission_shortlisted', 'Candidate Shortlisted Notice', 'admission', true, ARRAY['in-app', 'email', 'whatsapp', 'sms'], 'admission_shortlisted'),
  ('on_student_absent', 'Daily Absent Notification', 'attendance', true, ARRAY['in-app', 'whatsapp'], 'attendance_absent'),
  ('on_attendance_low', 'Attendance Drops Below 75% Alert', 'attendance', true, ARRAY['in-app', 'whatsapp', 'email'], 'attendance_warning'),
  ('on_assignment_created', 'New Assignment Published', 'academic', true, ARRAY['in-app', 'whatsapp'], 'assignment_published'),
  ('on_assignment_graded', 'Assignment Graded Notification', 'academic', true, ARRAY['in-app', 'email'], 'assignment_graded'),
  ('on_quiz_created', 'New Quiz Announced', 'academic', true, ARRAY['in-app', 'whatsapp'], 'quiz_published'),
  ('on_result_published', 'Term Results Published', 'academic', true, ARRAY['in-app', 'whatsapp', 'email'], 'result_published'),
  ('on_certificate_issued', 'Certificate Issued Announcement', 'certificate', true, ARRAY['in-app', 'email', 'whatsapp'], 'certificate_issued'),
  ('on_support_reply', 'Helpdesk Reply Received', 'support', true, ARRAY['in-app', 'email'], 'support_ticket_reply')
ON CONFLICT (event_name) DO NOTHING;
