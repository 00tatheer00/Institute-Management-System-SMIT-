import { initialSubmissions } from "@/lib/data/submissions";
import { initialAssignments } from "@/lib/data/assignments";
import { students } from "@/lib/data/students";
import type { AssignmentSubmission } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";
import { recordAssignmentResult } from "./result-service";

const submissionStore: AssignmentSubmission[] = [...initialSubmissions];

export interface AssignmentSubmissionStats {
  totalEnrolled: number;
  submittedCount: number;
  gradedCount: number;
  pendingCount: number;
  lateCount: number;
  averageScore: number;
}

const subSearchFields: (keyof AssignmentSubmission)[] = ["submissionText", "fileName", "feedback"];

export function getSubmissions(
  assignmentId: string,
  params: QueryParams = {}
): PaginatedResult<AssignmentSubmission> {
  const filtered = submissionStore.filter((s) => s.assignmentId === assignmentId);
  return queryItems(filtered, { pageSize: 15, ...params }, subSearchFields);
}

export function getSubmissionById(id: string): AssignmentSubmission | undefined {
  return submissionStore.find((s) => s.id === id);
}

export function getStudentSubmission(
  assignmentId: string,
  studentId: string
): AssignmentSubmission | undefined {
  return submissionStore.find(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId
  );
}

export function submitAssignment(
  assignmentId: string,
  studentId: string,
  data: {
    submissionText?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
  }
): MutationResult<AssignmentSubmission> {
  const assignment = initialAssignments.find((a) => a.id === assignmentId);
  const now = new Date();
  const isLate = assignment && assignment.dueDate ? new Date(assignment.dueDate) < now : false;

  const existingIndex = submissionStore.findIndex(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId
  );

  if (existingIndex >= 0) {
    const updated: AssignmentSubmission = {
      ...submissionStore[existingIndex],
      ...data,
      submittedAt: now.toISOString(),
      status: isLate ? "late" : "submitted",
    };
    submissionStore[existingIndex] = updated;
    return { success: true, data: updated };
  }

  const newSubmission: AssignmentSubmission = {
    id: `sub-${Date.now()}`,
    assignmentId,
    studentId,
    submittedAt: now.toISOString(),
    status: isLate ? "late" : "submitted",
    ...data,
  };

  submissionStore.unshift(newSubmission);
  return { success: true, data: newSubmission };
}

export function gradeSubmission(
  submissionId: string,
  marks: number,
  feedback: string | undefined,
  gradedBy: string
): MutationResult<AssignmentSubmission> {
  const index = submissionStore.findIndex((s) => s.id === submissionId);
  if (index === -1) return { success: false, error: "Submission not found" };

  const sub = submissionStore[index];
  const assignment = initialAssignments.find((a) => a.id === sub.assignmentId);

  if (assignment && (marks < 0 || marks > assignment.totalMarks)) {
    return {
      success: false,
      error: `Marks must be between 0 and ${assignment.totalMarks}`,
    };
  }

  const updated: AssignmentSubmission = {
    ...sub,
    status: "graded",
    obtainedMarks: marks,
    feedback,
    gradedBy,
    gradedAt: new Date().toISOString(),
  };

  submissionStore[index] = updated;

  // Sync to centralized result-service
  if (assignment) {
    const student = students.find((st) => st.id === sub.studentId);
    recordAssignmentResult({
      studentId: sub.studentId,
      studentName: student?.name,
      courseId: assignment.courseId,
      batchId: assignment.batchId,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      obtainedMarks: marks,
      totalMarks: assignment.totalMarks,
      remarks: feedback,
    });
  }

  return { success: true, data: updated };
}

export function getAssignmentStats(assignmentId: string): AssignmentSubmissionStats {
  const assignment = initialAssignments.find((a) => a.id === assignmentId);
  const enrolledStudents = assignment
    ? students.filter((s) => s.batchId === assignment.batchId && s.status === "active")
    : [];

  const submissions = submissionStore.filter((s) => s.assignmentId === assignmentId);
  const submittedCount = submissions.length;
  const gradedList = submissions.filter((s) => s.status === "graded" && s.obtainedMarks != null);
  const gradedCount = gradedList.length;
  const pendingCount = submissions.filter((s) => s.status === "submitted" || s.status === "late").length;
  const lateCount = submissions.filter((s) => s.status === "late").length;

  const averageScore = gradedCount > 0
    ? Math.round(gradedList.reduce((sum, s) => sum + (s.obtainedMarks || 0), 0) / gradedCount)
    : 0;

  return {
    totalEnrolled: enrolledStudents.length || 35,
    submittedCount,
    gradedCount,
    pendingCount,
    lateCount,
    averageScore,
  };
}
