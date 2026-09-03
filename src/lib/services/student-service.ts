import { students } from "@/lib/data/students";
import type { Student } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

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
 * Create a new student. Inserts into Supabase if configured,
 * while updating in-memory cache for immediate UI responsiveness.
 */
export function createStudent(data: Omit<Student, "id" | "registrationId">): MutationResult<Student> {
  const id = `std-${Date.now()}`;
  const regNum = String(students.length + 1).padStart(4, "0");
  const coursePrefix = data.courseId.replace("course-", "C");
  const newStudent: Student = {
    ...data,
    id,
    registrationId: `MH-${coursePrefix}-2026-${regNum}`,
  };
  students.unshift(newStudent);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("students")
      .insert({
        id: newStudent.id,
        registration_id: newStudent.registrationId,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        cnic: newStudent.cnic,
        city: newStudent.city,
        course_id: newStudent.courseId,
        batch_id: newStudent.batchId,
        status: newStudent.status,
        attendance_percentage: newStudent.attendancePercentage,
        gpa: newStudent.gpa,
        enrolled_at: newStudent.enrolledAt,
      } as any)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase student insert error:", error);
      });
  }

  return { success: true, data: newStudent };
}

export function updateStudent(id: string, data: Partial<Student>): MutationResult<Student> {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return { success: false, error: "Student not found" };
  students[index] = { ...students[index], ...data };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    const updatePayload: Record<string, any> = {};
    if (data.name) updatePayload.name = data.name;
    if (data.email) updatePayload.email = data.email;
    if (data.phone) updatePayload.phone = data.phone;
    if (data.status) updatePayload.status = data.status;
    if (data.attendancePercentage !== undefined) updatePayload.attendance_percentage = data.attendancePercentage;
    if (data.gpa !== undefined) updatePayload.gpa = data.gpa;

    supabase
      .from("students")
      .update(updatePayload as any)
      .eq("id", id)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase student update error:", error);
      });
  }

  return { success: true, data: students[index] };
}

export function deleteStudent(id: string): MutationResult<null> {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return { success: false, error: "Student not found" };
  students.splice(index, 1);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("students")
      .delete()
      .eq("id", id)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase student delete error:", error);
      });
  }

  return { success: true };
}
