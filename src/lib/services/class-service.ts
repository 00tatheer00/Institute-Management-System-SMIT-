import { classSessions } from "@/lib/data/misc";
import type { ClassSession } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const searchFields: (keyof ClassSession)[] = ["title", "description", "room", "date"];

export function getClasses(params: QueryParams = {}): PaginatedResult<ClassSession> {
  return queryItems(classSessions, { pageSize: 15, ...params }, searchFields);
}

export function getClassById(id: string): ClassSession | undefined {
  return classSessions.find((c) => c.id === id);
}

export interface ScheduleConflict {
  type: "room" | "trainer" | "batch";
  message: string;
  conflictingClass: ClassSession;
}

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

function isOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  return s1 < e2 && s2 < e1;
}

export function checkScheduleConflict(
  data: Pick<ClassSession, "date" | "startTime" | "endTime" | "room" | "trainerId" | "batchId">,
  excludeId?: string
): ScheduleConflict | null {
  for (const session of classSessions) {
    if (excludeId && session.id === excludeId) continue;
    if (session.date !== data.date) continue;

    const overlap = isOverlapping(data.startTime, data.endTime, session.startTime, session.endTime);
    if (!overlap) continue;

    // Check Room conflict
    if (session.room.toLowerCase() === data.room.toLowerCase()) {
      return {
        type: "room",
        message: `Room "${data.room}" is already booked on ${data.date} between ${session.startTime} - ${session.endTime} for "${session.title}".`,
        conflictingClass: session,
      };
    }

    // Check Trainer conflict
    if (session.trainerId === data.trainerId) {
      return {
        type: "trainer",
        message: `Trainer is already scheduled on ${data.date} between ${session.startTime} - ${session.endTime} for "${session.title}".`,
        conflictingClass: session,
      };
    }

    // Check Batch conflict
    if (session.batchId === data.batchId) {
      return {
        type: "batch",
        message: `This batch already has a class scheduled on ${data.date} between ${session.startTime} - ${session.endTime} ("${session.title}").`,
        conflictingClass: session,
      };
    }
  }

  return null;
}

export function createClass(data: Omit<ClassSession, "id">): MutationResult<ClassSession> {
  const conflict = checkScheduleConflict(data);
  if (conflict) {
    return { success: false, error: conflict.message };
  }

  const id = `class-${classSessions.length + 1}`;
  const newClass: ClassSession = { ...data, id };
  classSessions.push(newClass);
  return { success: true, data: newClass };
}

export function updateClass(id: string, data: Partial<ClassSession>): MutationResult<ClassSession> {
  const index = classSessions.findIndex((c) => c.id === id);
  if (index === -1) return { success: false, error: "Class not found" };

  const target = { ...classSessions[index], ...data };
  const conflict = checkScheduleConflict(target, id);
  if (conflict) {
    return { success: false, error: conflict.message };
  }

  classSessions[index] = target;
  return { success: true, data: target };
}

export function deleteClass(id: string): MutationResult<null> {
  const index = classSessions.findIndex((c) => c.id === id);
  if (index === -1) return { success: false, error: "Class not found" };
  classSessions.splice(index, 1);
  return { success: true };
}
