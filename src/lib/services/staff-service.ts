import { staff } from "@/lib/data/staff";
import type { Staff } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const searchFields: (keyof Staff)[] = ["name", "email", "phone", "department", "designation"];

export function getStaff(params: QueryParams = {}): PaginatedResult<Staff> {
  return queryItems(staff, { pageSize: 15, ...params }, searchFields);
}

export function getStaffById(id: string): Staff | undefined {
  return staff.find((s) => s.id === id);
}

export function createStaff(data: Omit<Staff, "id">): MutationResult<Staff> {
  const id = `staff-${staff.length + 1}`;
  const newStaff: Staff = { ...data, id };
  staff.push(newStaff);
  return { success: true, data: newStaff };
}

export function updateStaff(id: string, data: Partial<Staff>): MutationResult<Staff> {
  const index = staff.findIndex((s) => s.id === id);
  if (index === -1) return { success: false, error: "Staff not found" };
  staff[index] = { ...staff[index], ...data };
  return { success: true, data: staff[index] };
}
