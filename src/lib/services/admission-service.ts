import { applications } from "@/lib/data/applications";
import { students } from "@/lib/data/students";
import type { Application, ApplicationStatus, Student } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const searchFields: (keyof Application)[] = ["studentName", "email", "phone", "cnic", "city", "applicationId"];

export function getApplications(params: QueryParams = {}): PaginatedResult<Application> {
  return queryItems(applications, { pageSize: 15, ...params }, searchFields);
}

export function getApplicationById(id: string): Application | undefined {
  return applications.find((a) => a.id === id || a.applicationId === id);
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string
): MutationResult<Application> {
  const index = applications.findIndex((a) => a.id === id);
  if (index === -1) return { success: false, error: "Application not found" };

  applications[index] = {
    ...applications[index],
    status,
    notes: notes ?? applications[index].notes,
    reviewedAt: new Date().toISOString(),
    reviewedBy: "Admin User",
  };

  return { success: true, data: applications[index] };
}

export function convertToStudent(
  applicationId: string,
  batchId: string
): MutationResult<Student> {
  const app = getApplicationById(applicationId);
  if (!app) return { success: false, error: "Application not found" };

  // Check if student already created
  const existing = students.find((s) => s.email.toLowerCase() === app.email.toLowerCase());
  if (existing) {
    return { success: false, error: "A student record already exists for this email address." };
  }

  const id = `student-${students.length + 1}`;
  const regNum = String(students.length + 1).padStart(4, "0");
  const coursePrefix = app.courseId.replace("course-", "C");

  const newStudent: Student = {
    id,
    registrationId: `MH-${coursePrefix}-2026-${regNum}`,
    name: app.studentName,
    email: app.email,
    phone: app.phone,
    avatar: `/images/students/student-${(students.length % 10) + 1}.jpg`,
    gender: app.gender,
    dateOfBirth: app.dateOfBirth,
    cnic: app.cnic,
    address: app.address,
    city: app.city,
    education: app.education,
    courseId: app.courseId,
    batchId: batchId || app.preferredBatchId || "batch-3",
    status: "active",
    enrolledAt: new Date().toISOString().split("T")[0],
    attendancePercentage: 100,
    gpa: 4.0,
    completedAssignments: 0,
    totalAssignments: 20,
  };

  students.unshift(newStudent);

  // Mark application as approved / enrolled
  updateApplicationStatus(app.id, "approved", `Enrolled as student ${newStudent.registrationId}`);

  return { success: true, data: newStudent };
}
