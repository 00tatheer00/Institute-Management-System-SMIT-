import { initialAttendanceRecords } from "@/lib/data/attendance";
import { students } from "@/lib/data/students";
import { batches } from "@/lib/data/batches";
import { courses } from "@/lib/data/courses";
import type { AttendanceRecord, AttendanceStatus, Student } from "@/lib/types";
import type { MutationResult } from "./types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

// In-memory store (mirrors future Supabase table `attendance`)
const attendanceStore: AttendanceRecord[] = [...initialAttendanceRecords];

export interface BatchStudentAttendanceRow {
  student: Student;
  record?: AttendanceRecord;
  currentStatus: AttendanceStatus;
  checkInTime?: string;
  remarks?: string;
}

export interface StudentAttendanceSummary {
  studentId: string;
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  lateClasses: number;
  excusedClasses: number;
  percentage: number;
  history: AttendanceRecord[];
}

export interface BatchAttendanceSummary {
  batchId: string;
  batchName: string;
  totalStudents: number;
  totalSessionsRecorded: number;
  averageAttendanceRate: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
}

export interface LowAttendanceAlert {
  student: Student;
  batchName: string;
  courseName: string;
  attendancePercentage: number;
  classesAttended: number;
  totalClasses: number;
  severity: "critical" | "warning";
}

/**
 * Fetch enrolled students for a batch with their attendance record for a specific class
 */
export function getBatchClassAttendance(batchId: string, classId: string): BatchStudentAttendanceRow[] {
  const enrolledStudents = students.filter((s) => s.batchId === batchId && s.status === "active");
  const existingRecords = attendanceStore.filter((r) => r.classId === classId);
  const recordMap = new Map<string, AttendanceRecord>(existingRecords.map((r) => [r.studentId, r]));

  return enrolledStudents.map((student) => {
    const record = recordMap.get(student.id);
    return {
      student,
      record,
      currentStatus: record ? record.status : "present", // default to present for quick marking
      checkInTime: record?.checkInTime,
      remarks: record?.remarks,
    };
  });
}

/**
 * Bulk mark/save attendance for a class
 */
export function markClassAttendance(
  classId: string,
  batchId: string,
  date: string,
  records: Array<{
    studentId: string;
    status: AttendanceStatus;
    checkInTime?: string;
    remarks?: string;
  }>,
  markedBy: string
): MutationResult<AttendanceRecord[]> {
  const savedRecords: AttendanceRecord[] = [];
  const now = new Date().toISOString();

  records.forEach((rec) => {
    const existingIndex = attendanceStore.findIndex(
      (r) => r.classId === classId && r.studentId === rec.studentId
    );

    if (existingIndex >= 0) {
      // Update existing record
      const existing = attendanceStore[existingIndex];
      const updated: AttendanceRecord = {
        ...existing,
        status: rec.status,
        checkInTime: rec.checkInTime || (rec.status === "present" || rec.status === "late" ? "09:00" : undefined),
        remarks: rec.remarks,
        updatedBy: markedBy,
        updatedAt: now,
        originalStatus: existing.status,
      };
      attendanceStore[existingIndex] = updated;
      savedRecords.push(updated);
    } else {
      // Insert new record
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        classId,
        studentId: rec.studentId,
        batchId,
        date,
        status: rec.status,
        checkInTime: rec.checkInTime || (rec.status === "present" || rec.status === "late" ? "09:00" : undefined),
        remarks: rec.remarks,
        markedBy,
        markedAt: now,
      };
      attendanceStore.push(newRecord);
      savedRecords.push(newRecord);
    }
  });

  // If Supabase is configured, upsert into Supabase attendance_records table
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    const rows = savedRecords.map((r) => ({
      id: r.id,
      class_session_id: r.classId,
      batch_id: r.batchId,
      student_id: r.studentId,
      attendance_date: r.date,
      status: r.status,
      marked_by: r.markedBy,
    }));

    supabase
      .from("attendance_records")
      .upsert(rows as any)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase attendance sync error:", error);
      });
  }

  return { success: true, data: savedRecords };
}

/**
 * Edit a single attendance record with audit tracking
 */
