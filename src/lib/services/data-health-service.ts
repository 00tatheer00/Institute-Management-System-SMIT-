import { students } from "@/lib/data/students";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { initialClasses } from "@/lib/data/classes";
import { trainers } from "@/lib/data/trainers";
import { rooms } from "@/lib/data/rooms";
import type { DataHealthCheck, DataHealthSummary, DataHealthIssue } from "@/lib/types";

export function runDataHealthDiagnostics(): {
  summary: DataHealthSummary;
  checks: DataHealthCheck[];
} {
  const checks: DataHealthCheck[] = [];
  let totalIssues = 0;
  let criticalIssues = 0;

  // 1. Check Students without valid Batch
  const batchIds = new Set(batches.map((b) => b.id));
  const orphanedBatchStudents: DataHealthIssue[] = [];
  for (const s of students) {
    if (!s.batchId || !batchIds.has(s.batchId)) {
      orphanedBatchStudents.push({
        id: `orph-btc-${s.id}`,
        entity: "Student",
        entityId: s.id,
        title: `${s.name} (${s.registrationId})`,
        description: `Student is not mapped to an existing active cohort/batch (batchId: ${s.batchId || "null"}).`,
        remediationNote: "Assign student to an active batch via Student Management.",
      });
    }
  }

  checks.push({
    id: "check-students-batch",
    name: "Students Cohort Linkage",
    category: "unassigned",
    description: "Verifies every student record is bound to a valid cohort batch.",
    severity: orphanedBatchStudents.length > 0 ? "critical" : "info",
    affectedCount: orphanedBatchStudents.length,
    issues: orphanedBatchStudents,
  });

  // 2. Check Students without Course
  const courseIds = new Set(courses.map((c) => c.id));
  const orphanedCourseStudents: DataHealthIssue[] = [];
  for (const s of students) {
    if (!s.courseId || !courseIds.has(s.courseId)) {
      orphanedCourseStudents.push({
        id: `orph-crs-${s.id}`,
        entity: "Student",
        entityId: s.id,
        title: `${s.name} (${s.registrationId})`,
        description: `Student is not mapped to a registered program curriculum (courseId: ${s.courseId || "null"}).`,
        remediationNote: "Set valid courseId on student record.",
      });
    }
  }

  checks.push({
    id: "check-students-course",
    name: "Students Program Linkage",
    category: "relationships",
    description: "Verifies student enrollments resolve to valid course definitions.",
    severity: orphanedCourseStudents.length > 0 ? "critical" : "info",
    affectedCount: orphanedCourseStudents.length,
    issues: orphanedCourseStudents,
  });

  // 3. Check Batches without Trainer
  const trainerIds = new Set(trainers.map((t) => t.id));
  const unassignedBatches: DataHealthIssue[] = [];
  for (const b of batches) {
    if (!b.trainerId || !trainerIds.has(b.trainerId)) {
      unassignedBatches.push({
        id: `unassigned-btc-${b.id}`,
        entity: "Batch",
        entityId: b.id,
        title: `Batch ${b.name}`,
        description: "Cohort does not have a designated lead instructor assigned.",
        remediationNote: "Assign a trainer in Batch Management.",
      });
    }
  }

  checks.push({
    id: "check-batches-trainer",
    name: "Cohort Faculty Assignment",
    category: "unassigned",
    description: "Ensures every scheduled batch is staffed by an authorized faculty trainer.",
    severity: unassignedBatches.length > 0 ? "warning" : "info",
    affectedCount: unassignedBatches.length,
    issues: unassignedBatches,
  });

  // 4. Check Batches without Lab Room
  const roomNames = new Set(rooms.map((r) => r.name));
  const unassignedRooms: DataHealthIssue[] = [];
  for (const b of batches) {
    if (!b.room || !roomNames.has(b.room)) {
      unassignedRooms.push({
        id: `unassigned-rm-${b.id}`,
        entity: "Batch",
        entityId: b.id,
        title: `Batch ${b.name}`,
        description: `Room reference '${b.room}' is not found in registered campus lab inventory.`,
        remediationNote: "Select an existing computer lab or lecture room.",
      });
    }
  }

  checks.push({
    id: "check-batches-room",
    name: "Physical Lab Room Allocations",
    category: "unassigned",
    description: "Ensures scheduled classes are mapped to physical hardware workstations.",
    severity: unassignedRooms.length > 0 ? "warning" : "info",
    affectedCount: unassignedRooms.length,
    issues: unassignedRooms,
  });

  // 5. Check Duplicate Registration IDs or CNICs
  const regMap = new Map<string, number>();
  const cnicMap = new Map<string, number>();
  for (const s of students) {
    regMap.set(s.registrationId, (regMap.get(s.registrationId) || 0) + 1);
    if (s.cnic) {
      cnicMap.set(s.cnic, (cnicMap.get(s.cnic) || 0) + 1);
    }
  }

  const duplicates: DataHealthIssue[] = [];
  regMap.forEach((count, regId) => {
    if (count > 1) {
      duplicates.push({
        id: `dup-reg-${regId}`,
        entity: "Student",
        entityId: regId,
        title: `Duplicate Reg ID: ${regId}`,
        description: `Found ${count} student records with the same registration identifier.`,
        remediationNote: "Regenerate unique registration ID for conflicting records.",
      });
    }
  });

  checks.push({
    id: "check-duplicates",
    name: "Unique Identity & CNIC Uniqueness",
    category: "duplicates",
    description: "Scans for duplicate student registration identifiers and identity numbers.",
    severity: duplicates.length > 0 ? "critical" : "info",
    affectedCount: duplicates.length,
    issues: duplicates,
  });

  // Tally summaries
  for (const c of checks) {
    totalIssues += c.affectedCount;
    if (c.severity === "critical") {
      criticalIssues += c.affectedCount;
    }
  }

  const overallStatus =
    criticalIssues > 0 ? "critical" : totalIssues > 0 ? "attention-needed" : "healthy";

  return {
    summary: {
      overallStatus,
      checksRun: checks.length,
      totalIssues,
      criticalIssues,
      lastScannedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    },
    checks,
  };
}
