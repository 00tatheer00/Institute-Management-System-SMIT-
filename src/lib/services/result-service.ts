import { initialUnifiedResults } from "@/lib/data/results";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import type { UnifiedResult, GradeDefinition } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const resultStore: UnifiedResult[] = [...initialUnifiedResults];
const searchFields: (keyof UnifiedResult)[] = ["studentName", "assessmentTitle", "grade", "remarks"];

// ============================================================
// CENTRALIZED GRADING MATRIX
// ============================================================
export const GRADING_TIERS: GradeDefinition[] = [
  { grade: "A+", minPercentage: 90, maxPercentage: 100, gpaPoint: 4.0, description: "Outstanding", isPassing: true },
  { grade: "A", minPercentage: 80, maxPercentage: 89.99, gpaPoint: 3.7, description: "Excellent", isPassing: true },
  { grade: "B+", minPercentage: 75, maxPercentage: 79.99, gpaPoint: 3.3, description: "Very Good", isPassing: true },
  { grade: "B", minPercentage: 70, maxPercentage: 74.99, gpaPoint: 3.0, description: "Good", isPassing: true },
  { grade: "C", minPercentage: 60, maxPercentage: 69.99, gpaPoint: 2.5, description: "Satisfactory", isPassing: true },
  { grade: "D", minPercentage: 50, maxPercentage: 59.99, gpaPoint: 2.0, description: "Pass", isPassing: true },
  { grade: "F", minPercentage: 0, maxPercentage: 49.99, gpaPoint: 0.0, description: "Fail", isPassing: false },
];

export function calculateGrade(percentage: number): GradeDefinition {
  const rounded = Math.min(100, Math.max(0, percentage));
  const found = GRADING_TIERS.find(
    (tier) => rounded >= tier.minPercentage && rounded <= tier.maxPercentage
  );
  return found || GRADING_TIERS[GRADING_TIERS.length - 1];
}

// ============================================================
// GRADEBOOK QUERIES
// ============================================================

export function getResults(params: QueryParams = {}): PaginatedResult<UnifiedResult> {
  return queryItems(resultStore, { pageSize: 15, ...params }, searchFields);
}

export function getStudentResults(studentId: string): UnifiedResult[] {
  return resultStore
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getBatchResults(batchId: string): UnifiedResult[] {
  return resultStore.filter((r) => r.batchId === batchId);
}

export function recordAssignmentResult(data: {
  studentId: string;
  studentName?: string;
  courseId: string;
  batchId: string;
  assignmentId: string;
  assignmentTitle: string;
  obtainedMarks: number;
  totalMarks: number;
  remarks?: string;
}): MutationResult<UnifiedResult> {
  const percentage = Math.round((data.obtainedMarks / data.totalMarks) * 100);
  const gradeDef = calculateGrade(percentage);
  const course = courses.find((c) => c.id === data.courseId);
  const batch = batches.find((b) => b.id === data.batchId);

  const existingIndex = resultStore.findIndex(
    (r) => r.studentId === data.studentId && r.assessmentId === data.assignmentId
  );

  const resultRecord: UnifiedResult = {
    id: existingIndex >= 0 ? resultStore[existingIndex].id : `res-${Date.now()}`,
    studentId: data.studentId,
    studentName: data.studentName || "Student",
    courseId: data.courseId,
    courseName: course?.name || data.courseId,
    batchId: data.batchId,
    batchName: batch?.name || data.batchId,
    assessmentId: data.assignmentId,
    assessmentTitle: data.assignmentTitle,
    assessmentType: "assignment",
    obtainedMarks: data.obtainedMarks,
    totalMarks: data.totalMarks,
    percentage,
    grade: gradeDef.grade,
    remarks: data.remarks || gradeDef.description,
    date: new Date().toISOString().split("T")[0],
  };

  if (existingIndex >= 0) {
    resultStore[existingIndex] = resultRecord;
  } else {
    resultStore.unshift(resultRecord);
  }

  return { success: true, data: resultRecord };
}

export function recordQuizResult(data: {
  studentId: string;
  studentName?: string;
  courseId: string;
  batchId: string;
  quizId: string;
  quizTitle: string;
  obtainedMarks: number;
  totalMarks: number;
  remarks?: string;
}): MutationResult<UnifiedResult> {
  const percentage = Math.round((data.obtainedMarks / data.totalMarks) * 100);
  const gradeDef = calculateGrade(percentage);
  const course = courses.find((c) => c.id === data.courseId);
  const batch = batches.find((b) => b.id === data.batchId);

  const existingIndex = resultStore.findIndex(
    (r) => r.studentId === data.studentId && r.assessmentId === data.quizId
  );

  const resultRecord: UnifiedResult = {
    id: existingIndex >= 0 ? resultStore[existingIndex].id : `res-${Date.now()}`,
    studentId: data.studentId,
    studentName: data.studentName || "Student",
    courseId: data.courseId,
    courseName: course?.name || data.courseId,
    batchId: data.batchId,
    batchName: batch?.name || data.batchId,
    assessmentId: data.quizId,
    assessmentTitle: data.quizTitle,
    assessmentType: "quiz",
    obtainedMarks: data.obtainedMarks,
    totalMarks: data.totalMarks,
    percentage,
    grade: gradeDef.grade,
    remarks: data.remarks || gradeDef.description,
    date: new Date().toISOString().split("T")[0],
  };

  if (existingIndex >= 0) {
    resultStore[existingIndex] = resultRecord;
  } else {
    resultStore.unshift(resultRecord);
  }

  return { success: true, data: resultRecord };
}

export function getBatchGradeMetrics(batchId: string) {
  const batchRecords = resultStore.filter((r) => r.batchId === batchId);
  if (batchRecords.length === 0) {
    return {
      totalAssessments: 0,
      avgPercentage: 82,
      highestScore: 98,
      lowestScore: 44,
      passRate: 91,
    };
  }

  const total = batchRecords.length;
  const avgPercentage = Math.round(batchRecords.reduce((sum, r) => sum + r.percentage, 0) / total);
  const scores = batchRecords.map((r) => r.percentage);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  const passingCount = batchRecords.filter((r) => r.grade !== "F").length;
  const passRate = Math.round((passingCount / total) * 100);

  return {
    totalAssessments: total,
    avgPercentage,
    highestScore,
    lowestScore,
    passRate,
  };
}