export function updateAttendanceRecord(
  recordId: string,
  newStatus: AttendanceStatus,
  remarks: string | undefined,
  updatedBy: string
): MutationResult<AttendanceRecord> {
  const index = attendanceStore.findIndex((r) => r.id === recordId);
  if (index === -1) return { success: false, error: "Attendance record not found" };

  const prev = attendanceStore[index];
  const updated: AttendanceRecord = {
    ...prev,
    originalStatus: prev.originalStatus || prev.status,
    status: newStatus,
    remarks: remarks !== undefined ? remarks : prev.remarks,
    updatedBy,
    updatedAt: new Date().toISOString(),
  };

  attendanceStore[index] = updated;
  return { success: true, data: updated };
}

/**
 * Calculate attendance statistics for an individual student
 */
export function getStudentAttendanceSummary(studentId: string): StudentAttendanceSummary {
  const student = students.find((s) => s.id === studentId);
  const studentRecords = attendanceStore.filter((r) => r.studentId === studentId);

  // If no detailed records exist yet for this student, synthesize baseline from student.attendancePercentage
  if (studentRecords.length === 0) {
    const basePct = student?.attendancePercentage ?? 85;
    const totalClasses = 24;
    const attendedClasses = Math.round((basePct / 100) * totalClasses);
    const absentClasses = totalClasses - attendedClasses;

    return {
      studentId,
      totalClasses,
      attendedClasses,
      absentClasses,
      lateClasses: 2,
      excusedClasses: 1,
      percentage: basePct,
      history: [],
    };
  }

  const attendedClasses = studentRecords.filter((r) => r.status === "present" || r.status === "late").length;
  const absentClasses = studentRecords.filter((r) => r.status === "absent").length;
  const lateClasses = studentRecords.filter((r) => r.status === "late").length;
  const excusedClasses = studentRecords.filter((r) => r.status === "excused").length;
  const totalClasses = studentRecords.length;
  const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

  return {
    studentId,
    totalClasses,
    attendedClasses,
    absentClasses,
    lateClasses,
    excusedClasses,
    percentage,
    history: studentRecords.sort((a, b) => b.date.localeCompare(a.date)),
  };
}

/**
 * Calculate batch-level attendance summary
 */
export function getBatchAttendanceSummary(batchId: string): BatchAttendanceSummary {
  const batch = batches.find((b) => b.id === batchId);
  const batchRecords = attendanceStore.filter((r) => r.batchId === batchId);
  const batchStudents = students.filter((s) => s.batchId === batchId);

  const presentCount = batchRecords.filter((r) => r.status === "present").length;
  const lateCount = batchRecords.filter((r) => r.status === "late").length;
  const absentCount = batchRecords.filter((r) => r.status === "absent").length;
  const excusedCount = batchRecords.filter((r) => r.status === "excused").length;

  const totalEffective = presentCount + lateCount + absentCount;
  const averageAttendanceRate = totalEffective > 0
    ? Math.round(((presentCount + lateCount) / totalEffective) * 100)
    : 88;

  return {
    batchId,
    batchName: batch?.name || batchId,
    totalStudents: batchStudents.length,
    totalSessionsRecorded: new Set(batchRecords.map((r) => r.classId)).size,
    averageAttendanceRate,
    presentCount,
    absentCount,
    lateCount,
    excusedCount,
  };
}

/**
 * Return list of students below threshold (< 75%)
 */
export function getLowAttendanceStudents(threshold = 75): LowAttendanceAlert[] {
  return students
    .filter((s) => s.status === "active" && s.attendancePercentage < threshold)
    .map((student) => {
      const batch = batches.find((b) => b.id === student.batchId);
      const course = courses.find((c) => c.id === student.courseId);
      const totalClasses = 30;
      const attended = Math.round((student.attendancePercentage / 100) * totalClasses);

      return {
        student,
        batchName: batch?.name || student.batchId,
        courseName: course?.name || student.courseId,
        attendancePercentage: student.attendancePercentage,
        classesAttended: attended,
        totalClasses,
        severity: (student.attendancePercentage < 65 ? "critical" : "warning") as "critical" | "warning",
      };
    })
    .sort((a, b) => a.attendancePercentage - b.attendancePercentage);
}
