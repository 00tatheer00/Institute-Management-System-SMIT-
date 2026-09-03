-- =============================================================================
-- MOHSIN AND HUMA IT CENTER (MHIT) × SMIT PORTAL
-- Migration 004: Development & Testing Seed Data
-- =============================================================================

-- 1. Courses
INSERT INTO courses (id, code, name, slug, category, level, duration_weeks, description, is_published)
VALUES
  ('course-1', 'WMA-101', 'Web & Mobile Application Development', 'web-development', 'web-development', 'beginner', 24, 'Full-stack software engineering with React, Next.js, Node.js, and Supabase.', true),
  ('course-2', 'AI-201', 'Artificial Intelligence & Data Science', 'artificial-intelligence', 'artificial-intelligence', 'intermediate', 20, 'Machine learning, Python, neural networks, and computer vision.', true),
  ('course-3', 'GD-102', 'Graphic Design & UI/UX Experience', 'graphic-design', 'graphic-design', 'beginner', 16, 'Visual branding, Figma UI prototyping, typography, and Adobe Creative Suite.', true),
  ('course-4', 'CYB-301', 'Cyber Security & Network Defense', 'cyber-security', 'cyber-security', 'advanced', 24, 'Ethical hacking, penetration testing, firewall defenses, and digital forensics.', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Rooms
INSERT INTO rooms (id, name, capacity, room_type, floor, has_projector, has_ac, has_solar_backup, is_active)
VALUES
  ('room-1', 'Lab 1 - Turing Hall', 40, 'Computer Lab', 'Ground Floor', true, true, true, true),
  ('room-2', 'Lab 2 - Lovelace Suite', 40, 'Computer Lab', '1st Floor', true, true, true, true),
  ('room-3', 'Lab 3 - Hopper Studio', 35, 'Design Lab', '1st Floor', true, true, true, true),
  ('room-4', 'Auditorium - Al-Khwarizmi', 120, 'Lecture Hall', '2nd Floor', true, true, true, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Trainers
INSERT INTO trainers (id, name, email, phone, title, bio, specializations)
VALUES
  ('trainer-1', 'Ahmed Hassan', 'ahmed.hassan@mhit.edu.pk', '+92 300 1234567', 'Lead Technical Instructor', 'Over 8 years of production full stack web engineering experience.', ARRAY['React', 'Next.js', 'Node.js', 'PostgreSQL']),
  ('trainer-2', 'Zainab Fatima', 'zainab.fatima@mhit.edu.pk', '+92 321 9876543', 'Senior AI Engineer', 'Specialist in deep learning, PyTorch, and NLP models.', ARRAY['Python', 'Machine Learning', 'TensorFlow', 'Data Science'])
ON CONFLICT (id) DO NOTHING;

-- 4. Batches
INSERT INTO batches (id, name, course_id, trainer_id, room_id, campus, total_seats, enrolled_seats, status, start_date, end_date, schedule_days, start_time, end_time)
VALUES
  ('batch-1', 'WMA Batch 01 (Morning)', 'course-1', 'trainer-1', 'room-1', 'Main Campus', 40, 38, 'in-progress', '2026-01-15', '2026-07-15', ARRAY['Monday', 'Wednesday', 'Friday'], '09:00:00', '11:00:00'),
  ('batch-2', 'AI Batch 01 (Evening)', 'course-2', 'trainer-2', 'room-2', 'Main Campus', 35, 30, 'in-progress', '2026-02-01', '2026-07-31', ARRAY['Tuesday', 'Thursday', 'Saturday'], '17:00:00', '19:00:00')
ON CONFLICT (id) DO NOTHING;

-- 5. Sample Students
INSERT INTO students (id, registration_id, name, email, phone, cnic, city, course_id, batch_id, status, attendance_percentage, gpa)
VALUES
  ('std-001', 'MH-WD-2026-0001', 'Muhammad Khan', 'muhammad.khan@student.mhit.edu.pk', '+92 312 3456789', '42101-1234567-1', 'Karachi', 'course-1', 'batch-1', 'active', 92.50, 3.85),
  ('std-002', 'MH-WD-2026-0002', 'Mudassir Useit', 'mudassiruseit@gmail.com', '+92 333 7654321', '42101-9876543-3', 'Karachi', 'course-1', 'batch-1', 'active', 88.00, 3.70),
  ('std-003', 'MH-AI-2026-0003', 'Ayesha Siddiqua', 'ayesha.s@student.mhit.edu.pk', '+92 345 1122334', '42201-5566778-2', 'Karachi', 'course-2', 'batch-2', 'active', 96.00, 3.95)
ON CONFLICT (id) DO NOTHING;

-- 6. Sample Assignments
INSERT INTO assignments (id, batch_id, course_id, title, description, due_date, total_marks, status, created_by)
VALUES
  ('asg-1', 'batch-1', 'course-1', 'HTML & CSS Responsive Portfolio Site', 'Build and deploy a semantic HTML & CSS website for a school or business. Submit live deployed link.', '2026-09-15 23:59:59+05', 100, 'published', 'trainer-1'),
  ('asg-2', 'batch-1', 'course-1', 'JavaScript Interactive Task Tracker', 'Develop a DOM-driven todo dashboard with local storage persistence and responsive design.', '2026-09-30 23:59:59+05', 100, 'published', 'trainer-1')
ON CONFLICT (id) DO NOTHING;

-- 7. Sample Assignment Submissions
INSERT INTO assignment_submissions (id, assignment_id, student_id, deployed_url, github_url, notes, status, marks, feedback, graded_by)
VALUES
  ('sub-1', 'asg-1', 'std-001', 'https://muhammad-portfolio.vercel.app', 'https://github.com/mkhan/portfolio', 'Deployed via Vercel with responsive mobile menu.', 'graded', 95, 'Excellent semantic markup and clean CSS layout.', 'trainer-1'),
  ('sub-2', 'asg-1', 'std-002', 'https://eduvantage-academy.netlify.app', 'https://github.com/mudassir/eduvantage', 'EduVantage Academy & Online School topic website.', 'graded', 92, 'Solid responsive layout and clean typography.', 'trainer-1')
ON CONFLICT (id) DO NOTHING;

-- 8. Sample Certificates
INSERT INTO certificates (id, certificate_number, student_id, student_name, course_id, course_name, batch_id, issue_date, verification_hash, status, grade)
VALUES
  ('cert-1', 'MH-WD-2026-00124', 'std-001', 'Muhammad Khan', 'course-1', 'Web & Mobile Application Development', 'batch-1', '2026-08-15', 'a7f92b4c810d3e5f2a1b9c7d4e6f8a0b', 'issued', 'A+')
ON CONFLICT (id) DO NOTHING;

-- 9. Sample Published Student Projects
INSERT INTO student_projects (id, student_id, title, slug, description, category, tech_stack, github_url, live_url, status, is_published, is_featured)
VALUES
  ('prj-1', 'std-001', 'EduVantage Academy Portal', 'eduvantage-academy-portal', 'High-performance online school portal with live interactive timetable and student dashboard.', 'Full Stack Web', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'], 'https://github.com/mkhan/eduvantage', 'https://eduvantage-academy.vercel.app', 'published', true, true)
ON CONFLICT (id) DO NOTHING;
