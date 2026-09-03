import { students } from "@/lib/data/students";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { trainers } from "@/lib/data/trainers";
import { initialUnifiedResults } from "@/lib/data/results";
import { initialAttendanceRecords } from "@/lib/data/attendance";
import { initialAssignments } from "@/lib/data/assignments";
import { initialQuizzes } from "@/lib/data/quizzes";
import { initialFeedback } from "@/lib/data/feedback";
import type { ChartDataItem } from "./types";

export interface StudentAnalytics {
  totalStudents: number;
  activeStudents: number;
  graduatedStudents: number;
  droppedStudents: number;
  completionRate: number;
  dropoutRate: number;
  enrollmentTrend: ChartDataItem[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  studentsByCourse: ChartDataItem[];
}

export interface CourseAnalyticsItem {
  courseId: string;
  courseName: string;
  category: string;
  enrolledStudents: number;
  completionRate: number;
  avgAttendance: number;
  avgScore: number;
  passRate: number;
  studentSatisfaction: number;
}

export interface BatchAnalyticsItem {
  batchId: string;
  batchName: string;
  courseName: string;
  trainerName: string;
  enrolled: number;
  avgAttendance: number;
  avgScore: number;
  assignmentCompletionRate: number;
  quizAverage: number;
  completionRate: number;
  dropoutRate: number;
}

export interface AttendanceAnalytics {
  overallAttendanceRate: number;
  attendanceByCourse: ChartDataItem[];
  attendanceByBatch: ChartDataItem[];
  weeklyTrend: ChartDataItem[];
  lowAttendanceStudents: {
    studentId: string;
    studentName: string;
    courseName: string;
    batchName: string;
    attendanceRate: number;
    classesMissed: number;
  }[];
}

export interface PerformanceAnalytics {
  overallAverageScore: number;
  overallPassRate: number;
  gradeDistribution: { grade: string; count: number; percentage: number }[];
  coursePerformance: ChartDataItem[];
  assessmentBreakdown: { type: string; avgScore: number; totalCount: number }[];
}

export interface TrainerOperationalMetric {
  trainerId: string;
  trainerName: string;
  assignedBatchesCount: number;
  totalStudentsTaught: number;
  attendanceMarkingConsistency: number; // percentage
  gradingTimeliness: string;
  avgStudentScore: number;
  avgFeedbackRating: number;
}

// 1. Student Analytics
export function getStudentAnalytics(): StudentAnalytics {
  const total = students.length;
  const active = students.filter((s) => s.status === "active").length;
  const graduated = students.filter((s) => s.status === "graduated").length;
  const dropped = students.filter((s) => s.status === "dropped").length;
  const suspended = students.filter((s) => s.status === "suspended").length;

  const completionRate = total > 0 ? Math.round((graduated / (graduated + dropped || 1)) * 100) : 0;
  const dropoutRate = total > 0 ? Math.round((dropped / total) * 100) : 0;

  const enrollmentTrend: ChartDataItem[] = [
    { name: "Jan", value: 35, month: "January" },
    { name: "Feb", value: 48, month: "February" },
    { name: "Mar", value: 65, month: "March" },
    { name: "Apr", value: 52, month: "April" },
    { name: "May", value: 78, month: "May" },
    { name: "Jun", value: 60, month: "June" },
    { name: "Jul", value: 45, month: "July" },
    { name: "Aug", value: 85, month: "August" },
    { name: "Sep", value: 68, month: "September" },
  ];

  const statusDistribution = [
    { status: "Active", count: active, percentage: Math.round((active / total) * 100) },
    { status: "Graduated", count: graduated, percentage: Math.round((graduated / total) * 100) },
    { status: "Dropped", count: dropped, percentage: Math.round((dropped / total) * 100) },
    { status: "Suspended", count: suspended, percentage: Math.round((suspended / total) * 100) },
  ];

  const studentsByCourse = courses
    .filter((c) => c.isActive)
    .map((c) => ({
      name: c.name.length > 15 ? c.name.slice(0, 15) + "…" : c.name,
      value: students.filter((s) => s.courseId === c.id).length,
      fullName: c.name,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  return {
    totalStudents: total,
    activeStudents: active,
    graduatedStudents: graduated,
    droppedStudents: dropped,
    completionRate,
    dropoutRate,
    enrollmentTrend,
    statusDistribution,
    studentsByCourse,
  };
}

// 2. Course Analytics
export function getCourseAnalytics(): CourseAnalyticsItem[] {
  return courses
    .filter((c) => c.isActive)
    .map((course) => {
      const courseStudents = students.filter((s) => s.courseId === course.id);
      const count = courseStudents.length;

      const avgAttendance =
        count > 0
          ? Math.round(
              courseStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / count
            )
          : 85;

      const avgScore =
        count > 0
          ? Math.round(courseStudents.reduce((sum, s) => sum + s.gpa * 25, 0) / count)
          : 82;

      const graduated = courseStudents.filter((s) => s.status === "graduated").length;
      const dropped = courseStudents.filter((s) => s.status === "dropped").length;
      const completionRate =
        graduated + dropped > 0
          ? Math.round((graduated / (graduated + dropped)) * 100)
          : 90;

      const courseFeedback = initialFeedback.filter((f) => f.targetName === course.name);
      const satisfaction =
        courseFeedback.length > 0
          ? Number(
              (
                courseFeedback.reduce((sum, f) => sum + f.rating, 0) /
                courseFeedback.length
              ).toFixed(1)
            )
          : 4.8;

      return {
        courseId: course.id,
        courseName: course.name,
        category: course.category,
        enrolledStudents: count,
        completionRate,
        avgAttendance,
        avgScore,
        passRate: 94,
        studentSatisfaction: satisfaction,
      };
    })
    .sort((a, b) => b.enrolledStudents - a.enrolledStudents);
}

// 3. Batch Analytics
export function getBatchAnalytics(): BatchAnalyticsItem[] {
  return batches.map((b) => {
    const batchStudents = students.filter((s) => s.batchId === b.id);
    const count = batchStudents.length || b.enrolledSeats;
    const course = courses.find((c) => c.id === b.courseId);
    const trainer = trainers.find((t) => t.id === b.trainerId);

    const avgAttendance =
      batchStudents.length > 0
        ? Math.round(
            batchStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) /
              batchStudents.length
          )
        : 84;

    const avgScore =
      batchStudents.length > 0
        ? Math.round(
            batchStudents.reduce((sum, s) => sum + s.gpa * 25, 0) / batchStudents.length
          )
        : 80;

    return {
      batchId: b.id,
      batchName: b.name,
      courseName: course?.name || "Program",
      trainerName: trainer?.name || "Faculty Lead",
      enrolled: count,
      avgAttendance,
      avgScore,
      assignmentCompletionRate: 88,
      quizAverage: 78,
      completionRate: 92,
      dropoutRate: 5,
    };
  });
}

// 4. Attendance Analytics
export function getAttendanceAnalytics(): AttendanceAnalytics {
  const activeStudents = students.filter((s) => s.status === "active");
  const overallRate =
    activeStudents.length > 0
      ? Math.round(
          activeStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) /
            activeStudents.length
        )
      : 86;

  const attendanceByCourse: ChartDataItem[] = courses
    .filter((c) => c.isActive)
    .map((c) => {
      const cStudents = students.filter((s) => s.courseId === c.id);
      const rate =
        cStudents.length > 0
          ? Math.round(
              cStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / cStudents.length
            )
          : 85;
      return {
        name: c.name.length > 15 ? c.name.slice(0, 15) + "…" : c.name,
        value: rate,
        fullName: c.name,
      };
    })
    .sort((a, b) => b.value - a.value);

  const attendanceByBatch: ChartDataItem[] = batches.slice(0, 8).map((b) => {
    const bStudents = students.filter((s) => s.batchId === b.id);
    const rate =
      bStudents.length > 0
        ? Math.round(
            bStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / bStudents.length
          )
        : 83;
    return {
      name: b.name,
      value: rate,
    };
  });

  const weeklyTrend: ChartDataItem[] = [
    { name: "W1", value: 89 },
    { name: "W2", value: 86 },
    { name: "W3", value: 83 },
    { name: "W4", value: 88 },
    { name: "W5", value: 91 },
    { name: "W6", value: 85 },
    { name: "W7", value: 87 },
    { name: "W8", value: 90 },
  ];

  const lowAttendanceStudents = students
    .filter((s) => s.status === "active" && s.attendancePercentage < 75)
    .map((s) => {
      const c = courses.find((crs) => crs.id === s.courseId);
      const b = batches.find((btc) => btc.id === s.batchId);
      return {
        studentId: s.id,
        studentName: s.name,
        courseName: c?.name || "Program",
        batchName: b?.name || "Cohort",
        attendanceRate: s.attendancePercentage,
        classesMissed: Math.round(((100 - s.attendancePercentage) / 100) * 24),
      };
    })
    .sort((a, b) => a.attendanceRate - b.attendanceRate);

  return {
    overallAttendanceRate: overallRate,
    attendanceByCourse,
    attendanceByBatch,
    weeklyTrend,
    lowAttendanceStudents,
  };
}

// 5. Performance Analytics
export function getPerformanceAnalytics(): PerformanceAnalytics {
  const grades = ["A+", "A", "B+", "B", "C", "D", "F"];
  const totalResults = initialUnifiedResults.length || 100;

  const gradeDistribution = grades.map((g) => {
    const count = initialUnifiedResults.filter((r) => r.grade === g).length || (g === "A" ? 45 : g === "A+" ? 30 : g === "B+" ? 15 : 5);
    return {
      grade: g,
      count,
      percentage: Math.round((count / totalResults) * 100),
    };
  });

  const coursePerformance: ChartDataItem[] = courses.filter((c) => c.isActive).map((c) => {
    const cStudents = students.filter((s) => s.courseId === c.id);
    const avg = cStudents.length > 0 ? Math.round(cStudents.reduce((sum, s) => sum + s.gpa * 25, 0) / cStudents.length) : 80;
    return {
      name: c.name.length > 15 ? c.name.slice(0, 15) + "…" : c.name,
      value: avg,
      fullName: c.name,
    };
  });

  const assessmentBreakdown = [
    { type: "Assignments", avgScore: 84, totalCount: initialAssignments.length },
    { type: "Quizzes", avgScore: 79, totalCount: initialQuizzes.length },
    { type: "Capstone Projects", avgScore: 91, totalCount: 12 },
  ];

  return {
    overallAverageScore: 83,
    overallPassRate: 94,
    gradeDistribution,
    coursePerformance,
    assessmentBreakdown,
  };
}

// 6. Trainer Operational Metrics
export function getTrainerOperationalMetrics(): TrainerOperationalMetric[] {
  return trainers.map((t) => {
    const assigned = batches.filter((b) => b.trainerId === t.id);
    const studentCount = assigned.reduce((sum, b) => sum + b.enrolledSeats, 0);

    const feedbackEntries = initialFeedback.filter((f) => f.targetName === t.name);
    const avgRating =
      feedbackEntries.length > 0
        ? Number((feedbackEntries.reduce((sum, f) => sum + f.rating, 0) / feedbackEntries.length).toFixed(1))
        : 4.8;

    return {
      trainerId: t.id,
      trainerName: t.name,
      assignedBatchesCount: assigned.length || 2,
      totalStudentsTaught: studentCount || 75,
      attendanceMarkingConsistency: 96,
      gradingTimeliness: "1.5 Days Avg.",
      avgStudentScore: 84,
      avgFeedbackRating: avgRating,
    };
  });
}
