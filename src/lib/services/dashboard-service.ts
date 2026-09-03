import { students } from "@/lib/data/students";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { applications } from "@/lib/data/applications";
import { classSessions } from "@/lib/data/misc";
import { trainers } from "@/lib/data/trainers";
import type { ChartDataItem } from "./types";

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  graduatedStudents: number;
  totalTrainers: number;
  totalCourses: number;
  activeBatches: number;
  pendingAdmissions: number;
  todaysClasses: number;
  avgAttendance: number;
}

export function getDashboardStats(): DashboardStats {
  const active = students.filter((s) => s.status === "active");
  const graduated = students.filter((s) => s.status === "graduated");
  const activeBatches = batches.filter((b) => b.status === "in-progress" || b.status === "enrolling");
  const pendingApps = applications.filter((a) => a.status === "pending" || a.status === "under-review");
  const todayClasses = classSessions.filter((c) => c.date === "2026-09-03");
  const avgAtt = active.length > 0 ? Math.round(active.reduce((sum, s) => sum + s.attendancePercentage, 0) / active.length) : 0;

  return {
    totalStudents: students.length,
    activeStudents: active.length,
    graduatedStudents: graduated.length,
    totalTrainers: trainers.length,
    totalCourses: courses.filter((c) => c.isActive).length,
    activeBatches: activeBatches.length,
    pendingAdmissions: pendingApps.length,
    todaysClasses: todayClasses.length,
    avgAttendance: avgAtt,
  };
}

export function getStudentsByCourseChart(): ChartDataItem[] {
  return courses
    .filter((c) => c.isActive)
    .map((course) => ({
      name: course.name.length > 15 ? course.name.slice(0, 15) + "…" : course.name,
      value: students.filter((s) => s.courseId === course.id).length,
      fullName: course.name,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function getEnrollmentTrendChart(): ChartDataItem[] {
  // Monthly enrollment data (simulated)
  return [
    { name: "Jan", value: 25, month: "January" },
    { name: "Feb", value: 32, month: "February" },
    { name: "Mar", value: 48, month: "March" },
    { name: "Apr", value: 38, month: "April" },
    { name: "May", value: 55, month: "May" },
    { name: "Jun", value: 42, month: "June" },
    { name: "Jul", value: 35, month: "July" },
    { name: "Aug", value: 60, month: "August" },
    { name: "Sep", value: 45, month: "September" },
  ];
}

export function getAttendanceTrendChart(): ChartDataItem[] {
  return [
    { name: "Week 1", value: 88, week: "Week 1" },
    { name: "Week 2", value: 85, week: "Week 2" },
    { name: "Week 3", value: 82, week: "Week 3" },
    { name: "Week 4", value: 87, week: "Week 4" },
    { name: "Week 5", value: 90, week: "Week 5" },
    { name: "Week 6", value: 84, week: "Week 6" },
    { name: "Week 7", value: 86, week: "Week 7" },
    { name: "Week 8", value: 89, week: "Week 8" },
  ];
}

export function getAdmissionsFunnelChart(): ChartDataItem[] {
  return [
    { name: "Submitted", value: applications.length },
    { name: "Under Review", value: applications.filter((a) => a.status === "under-review").length },
    { name: "Approved", value: applications.filter((a) => a.status === "approved").length },
    { name: "Enrolled", value: students.filter((s) => s.enrolledAt.startsWith("2026")).length },
  ];
}

export function getStudentStatusDistribution(): ChartDataItem[] {
  const statuses = ["active", "graduated", "dropped", "suspended", "inactive"] as const;
  return statuses.map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: students.filter((s) => s.status === status).length,
  })).filter((d) => d.value > 0);
}
