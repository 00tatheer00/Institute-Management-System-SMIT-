import { batches } from "@/lib/data/batches";
import type { Batch } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const searchFields: (keyof Batch)[] = ["name", "courseId", "trainerId", "room", "campus"];

export function getBatches(params: QueryParams = {}): PaginatedResult<Batch> {
  return queryItems(batches, { pageSize: 15, ...params }, searchFields);
}

export function getBatchById(id: string): Batch | undefined {
  return batches.find((b) => b.id === id);
}

export function createBatch(data: Omit<Batch, "id" | "enrolledSeats">): MutationResult<Batch> {
  const id = `batch-${batches.length + 1}`;
  const newBatch: Batch = {
    ...data,
    id,
    enrolledSeats: 0,
  };
  batches.push(newBatch);
  return { success: true, data: newBatch };
}

export function updateBatch(id: string, data: Partial<Batch>): MutationResult<Batch> {
  const index = batches.findIndex((b) => b.id === id);
  if (index === -1) return { success: false, error: "Batch not found" };
  batches[index] = { ...batches[index], ...data };
  return { success: true, data: batches[index] };
}
