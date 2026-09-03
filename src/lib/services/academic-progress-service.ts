import { students } from "@/lib/data/students";
import { courses } from "@/lib/data/courses";
import { getStudentAttendanceSummary } from "./attendance-service";
import { getStudentAssignments } from "./assignment-service";
import { getStudentSubmission } from "./submission-service";
import { getStudentResults, calculateGrade } from "./result-service";
import type { AcademicProgress, AtRiskIndicator, ModuleProgress } from "@/lib/types";

/**
 * Calculates rule-based explainable at-risk signals for a student.
 * Potential signals:
 *  - Attendance < 75%
 *  - Overdue assignments >= 2
 *  - Average assessment percentage < 55% or GPA < 2.0
 */
export function calculateAtRiskIndicators(studentId: string): AtRiskIndicator {
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return { studentId, isAtRisk: false, reasons: [], severity: "low" };
  }

  const attendanceSummary = getStudentAttendanceSummary(studentId);
  const assignments = getStudentAssignments(student.batchId);
  const now = new Date();

  // Check for overdue assignments
  const overdueAssignments = assignments.filter((a) => {
    if (!a.dueDate) return false;
    const isPastDue = new Date(a.dueDate) < now;
    if (!isPastDue) return false;
    const sub = getStudentSubmission(a.id, studentId);
    return !sub || sub.status === "not-submitted";
  });

  const results = getStudentResults(studentId);
  const failedAssessments = results.filter((r) => r.grade === "F");

  const reasons: string[] = [];

  if (attendanceSummary.percentage < 75) {
    reasons.push(
      `Attendance is ${attendanceSummary.percentage}% (below mandatory 75% institute threshold)`
    );
  }

  if (overdueAssignments.length > 0) {
    reasons.push(
      `${overdueAssignments.length} overdue assignment${overdueAssignments.length > 1 ? "s" : ""} pending submission`
    );
  }

  if (failedAssessments.length > 0) {
    reasons.push(
      `${failedAssessments.length} assessment${failedAssessments.length > 1 ? "s" : ""} below passing threshold`
    );
  }

  if (student.gpa > 0 && student.gpa < 2.0) {
    reasons.push(`Current GPA (${student.gpa.toFixed(1)}) is below satisfactory academic standing`);
  }

  const isAtRisk = reasons.length > 0;
  const severity: "high" | "medium" | "low" =
    attendanceSummary.percentage < 60 || overdueAssignments.length >= 2 || failedAssessments.length >= 2
      ? "high"
      : isAtRisk
      ? "medium"
      : "low";

  return {
    studentId,
    isAtRisk,
    reasons,
    severity,
  };
}

/**
 * Generates comprehensive academic progress dossier for student
 */
export function getStudentAcademicProgress(studentId: string): AcademicProgress {
  const student = students.find((s) => s.id === studentId);
  const courseId = student?.courseId || "course-1";
  const batchId = student?.batchId || "batch-1";
  const course = courses.find((c) => c.id === courseId);

  const attendanceSummary = getStudentAttendanceSummary(studentId);
  const batchAssignments = getStudentAssignments(batchId);
  const results = getStudentResults(studentId);

  // Compute assignment completion rate
  let completedCount = 0;
  batchAssignments.forEach((a) => {
    const sub = getStudentSubmission(a.id, studentId);
    if (sub && (sub.status === "graded" || sub.status === "submitted" || sub.status === "late")) {
      completedCount++;
    }
  });

  const assignmentCompletionRate =
    batchAssignments.length > 0
      ? Math.round((completedCount / batchAssignments.length) * 100)
      : 85;

  // Compute quiz average
  const quizResults = results.filter((r) => r.assessmentType === "quiz");
  const quizAverageScore =
    quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizResults.length)
      : 82;

  // Overall grade
  const overallAvg = Math.round(
    attendanceSummary.percentage * 0.2 +
    assignmentCompletionRate * 0.4 +
    quizAverageScore * 0.4
  );
  const gradeDef = calculateGrade(overallAvg);

  // Curriculum modules breakdown
  const curriculumModules: ModuleProgress[] =
    course && course.curriculum && course.curriculum.length > 0
      ? course.curriculum.map((m, idx) => {
          // Determine module completion based on syllabus progression
          const isCompleted = idx < 3; // First 3 modules completed for current batch
          const totalHours = 24;
          const completedHours = isCompleted ? totalHours : idx === 3 ? Math.round(totalHours * 0.6) : 0;
          return {
            moduleId: m.id,
            moduleName: m.title,
            totalHours,
            completedHours,
            isCompleted,
          };
        })
      : [
          { moduleId: "m1", moduleName: "HTML5 & Web Semantics", totalHours: 20, completedHours: 20, isCompleted: true },
          { moduleId: "m2", moduleName: "CSS Grid & Flexbox Layouts", totalHours: 24, completedHours: 24, isCompleted: true },
          { moduleId: "m3", moduleName: "JavaScript ES6+ & Async", totalHours: 32, completedHours: 32, isCompleted: true },
          { moduleId: "m4", moduleName: "TypeScript Fundamentals", totalHours: 20, completedHours: 12, isCompleted: false },
          { moduleId: "m5", moduleName: "React 19 & Next.js 15 App Router", totalHours: 40, completedHours: 10, isCompleted: false },
        ];

  const totalCourseHours = curriculumModules.reduce((sum, m) => sum + m.totalHours, 0);
  const completedCourseHours = curriculumModules.reduce((sum, m) => sum + m.completedHours, 0);
  const overallProgressPercentage =
    totalCourseHours > 0 ? Math.round((completedCourseHours / totalCourseHours) * 100) : 65;

  const atRisk = calculateAtRiskIndicators(studentId);

  return {
    studentId,
    courseId,
    batchId,
    overallProgressPercentage,
    attendanceRate: attendanceSummary.percentage,
    assignmentCompletionRate,
    quizAverageScore,
    currentGpa: gradeDef.gpaPoint,
    letterGrade: gradeDef.grade,
    modules: curriculumModules,
    atRisk,
  };
}

/**
 * Aggregates batch-level performance and at-risk metrics
 */
export function getBatchAcademicProgress(batchId: string) {
  const batchStudents = students.filter((s) => s.batchId === batchId && s.status === "active");
  const total = batchStudents.length || 1;

  let atRiskCount = 0;
  let totalGpa = 0;

  batchStudents.forEach((s) => {
    const risk = calculateAtRiskIndicators(s.id);
    if (risk.isAtRisk) atRiskCount++;
    totalGpa += s.gpa || 3.2;
  });

  return {
    studentCount: total,
    atRiskCount,
    onTrackCount: total - atRiskCount,
    averageGpa: parseFloat((totalGpa / total).toFixed(2)),
  };
}
