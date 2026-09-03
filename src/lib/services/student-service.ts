import { students } from "@/lib/data/students";
import type { Student } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const searchFields: (keyof Student)[] = ["name", "email", "registrationId", "phone", "city"];

export function getStudents(params: QueryParams = {}): PaginatedResult<Student> {
  return queryItems(students, { pageSize: 20, ...params }, searchFields);
}

export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

export function getStudentStats() {
  const total = students.length;
  const active = students.filter((s) => s.status === "active").length;
  const graduated = students.filter((s) => s.status === "graduated").length;
  const dropped = students.filter((s) => s.status === "dropped").length;
  const suspended = students.filter((s) => s.status === "suspended").length;
  const inactive = students.filter((s) => s.status === "inactive").length;
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendancePercentage, 0) / students.length)
    : 0;

  return { total, active, graduated, dropped, suspended, inactive, avgAttendance };
}

/**
 * Create a new student. In Phase 2 this adds to the in-memory array.
 * In Phase 3+, this becomes a Supabase insert.
 */
export function createStudent(data: Omit<Student, "id" | "registrationId">): MutationResult<Student> {
  const id = `student-${students.length + 1}`;
  const regNum = String(students.length + 1).padStart(4, "0");
  const coursePrefix = data.courseId.replace("course-", "C");
  const newStudent: Student = {
    ...data,
    id,
    registrationId: `MH-${coursePrefix}-2026-${regNum}`,
  };
  students.push(newStudent);
  return { success: true, data: newStudent };
}

export function updateStudent(id: string, data: Partial<Student>): MutationResult<Student> {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return { success: false, error: "Student not found" };
  students[index] = { ...students[index], ...data };
  return { success: true, data: students[index] };
}

export function deleteStudent(id: string): MutationResult<null> {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return { success: false, error: "Student not found" };
  students.splice(index, 1);
  return { success: true };
}
