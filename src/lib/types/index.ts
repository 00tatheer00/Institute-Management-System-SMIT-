// ============================================================
// CORE ENTITY TYPES — Mohsin and Huma IT Center × SMIT
// ============================================================

// --- Enums & Constants ---

export type UserRole = "admin" | "super-admin" | "trainer" | "student" | "staff";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseCategory =
  | "web-development"
  | "app-development"
  | "artificial-intelligence"
  | "digital-marketing"
  | "graphic-design"
  | "video-editing"
  | "ui-ux"
  | "cyber-security"
  | "networking"
  | "freelancing"
  | "data-science"
  | "cloud-computing";

export type BatchStatus =
  | "upcoming"
  | "enrolling"
  | "in-progress"
  | "completed"
  | "cancelled";

export type StudentStatus =
  | "active"
  | "inactive"
  | "graduated"
  | "dropped"
  | "suspended";

export type ApplicationStatus =
  | "pending"
  | "under-review"
  | "approved"
  | "rejected"
  | "waitlisted";

export type ClassStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "rescheduled";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type AssignmentState = "draft" | "published" | "closed" | "archived";

export type SubmissionStatus =
  | "not-submitted"
  | "submitted"
  | "late"
  | "graded"
  | "returned";

// Legacy alias for compatibility
export type AssignmentStatus =
  | "pending"
  | "submitted"
  | "graded"
  | "late"
  | "missing"
  | SubmissionStatus;

export type QuizStatus =
  | "draft"
  | "published"
  | "open"
  | "closed"
  | "archived"
  | "upcoming"
  | "active"
  | "completed"
  | "cancelled";

export type QuizQuestionType = "multiple-choice" | "true-false" | "short-answer";

export type QuizAttemptStatus = "in-progress" | "submitted" | "graded";

export type AssessmentType = "quiz" | "assignment" | "exam" | "final";

export type MaterialType = "pdf" | "document" | "link" | "video" | "presentation";

export type MaterialVisibility = "published" | "draft" | "archived";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type CertificateStatus = "issued" | "revoked" | "pending";

export type AnnouncementCategory =
  | "general"
  | "academic"
  | "event"
  | "admission"
  | "schedule";

export type NotificationType = "info" | "success" | "warning" | "alert";

export type Gender = "male" | "female" | "other";

// --- Core Entities ---

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: string;
  durationWeeks: number;
  totalClasses: number;
  image: string;
  icon: string;
  skills: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  curriculum: CurriculumModule[];
  faqs: FAQ[];
  isFeatured: boolean;
  isActive: boolean;
  studentCount: number;
  batchCount: number;
}

export interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  order: number;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  title: string;
  bio: string;
  expertise: string[];
  courseIds: string[];
  experience: string;
  education: string;
  certifications: string[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    youtube?: string;
  };
  isActive: boolean;
  joinedAt: string;
  totalStudents: number;
  rating: number;
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  trainerId: string;
  startDate: string;
  endDate: string;
  schedule: ClassSchedule;
  room: string;
  campus: string;
  totalSeats: number;
  enrolledSeats: number;
  status: BatchStatus;
  isActive: boolean;
}

export interface ClassSchedule {
  days: string[];
  startTime: string;
  endTime: string;
}

export interface Student {
  id: string;
  registrationId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  gender: Gender;
  dateOfBirth: string;
  cnic: string;
  address: string;
  city: string;
  education: string;
  courseId: string;
  batchId: string;
  status: StudentStatus;
  enrolledAt: string;
  joinedAt?: string;
  attendancePercentage: number;
  gpa: number;
  completedAssignments: number;
  totalAssignments: number;
}

