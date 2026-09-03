import { rooms } from "@/lib/data/rooms";
import type { Room } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const searchFields: (keyof Room)[] = ["name", "floor", "building", "type", "notes"];

export function getRooms(params: QueryParams = {}): PaginatedResult<Room> {
  return queryItems(rooms, { pageSize: 15, ...params }, searchFields);
}

export function getRoomById(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}

export function createRoom(data: Omit<Room, "id">): MutationResult<Room> {
  const id = `room-${rooms.length + 1}`;
  const newRoom: Room = { ...data, id };
  rooms.push(newRoom);
  return { success: true, data: newRoom };
}

export function updateRoom(id: string, data: Partial<Room>): MutationResult<Room> {
  const index = rooms.findIndex((r) => r.id === id);
  if (index === -1) return { success: false, error: "Room not found" };
  rooms[index] = { ...rooms[index], ...data };
  return { success: true, data: rooms[index] };
}
