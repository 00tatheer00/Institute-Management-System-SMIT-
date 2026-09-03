import type { Room } from "@/lib/types";

export const rooms: Room[] = [
  { id: "room-1", name: "Lab A", type: "computer-lab", capacity: 35, floor: "Ground Floor", building: "Main Campus", equipment: ["35 Desktop PCs", "Projector", "AC", "Whiteboard", "UPS"], hasProjector: true, hasAC: true, hasWhiteboard: true, isAvailable: true, status: "available" },
  { id: "room-2", name: "Lab B", type: "computer-lab", capacity: 30, floor: "Ground Floor", building: "Main Campus", equipment: ["30 Desktop PCs", "Projector", "AC", "Whiteboard"], hasProjector: true, hasAC: true, hasWhiteboard: true, isAvailable: true, status: "available" },
  { id: "room-3", name: "Lab C", type: "computer-lab", capacity: 30, floor: "First Floor", building: "Main Campus", equipment: ["30 Desktop PCs", "Projector", "AC"], hasProjector: true, hasAC: true, hasWhiteboard: false, isAvailable: true, status: "available" },
  { id: "room-4", name: "Lab D", type: "training-lab", capacity: 25, floor: "First Floor", building: "Main Campus", equipment: ["25 Desktop PCs", "Projector", "AC", "Smart Board"], hasProjector: true, hasAC: true, hasWhiteboard: true, isAvailable: true, status: "available" },
  { id: "room-5", name: "Room 101", type: "classroom", capacity: 40, floor: "Ground Floor", building: "Main Campus", equipment: ["Projector", "AC", "Whiteboard", "Podium"], hasProjector: true, hasAC: true, hasWhiteboard: true, isAvailable: true, status: "available" },
  { id: "room-6", name: "Room 201", type: "classroom", capacity: 45, floor: "First Floor", building: "Main Campus", equipment: ["Projector", "AC", "Whiteboard", "Podium"], hasProjector: true, hasAC: true, hasWhiteboard: true, isAvailable: true, status: "available" },
  { id: "room-7", name: "Design Studio", type: "training-lab", capacity: 20, floor: "Second Floor", building: "Main Campus", equipment: ["20 iMacs", "Drawing Tablets", "AC", "Projector"], hasProjector: true, hasAC: true, hasWhiteboard: true, isAvailable: true, status: "available" },
  { id: "room-8", name: "Seminar Hall", type: "auditorium", capacity: 120, floor: "Ground Floor", building: "Main Campus", equipment: ["Stage", "Sound System", "Projector", "AC", "Podium", "Microphones"], hasProjector: true, hasAC: true, hasWhiteboard: false, isAvailable: true, status: "available" },
  { id: "room-9", name: "Conference Room", type: "meeting-room", capacity: 15, floor: "Second Floor", building: "Main Campus", equipment: ["TV Screen", "AC", "Whiteboard", "Teleconference System"], hasProjector: false, hasAC: true, hasWhiteboard: true, isAvailable: true, status: "available" },
  { id: "room-10", name: "Networking Lab", type: "training-lab", capacity: 20, floor: "First Floor", building: "Main Campus", equipment: ["Cisco Routers", "Switches", "Rack Servers", "Projector", "AC"], hasProjector: true, hasAC: true, hasWhiteboard: true, isAvailable: false, status: "maintenance", notes: "Equipment upgrade in progress" },
  { id: "room-11", name: "Room 301", type: "classroom", capacity: 35, floor: "Second Floor", building: "Main Campus", equipment: ["Projector", "AC", "Whiteboard"], hasProjector: true, hasAC: true, hasWhiteboard: true, isAvailable: true, status: "available" },
  { id: "room-12", name: "Admin Office", type: "office", capacity: 8, floor: "Ground Floor", building: "Main Campus", equipment: ["4 Desks", "AC", "Printer", "Phone Lines"], hasProjector: false, hasAC: true, hasWhiteboard: false, isAvailable: true, status: "occupied" },
];

export function getRoomById(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}

export function getAvailableRooms(): Room[] {
  return rooms.filter((r) => r.isAvailable && r.status === "available");
}

export function getRoomsByType(type: Room["type"]): Room[] {
  return rooms.filter((r) => r.type === type);
}