export interface Application {
  id: string;
  applicationId: string;
  studentName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  cnic: string;
  address: string;
  city: string;
  education: string;
  courseId: string;
  preferredBatchId?: string;
  motivation: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface ClassSession {
  id: string;
  batchId: string;
  courseId: string;
  trainerId: string;
  roomId?: string;
  room: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  moduleId: string;
  topics: string[];
  notes?: string;
  status?: ClassStatus;
  isCompleted: boolean;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  batchId: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  remarks?: string;
  markedBy: string;
  markedAt: string;
  updatedBy?: string;
  updatedAt?: string;
  originalStatus?: AttendanceStatus;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  courseId: string;
  batchId: string;
  trainerId: string;
  moduleId: string;
  issueDate?: string;
  dueDate: string;
  totalMarks: number;
  submissionType?: "file" | "link" | "text" | "all";
  publishedAt: string;
  status?: AssignmentState;
  isPublished: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  status: SubmissionStatus | AssignmentStatus;
  submissionText?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  obtainedMarks?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  type: QuizQuestionType;
  options?: string[];
  correctAnswer: string; // Isolated from student-facing payloads
  marks: number;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  courseId: string;
  batchId: string;
  trainerId: string;
  moduleId: string;
  totalMarks: number;
  totalQuestions: number;
  passingMarks?: number;
  duration: number; // minutes
  date: string;
  availableFrom?: string;
  availableUntil?: string;
  status: QuizStatus;
  questions?: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  startedAt: string;
  submittedAt?: string;
  score?: number;
  totalMarks: number;
  percentage?: number;
  answers?: Record<string, string>; // questionId -> selected answer
  status: QuizAttemptStatus;
}

export interface QuizResult {
  id: string;
  quizId: string;
  studentId: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  completedAt: string;
}

export interface UnifiedResult {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName?: string;
  batchId: string;
  batchName?: string;
  assessmentId: string;
  assessmentTitle: string;
  assessmentType: AssessmentType;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  date: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  courseId: string;
  batchId?: string; // empty means all batches in this course
  moduleId?: string;
  trainerId: string;
  trainerName?: string;
  type: MaterialType;
  url: string;
  fileName?: string;
  fileSize?: string;
  visibility: MaterialVisibility;
  publishedAt: string;
}

export interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  totalHours: number;
  completedHours: number;
  isCompleted: boolean;
}

export interface AtRiskIndicator {
  studentId: string;
  isAtRisk: boolean;
  reasons: string[];
  severity: "high" | "medium" | "low";
}

export interface AcademicProgress {
  studentId: string;
  courseId: string;
  batchId: string;
  overallProgressPercentage: number;
  attendanceRate: number;
  assignmentCompletionRate: number;
  quizAverageScore: number;
  currentGpa: number;
  letterGrade: string;
  modules: ModuleProgress[];
  atRisk?: AtRiskIndicator;
}

export interface GradeDefinition {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gpaPoint: number;
  description: string;
  isPassing: boolean;
}

// Legacy Result model for backward compatibility
export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  batchId: string;
  assignmentAverage: number;
  quizAverage: number;
  projectScore: number;
  finalScore: number;
  grade: string;
  status: "pass" | "fail" | "pending";
}

export interface Certificate {
  id: string;
  certificateId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  issueDate: string;
  grade: string;
  status: CertificateStatus;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  category: string;
  image: string;
  isRegistrationOpen: boolean;
  maxAttendees?: number;
  registeredCount: number;
  status: EventStatus;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "workshops" | "classes" | "events" | "graduation" | "projects" | "campus";
  date: string;
}

export type ProjectStatus = "idea" | "in-progress" | "completed" | "published";

export interface StudentProject {
  id: string;
  slug?: string;
  title: string;
  description: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  technologies: string[];
  category: string;
  image: string;
  screenshots?: string[];
  githubUrl?: string;
  liveUrl?: string;
  moduleName?: string;
  status?: ProjectStatus;
  isPublished?: boolean;
  isFeatured?: boolean;
  completedAt: string;
}

export interface SuccessStory {
  id: string;
  studentName: string;
  avatar: string;
  courseId: string;
  courseName: string;
  batchName: string;
  achievement: string;
  quote: string;
  currentRole?: string;
  company?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  isImportant: boolean;
  publishedAt: string;
  publishedBy: string;
  expiresAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  floor: string;
  building: string;
  equipment: string[];
  hasProjector: boolean;
  hasAC: boolean;
  hasWhiteboard: boolean;
  isAvailable: boolean;
  status: "available" | "occupied" | "maintenance" | "reserved";
  notes?: string;
}

export type RoomType =
  | "classroom"
  | "computer-lab"
  | "meeting-room"
  | "training-lab"
  | "office"
  | "auditorium"
  | "other";

// --- Staff ---

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: StaffRole;
  department: string;
  designation: string;
  joinedAt: string;
  status: "active" | "inactive" | "on-leave";
  address?: string;
  cnic?: string;
}

export type StaffRole =
  | "coordinator"
  | "lab-assistant"
  | "office-manager"
  | "receptionist"
  | "it-support"
  | "librarian"
  | "accountant"
  | "security"
  | "other";

// --- Dashboard Types ---

