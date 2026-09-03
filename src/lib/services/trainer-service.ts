import { trainers } from "@/lib/data/trainers";
import type { Trainer } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const searchFields: (keyof Trainer)[] = ["name", "email", "phone", "title", "bio", "education"];

export function getTrainers(params: QueryParams = {}): PaginatedResult<Trainer> {
  return queryItems(trainers, { pageSize: 12, ...params }, searchFields);
}

export function getTrainerById(id: string): Trainer | undefined {
  return trainers.find((t) => t.id === id);
}

export function createTrainer(data: Omit<Trainer, "id" | "totalStudents" | "rating">): MutationResult<Trainer> {
  const id = `trainer-${trainers.length + 1}`;
  const newTrainer: Trainer = {
    ...data,
    id,
    totalStudents: 0,
    rating: 5.0,
  };
  trainers.push(newTrainer);
  return { success: true, data: newTrainer };
}

export function updateTrainer(id: string, data: Partial<Trainer>): MutationResult<Trainer> {
  const index = trainers.findIndex((t) => t.id === id);
  if (index === -1) return { success: false, error: "Trainer not found" };
  trainers[index] = { ...trainers[index], ...data };
  return { success: true, data: trainers[index] };
}
