import { initialAssignments } from "@/lib/data/assignments";
import type { Assignment } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const assignmentStore: Assignment[] = [...initialAssignments];
const searchFields: (keyof Assignment)[] = ["title", "description", "instructions"];

export function getAssignments(params: QueryParams = {}): PaginatedResult<Assignment> {
  return queryItems(assignmentStore, { pageSize: 15, ...params }, searchFields);
}

export function getAssignmentById(id: string): Assignment | undefined {
  return assignmentStore.find((a) => a.id === id);
}

export function getTrainerAssignments(trainerId: string, batchId?: string): Assignment[] {
  return assignmentStore.filter((a) => {
    if (a.trainerId !== trainerId) return false;
    if (batchId && a.batchId !== batchId) return false;
    return true;
  });
}

export function getStudentAssignments(batchId: string): Assignment[] {
  return assignmentStore.filter((a) => a.batchId === batchId && a.isPublished);
}

export function createAssignment(
  data: Omit<Assignment, "id" | "publishedAt">
): MutationResult<Assignment> {
  const newAssignment: Assignment = {
    ...data,
    id: `asgn-${Date.now()}`,
    publishedAt: data.status === "published" || data.isPublished ? new Date().toISOString() : "",
    isPublished: data.status === "published" || data.isPublished,
  };

  assignmentStore.unshift(newAssignment);
  return { success: true, data: newAssignment };
}

export function updateAssignment(
  id: string,
  data: Partial<Assignment>
): MutationResult<Assignment> {
  const index = assignmentStore.findIndex((a) => a.id === id);
  if (index === -1) return { success: false, error: "Assignment not found" };

  const updated: Assignment = {
    ...assignmentStore[index],
    ...data,
  };

  assignmentStore[index] = updated;
  return { success: true, data: updated };
}

export function publishAssignment(id: string): MutationResult<Assignment> {
  return updateAssignment(id, {
    status: "published",
    isPublished: true,
    publishedAt: new Date().toISOString(),
  });
}

export function closeAssignment(id: string): MutationResult<Assignment> {
  return updateAssignment(id, {
    status: "closed",
  });
}

export function archiveAssignment(id: string): MutationResult<Assignment> {
  return updateAssignment(id, {
    status: "archived",
    isPublished: false,
  });
}
