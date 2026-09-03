# Mohsin and Huma IT Center × SMIT Portal
## Administrator Operational Handover Guide

Welcome to the **Mohsin and Huma IT Center × SMIT Portal**. This guide is designed for non-technical institute directors, coordinators, and administrative officers to operate and manage the platform on a day-to-day basis without developer intervention.

---

## 1. System Access & Authentication
- **URL**: `https://mhit.edu.pk/login` (or staging portal domain).
- **Credentials**: Log in using your designated institute email and password.
- **Role Scoping**: Ensure your user profile has the `admin` or `super-admin` role assigned.
- **Security**: Never share credentials. Password resets can be initiated via the `/forgot-password` page.

---

## 2. Daily Administrative Workflows

### A. Admissions & Student Onboarding
1. Navigate to **Admissions** (`/admin/admissions`).
2. Review new applications by program (Web Dev, AI/Python, Cloud Native, Graphic Design).
3. Update application status: `Applied` $\to$ `Reviewing` $\to$ `Shortlisted` $\to$ `Enrolled`.
4. When enrolled, the system automatically creates the formal Student Record and assigns a Registration ID (e.g. `MH-2026-00101`).

### B. Student Management
1. Navigate to **Students** (`/admin/students`).
2. Search students by name, registration ID, CNIC, or email.
3. Filter by batch, course, or enrollment status (`Active`, `Graduated`, `On-Leave`, `Suspended`).
4. Click on any student profile to inspect attendance percentage, assignment grades, uploaded documents, and support tickets.

### C. Courses, Batches & Classroom Scheduling
1. **Courses** (`/admin/courses`): Define program details, duration, prerequisite criteria, and curriculum syllabus modules.
2. **Batches** (`/admin/batches`): Create cohort sections (e.g. `WD-01`, `AI-02`), assign the primary trainer, set room allocations, and specify class days and hours.
3. **Rooms** (`/admin/rooms`): Inspect lab capacities, equipment (PCs, projectors, generators), and resolve scheduling conflicts.

---

## 3. Academic Oversight & Council Governance

### A. Attendance Tracking & Absentee Warnings
1. Navigate to **Attendance** (`/admin/attendance`).
2. Review batch-by-batch attendance records.
3. **Mandatory 75% Rule**: The system automatically calculates attendance percentages. If a student falls below 75%, an automated warning is dispatched via In-App and WhatsApp.

### B. Assignments, Quizzes & Gradebook
1. **Assignments** (`/admin/assignments`): Inspect submission completion rates and overdue work.
2. **Quizzes** (`/admin/quizzes`): View quiz scores and class performance distribution.
3. **Results** (`/admin/results`): Verify official final grades (`A+`, `A`, `B`, `C`, `F`) and release official academic transcripts.

### C. Certificate Issuance & Revocation
1. Navigate to **Certificates** (`/admin/certificates`).
2. The system checks eligibility:
   - Attendance $\ge 75\%$
   - Assignment completion $\ge 80\%$
   - Non-failing cumulative grade
3. Click **Issue Certificate** to generate a cryptographic serial (e.g. `MH-WD-2026-00001`).
4. **Revocation**: If a student is found in breach of academic integrity, an administrator can change status to **Revoked**. The public verification page will immediately display an official revocation warning.

---

## 4. Communication & Omnichannel Broadcasts

### A. Broadcasting Announcements
1. Navigate to **Communications** (`/admin/communications`).
2. Select target audience: *All Students*, *By Course*, *By Batch*, *Single Student*, or *Trainers*.
3. Choose channels: In-App, WhatsApp, Email, SMS.
4. Pick a standardized bilingual template or write custom content. Placeholders like `{{student_name}}` and `{{course_name}}` are automatically replaced.
5. Click **Dispatch Broadcast**.

### B. Template Management
1. Navigate to **Templates** (`/admin/communications/templates`).
2. Review and edit English and Urdu versions of messages for admissions, attendance warnings, grading notices, and event invites.

### C. Delivery Audit Logs
1. Navigate to **Delivery Logs** (`/admin/communications/logs`).
2. Inspect delivery status (`delivered`, `sent`, `failed`).
3. Click **Retry** on any failed message to retransmit safely.

---

## 5. Bulk Data Imports (Excel & CSV)
1. Navigate to **Data Import** (`/admin/import`).
2. Download sample CSV/Excel templates for *Students*, *Trainers*, *Batches*, or *Attendance*.
3. Upload your file.
4. Map columns using the intelligent header matcher.
5. Review duplicate detection and validation report before final confirmation.

---

## 6. Financials, Grants & Reporting
1. **Finance** (`/admin/finance`): Track educational grant allocations, equipment maintenance, lab expenses, and budget utilization.
2. **Reports** (`/admin/reports`): Generate and export student enrollment summaries, attendance averages, and graduation rosters in CSV format.
