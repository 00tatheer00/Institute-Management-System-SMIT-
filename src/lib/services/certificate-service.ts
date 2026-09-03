import type {
  Certificate,
  CertificateEligibility,
  CertificateStatus,
} from "@/lib/types";
import { certificates as initialCertificates } from "@/lib/data/misc";
import { getStudentById } from "@/lib/data/students";
import { getCourseById } from "@/lib/data/courses";
import { getBatchById } from "@/lib/data/batches";
import { getStudentAttendanceSummary } from "@/lib/services/attendance-service";
import { getStudentAcademicProgress } from "@/lib/services/academic-progress-service";
import { calculateGrade } from "@/lib/services/result-service";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { triggerCertificateIssuedEvent } from "./automation-service";

// In-memory certificate ledger
const certificateStore: Certificate[] = [...initialCertificates];

const certSearchFields: (keyof Certificate)[] = [
  "certificateId",
  "studentName",
  "courseName",
  "batchName",
  "grade",
];

export function getCertificates(params: QueryParams = {}): PaginatedResult<Certificate> {
  return queryItems(certificateStore, { pageSize: 15, ...params }, certSearchFields);
}

export function getCertificateById(id: string): Certificate | undefined {
  return certificateStore.find((c) => c.id === id || c.certificateId === id);
}

export function getStudentCertificates(studentId: string): Certificate[] {
  return certificateStore.filter((c) => c.studentId === studentId);
}

/**
 * Public Certificate Verification
 * STRICT DATA PRIVACY: Returns sanitized, authentic certificate details only.
 * NO CNIC, phone, email, address, internal notes, or financial data are exposed.
 */
export interface PublicVerifiedCertificate {
  isValid: boolean;
  certificateId: string;
  studentName: string;
  courseName: string;
  batchName: string;
  institute: string;
  issueDate: string;
  grade: string;
  status: CertificateStatus;
}

export function verifyCertificate(certificateId: string): PublicVerifiedCertificate | null {
  const cert = certificateStore.find(
    (c) => c.certificateId.trim().toLowerCase() === certificateId.trim().toLowerCase()
  );

  if (!cert || cert.status !== "issued") {
    return null;
  }

  return {
    isValid: true,
    certificateId: cert.certificateId,
    studentName: cert.studentName,
    courseName: cert.courseName,
    batchName: cert.batchName,
    institute: "Mohsin and Huma IT Center × SMIT",
    issueDate: cert.issueDate,
    grade: cert.grade,
    status: cert.status,
  };
}

/**
 * Configurable Certificate Eligibility Engine
 * Requirements:
 * 1. Attendance >= 75%
 * 2. Assignment completion >= 80%
 * 3. Overall cumulative grade != 'F'
 */
export function checkCertificateEligibility(studentId: string): CertificateEligibility {
  const student = getStudentById(studentId) || {
    id: studentId,
    name: "Student",
    courseId: "course-1",
    batchId: "batch-1",
    attendancePercentage: 88,
  };

  const course = getCourseById(student.courseId);
  const batch = getBatchById(student.batchId);
  const attendance = getStudentAttendanceSummary(studentId);
  const progress = getStudentAcademicProgress(studentId);

  const ATTENDANCE_MIN = 75;
  const ASSIGNMENT_MIN = 80;

  const isAttendanceMet = attendance.percentage >= ATTENDANCE_MIN;
  const isAssignmentMet = progress.assignmentCompletionRate >= ASSIGNMENT_MIN;
  const isQuizzesMet = progress.quizAverageScore >= 60;
  const isGradePassing = progress.overallProgressPercentage >= 50;

  const unmetCriteria: string[] = [];
  if (!isAttendanceMet) {
    unmetCriteria.push(
      `Attendance is ${attendance.percentage}%, which is below the mandatory ${ATTENDANCE_MIN}% threshold.`
    );
  }
  if (!isAssignmentMet) {
    unmetCriteria.push(
      `Coursework completion is ${progress.assignmentCompletionRate}%, requiring at least ${ASSIGNMENT_MIN}%.`
    );
  }
  if (!isQuizzesMet) {
    unmetCriteria.push("Quiz average score is below the 60% competency threshold.");
  }

  const isEligible = isAttendanceMet && isAssignmentMet && isQuizzesMet && isGradePassing;
  const gradeDef = calculateGrade(progress.overallProgressPercentage);

  return {
    studentId,
    studentName: student.name,
    courseId: student.courseId,
    courseName: course?.name || "Professional Certification",
    batchId: student.batchId,
    batchName: batch?.name || "Cohort",
    attendanceRate: attendance.percentage,
    attendanceRequired: ATTENDANCE_MIN,
    isAttendanceMet,
    assignmentCompletionRate: progress.assignmentCompletionRate,
    assignmentRequired: ASSIGNMENT_MIN,
    isAssignmentMet,
    quizzesPassedRate: progress.quizAverageScore,
    isQuizzesMet,
    gpa: gradeDef.gpaPoint,
    grade: gradeDef.grade,
    isEligible,
    unmetCriteria,
  };
}

export function issueCertificate(data: {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  grade: string;
}): Certificate {
  const seq = String(certificateStore.length + 1).padStart(5, "0");
  const code = data.courseName.includes("App") ? "AD" : data.courseName.includes("AI") ? "AI" : "WD";
  const certId = `MH-${code}-2026-${seq}`;

  const newCert: Certificate = {
    id: `cert-${Date.now()}`,
    certificateId: certId,
    studentId: data.studentId,
    studentName: data.studentName,
    courseId: data.courseId,
    courseName: data.courseName,
    batchId: data.batchId,
    batchName: data.batchName,
    issueDate: new Date().toISOString().split("T")[0],
    grade: data.grade,
    status: "issued",
  };

  certificateStore.unshift(newCert);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("certificates")
      .insert({
        id: newCert.id,
        certificate_number: newCert.certificateId,
        student_id: newCert.studentId,
        student_name: newCert.studentName,
        course_id: newCert.courseId,
        course_name: newCert.courseName,
        batch_id: newCert.batchId,
        issue_date: newCert.issueDate,
        verification_hash: `${newCert.certificateId}-${Date.now().toString(16)}`,
        status: newCert.status as any,
        grade: newCert.grade,
      } as any)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase certificate insert error:", error);
      });
  }

  // Automated notification trigger
  const student = getStudentById(newCert.studentId);
  triggerCertificateIssuedEvent({
    studentId: newCert.studentId,
    studentName: newCert.studentName,
    studentEmail: student?.email,
    studentPhone: student?.phone,
    courseName: newCert.courseName,
    certificateNumber: newCert.certificateId,
  }).catch((e) => console.error("Certificate notification trigger error:", e));

  return newCert;
}