export interface DashboardStat {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// --- Navigation Types ---

export interface NavItem {
  titleKey: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  badge?: string | number;
}

export interface NavGroup {
  titleKey: string;
  items: NavItem[];
}

// --- RBAC Foundation ---

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "import"
  | "export"
  | "manage"
  | "approve"
  | "assign"
  | "publish";

export type PermissionResource =
  | "students"
  | "admissions"
  | "courses"
  | "batches"
  | "trainers"
  | "staff"
  | "classes"
  | "rooms"
  | "attendance"
  | "assignments"
  | "quizzes"
  | "results"
  | "certificates"
  | "events"
  | "announcements"
  | "gallery"
  | "reports"
  | "settings"
  | "imports"
  | "documents"
  | "finance"
  | "roles"
  | "career";

export interface Permission {
  action: PermissionAction;
  resource: PermissionResource;
}

/**
 * Default permissions per role. In Phase 3+, these will be stored in the database
 * and configurable per-user.
 */
export const defaultPermissions: Record<UserRole, Permission[]> = {
  "super-admin": [], // all permissions — checked via role, not list
  admin: [
    { action: "view", resource: "students" },
    { action: "create", resource: "students" },
    { action: "edit", resource: "students" },
    { action: "delete", resource: "students" },
    { action: "import", resource: "students" },
    { action: "export", resource: "students" },
    { action: "view", resource: "admissions" },
    { action: "manage", resource: "admissions" },
    { action: "approve", resource: "admissions" },
    { action: "view", resource: "courses" },
    { action: "create", resource: "courses" },
    { action: "edit", resource: "courses" },
    { action: "view", resource: "batches" },
    { action: "create", resource: "batches" },
    { action: "edit", resource: "batches" },
    { action: "manage", resource: "batches" },
    { action: "view", resource: "trainers" },
    { action: "create", resource: "trainers" },
    { action: "edit", resource: "trainers" },
    { action: "view", resource: "staff" },
    { action: "create", resource: "staff" },
    { action: "edit", resource: "staff" },
    { action: "view", resource: "classes" },
    { action: "create", resource: "classes" },
    { action: "view", resource: "rooms" },
    { action: "manage", resource: "rooms" },
    { action: "view", resource: "reports" },
    { action: "view", resource: "imports" },
    { action: "import", resource: "imports" },
    { action: "manage", resource: "settings" },
  ],
  trainer: [
    { action: "view", resource: "students" },
    { action: "view", resource: "courses" },
    { action: "view", resource: "batches" },
    { action: "view", resource: "classes" },
    { action: "create", resource: "classes" },
    { action: "manage", resource: "attendance" },
    { action: "manage", resource: "assignments" },
    { action: "manage", resource: "quizzes" },
    { action: "view", resource: "results" },
  ],
  student: [
    { action: "view", resource: "courses" },
    { action: "view", resource: "classes" },
    { action: "view", resource: "attendance" },
    { action: "view", resource: "assignments" },
    { action: "view", resource: "quizzes" },
    { action: "view", resource: "results" },
    { action: "view", resource: "certificates" },
  ],
  staff: [
    { action: "view", resource: "students" },
    { action: "edit", resource: "students" },
    { action: "view", resource: "admissions" },
    { action: "manage", resource: "admissions" },
    { action: "view", resource: "courses" },
    { action: "view", resource: "batches" },
    { action: "view", resource: "classes" },
    { action: "view", resource: "attendance" },
    { action: "view", resource: "rooms" },
    { action: "manage", resource: "rooms" },
    { action: "view", resource: "reports" },
  ],
};

export function hasPermission(
  role: UserRole,
  action: PermissionAction,
  resource: PermissionResource
): boolean {
  if (role === "super-admin") return true;
  return defaultPermissions[role].some(
    (p) => p.action === action && p.resource === resource
  );
}

// --- Audit Event ---

export type AuditAction =
  | "created"
  | "updated"
  | "deleted"
  | "imported"
  | "exported"
  | "status_changed"
  | "approved"
  | "rejected"
  | "assigned"
  | "archived";

export interface AuditEvent {
  id: string;
  action: AuditAction;
  resource: PermissionResource;
  resourceId: string;
  resourceName: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  details?: Record<string, unknown>;
  previousValue?: string;
  newValue?: string;
}

// ============================================================
// PHASE 4 — STUDENT EXPERIENCE, CERTIFICATES & OPERATIONS TYPES
// ============================================================

// --- Documents ---
export type DocumentType =
  | "cnic"
  | "b-form"
  | "matric"
  | "intermediate"
  | "degree"
  | "admission-slip"
  | "certificate"
  | "other";

export type DocumentStatus = "pending" | "verified" | "rejected" | "archived";

export interface StudentDocument {
  id: string;
  studentId: string;
  studentName: string;
  courseName?: string;
  batchName?: string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  fileSize?: string;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

// --- Support & Helpdesk ---
export type SupportCategory =
  | "academic"
  | "attendance"
  | "technical"
  | "certificate"
  | "admission"
  | "general";

export type SupportPriority = "low" | "medium" | "high" | "urgent";

export type SupportStatus =
  | "open"
  | "in-progress"
  | "waiting-student"
  | "resolved"
  | "closed";

export interface SupportReply {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: "student" | "admin" | "trainer";
  message: string;
  createdAt: string;
  attachmentUrl?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  courseName?: string;
  batchName?: string;
  category: SupportCategory;
  subject: string;
  description: string;
  priority: SupportPriority;
  status: SupportStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  replies: SupportReply[];
}

// --- Student Feedback ---
export type FeedbackCategory =
  | "course"
  | "trainer"
  | "class"
  | "facilities"
  | "management";

export interface StudentFeedback {
  id: string;
  studentId: string;
  studentName: string;
  isAnonymous: boolean;
  category: FeedbackCategory;
  targetId: string; // courseId or trainerId
  targetName: string;
  rating: number; // 1 to 5 stars
  comment: string;
  createdAt: string;
  status?: "published" | "pending" | "hidden";
}

// --- Student Notifications ---
export type NotificationCategory =
  | "academic"
  | "announcement"
  | "assignment"
  | "quiz"
  | "result"
  | "attendance"
  | "certificate"
  | "system"
  | "general"
  | "admission"
  | "support";

export interface StudentNotification {
  id: string;
  studentId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

// --- Certificate Eligibility ---
export interface CertificateEligibility {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  attendanceRate: number;
  attendanceRequired: number; // usually 75%
  isAttendanceMet: boolean;
  assignmentCompletionRate: number;
  assignmentRequired: number; // usually 80%
  isAssignmentMet: boolean;
  quizzesPassedRate: number;
  isQuizzesMet: boolean;
  gpa: number;
  grade: string;
  isEligible: boolean;
  unmetCriteria: string[];
}

// --- Logical Storage Bucket Names for Future Supabase Storage ---
export type StorageBucketName =
  | "profile-images"
  | "student-documents"
  | "course-materials"
  | "project-files"
  | "certificates"
  | "gallery"
  | "event-images"
  | "support-attachments"
  | "receipts-finance";

// ============================================================
// PHASE 5 — ENTERPRISE MANAGEMENT, ANALYTICS & SYSTEM TYPES
// ============================================================

// --- Finance & Funding ---
export type FundingStatus =
  | "planned"
  | "received"
  | "partially-received"
  | "completed"
  | "cancelled";

export type FundingSourceType =
  | "government"
  | "corporate-csr"
  | "philanthropic"
  | "individual";

export interface FundingSource {
  id: string;
  name: string;
  type: FundingSourceType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  totalAllocated: number;
}

export interface FundingGrant {
  id: string;
  grantNumber: string;
  sourceId: string;
  sourceName: string;
  amount: number;
  receivedDate: string;
  purpose: string;
  reference: string;
  status: FundingStatus;
  notes?: string;
}

export type ExpenseCategory =
  | "equipment"
  | "utilities"
  | "maintenance"
  | "events"
  | "training"
  | "operations"
  | "software"
  | "other";

export type ExpenseStatus = "approved" | "pending" | "paid" | "reimbursed";

export interface ExpenseRecord {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  fundingSourceId?: string;
  fundingSourceName?: string;
  reference: string;
  description: string;
  status: ExpenseStatus;
  recordedBy: string;
  receiptUrl?: string;
}

export interface FinancialSummary {
  totalFunding: number;
  totalExpenses: number;
  remainingBalance: number;
  monthlyExpenses: { month: string; amount: number }[];
  expensesByCategory: { category: ExpenseCategory; label: string; amount: number; percentage: number }[];
}

// --- Career & Placement Foundation ---
export type InternshipStatus =
  | "not-started"
  | "applied"
  | "interviewing"
  | "placed"
  | "completed";

export type EmploymentStatus =
  | "looking"
  | "internship"
  | "employed"
  | "freelancing"
  | "further-study";

export interface StudentCareerProfile {
  studentId: string;
  studentName: string;
  courseName: string;
  batchName: string;
  skills: string[];
  portfolioReadinessScore: number; // 0-100
  internshipStatus: InternshipStatus;
  employmentStatus: EmploymentStatus;
  targetRoles: string[];
  cvStatus: "draft" | "submitted" | "verified";
  cvFileUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  placedCompany?: string;
  placedRole?: string;
  notes?: string;
  updatedAt: string;
}

export type PlacementType = "internship" | "full-time" | "freelance-contract";

export interface PlacementRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseName: string;
  companyName: string;
  roleTitle: string;
  placementType: PlacementType;
  startDate: string;
  monthlyStipend?: number;
  isVerified: boolean;
}

// --- Data Health & Diagnostics ---
export type DataHealthSeverity = "critical" | "warning" | "info";

export interface DataHealthIssue {
  id: string;
  entity: string;
  entityId: string;
  title: string;
  description: string;
  remediationNote: string;
}

export interface DataHealthCheck {
  id: string;
  name: string;
  category: "relationships" | "unassigned" | "duplicates" | "integrity";
  description: string;
  severity: DataHealthSeverity;
  affectedCount: number;
  issues: DataHealthIssue[];
}

export interface DataHealthSummary {
  overallStatus: "healthy" | "attention-needed" | "critical";
  checksRun: number;
  totalIssues: number;
  criticalIssues: number;
  lastScannedAt: string;
}

// --- Communication Architecture & Provider Contracts ---
export type NotificationChannel = "in-app" | "email" | "sms" | "whatsapp";

export interface NotificationDispatchJob {
  id: string;
  recipientId: string;
  recipientRole: UserRole;
  channel: NotificationChannel;
  title: string;
  body: string;
  status: "queued" | "dispatched" | "delivered" | "failed";
  providerName: string;
  dispatchedAt?: string;
  metadata?: Record<string, unknown>;
}

// --- AI-Ready Architecture & Boundary Contracts ---
export type AiContextScope =
  | "student-learning"
  | "trainer-copilot"
  | "admin-analytics"
  | "career-advisory";

export interface AiContextRequest {
  scope: AiContextScope;
  requesterRole: UserRole;
  requesterId: string;
  query: string;
  filters?: Record<string, unknown>;
}

export interface AiDataBlock {
  blockType: string;
  title: string;
  contentSummary: string;
  safeData: Record<string, unknown>;
}

export interface AiSanitizedContext {
  contextId: string;
  scope: AiContextScope;
  requesterRole: UserRole;
  generatedAt: string;
  dataBlocks: AiDataBlock[];
  redactedPiiFields: string[];
  complianceCertified: boolean;
}

// --- Centralized Academic Policies ---
export interface AcademicPolicies {
  minAttendancePercentage: number;
  minAssignmentCompletionRate: number;
  minQuizAverageScore: number;
  passingGpaThreshold: number;
  latePenaltyPerDayPercentage: number;
  maxLateDaysAllowed: number;
  maxQuizAttempts: number;
  autoIssueCertificates: boolean;
}

// ============================================================
// PHASE 8 — COMMUNICATION, AUTOMATION & PROVIDER CONTRACTS
// ============================================================

export interface NotificationTemplate {
  id: string;
  code: string;
  name: string;
  category: "admission" | "academic" | "attendance" | "certificate" | "event" | "support" | "general";
  channels: NotificationChannel[];
  titleEn: string;
  bodyEn: string;
  titleUr: string;
  bodyUr: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationLog {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientContact: string;
  recipientRole: UserRole;
  channel: NotificationChannel;
  templateCode?: string;
  title: string;
  body: string;
  status: "queued" | "sending" | "sent" | "delivered" | "failed" | "cancelled";
  provider: string;
  idempotencyKey?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  deliveredAt?: string;
  createdAt: string;
}

export interface NotificationPreference {
  userId: string;
  inApp: boolean;
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
  academicAlerts: boolean;
  eventReminders: boolean;
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  eventName: string;
  label: string;
  category: string;
  isEnabled: boolean;
  channels: NotificationChannel[];
  templateCode: string;
  reminderOffsetHours?: number;
}

export interface ProviderConfig {
  channel: NotificationChannel;
  name: string;
  isConfigured: boolean;
  isEnabled: boolean;
  providerId: string;
  lastTestStatus?: "success" | "failed";
  lastTestAt?: string;
  webhookUrl?: string;
}
