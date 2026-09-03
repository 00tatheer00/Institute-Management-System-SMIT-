import type { Batch } from "@/lib/types";

// ============================================================
// BATCHES — 30 batches linked to courses and trainers
// ============================================================

export const batches: Batch[] = [
  // Web Development Batches
  { id: "batch-1", name: "WD-01", courseId: "course-1", trainerId: "trainer-1", startDate: "2026-01-15", endDate: "2026-05-15", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "09:00", endTime: "11:00" }, room: "Lab A", campus: "Main Campus", totalSeats: 35, enrolledSeats: 35, status: "completed", isActive: false },
  { id: "batch-2", name: "WD-02", courseId: "course-1", trainerId: "trainer-1", startDate: "2026-03-01", endDate: "2026-07-01", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "11:00", endTime: "13:00" }, room: "Lab A", campus: "Main Campus", totalSeats: 35, enrolledSeats: 35, status: "completed", isActive: false },
  { id: "batch-3", name: "WD-03", courseId: "course-1", trainerId: "trainer-1", startDate: "2026-05-01", endDate: "2026-09-01", schedule: { days: ["Tuesday", "Thursday", "Saturday"], startTime: "09:00", endTime: "11:00" }, room: "Lab B", campus: "Main Campus", totalSeats: 35, enrolledSeats: 32, status: "in-progress", isActive: true },
  { id: "batch-4", name: "WD-04", courseId: "course-1", trainerId: "trainer-1", startDate: "2026-07-01", endDate: "2026-11-01", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "14:00", endTime: "16:00" }, room: "Lab A", campus: "Main Campus", totalSeats: 35, enrolledSeats: 28, status: "in-progress", isActive: true },
  { id: "batch-5", name: "WD-05", courseId: "course-1", trainerId: "trainer-1", startDate: "2026-10-01", endDate: "2027-02-01", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "09:00", endTime: "11:00" }, room: "Lab A", campus: "Main Campus", totalSeats: 35, enrolledSeats: 15, status: "enrolling", isActive: true },

  // App Development Batches
  { id: "batch-6", name: "AD-01", courseId: "course-2", trainerId: "trainer-2", startDate: "2026-02-01", endDate: "2026-05-30", schedule: { days: ["Tuesday", "Thursday", "Saturday"], startTime: "09:00", endTime: "11:00" }, room: "Lab C", campus: "Main Campus", totalSeats: 30, enrolledSeats: 30, status: "completed", isActive: false },
  { id: "batch-7", name: "AD-02", courseId: "course-2", trainerId: "trainer-2", startDate: "2026-06-01", endDate: "2026-09-30", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "11:00", endTime: "13:00" }, room: "Lab C", campus: "Main Campus", totalSeats: 30, enrolledSeats: 27, status: "in-progress", isActive: true },
  { id: "batch-8", name: "AD-03", courseId: "course-2", trainerId: "trainer-2", startDate: "2026-10-15", endDate: "2027-02-15", schedule: { days: ["Tuesday", "Thursday", "Saturday"], startTime: "14:00", endTime: "16:00" }, room: "Lab C", campus: "Main Campus", totalSeats: 30, enrolledSeats: 8, status: "enrolling", isActive: true },

  // AI Batches
  { id: "batch-9", name: "AI-01", courseId: "course-3", trainerId: "trainer-3", startDate: "2026-01-15", endDate: "2026-06-15", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "14:00", endTime: "16:00" }, room: "Lab D", campus: "Main Campus", totalSeats: 30, enrolledSeats: 30, status: "completed", isActive: false },
  { id: "batch-10", name: "AI-02", courseId: "course-3", trainerId: "trainer-3", startDate: "2026-06-01", endDate: "2026-11-01", schedule: { days: ["Tuesday", "Thursday"], startTime: "09:00", endTime: "12:00" }, room: "Lab D", campus: "Main Campus", totalSeats: 30, enrolledSeats: 25, status: "in-progress", isActive: true },
  { id: "batch-11", name: "AI-03", courseId: "course-3", trainerId: "trainer-3", startDate: "2026-11-01", endDate: "2027-04-01", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "09:00", endTime: "11:00" }, room: "Lab D", campus: "Main Campus", totalSeats: 30, enrolledSeats: 5, status: "upcoming", isActive: true },

  // Digital Marketing Batches
  { id: "batch-12", name: "DM-01", courseId: "course-4", trainerId: "trainer-4", startDate: "2026-03-01", endDate: "2026-06-01", schedule: { days: ["Tuesday", "Thursday"], startTime: "11:00", endTime: "13:00" }, room: "Room 201", campus: "Main Campus", totalSeats: 40, enrolledSeats: 40, status: "completed", isActive: false },
  { id: "batch-13", name: "DM-02", courseId: "course-4", trainerId: "trainer-4", startDate: "2026-07-01", endDate: "2026-10-01", schedule: { days: ["Monday", "Wednesday"], startTime: "14:00", endTime: "16:00" }, room: "Room 201", campus: "Main Campus", totalSeats: 40, enrolledSeats: 35, status: "in-progress", isActive: true },
  { id: "batch-14", name: "DM-03", courseId: "course-4", trainerId: "trainer-4", startDate: "2026-11-01", endDate: "2027-02-01", schedule: { days: ["Tuesday", "Thursday"], startTime: "09:00", endTime: "11:00" }, room: "Room 201", campus: "Main Campus", totalSeats: 40, enrolledSeats: 0, status: "upcoming", isActive: true },

  // Graphic Design Batches
  { id: "batch-15", name: "GD-01", courseId: "course-5", trainerId: "trainer-5", startDate: "2026-04-01", endDate: "2026-07-01", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "09:00", endTime: "11:00" }, room: "Design Studio", campus: "Main Campus", totalSeats: 25, enrolledSeats: 25, status: "completed", isActive: false },
  { id: "batch-16", name: "GD-02", courseId: "course-5", trainerId: "trainer-5", startDate: "2026-08-01", endDate: "2026-11-01", schedule: { days: ["Tuesday", "Thursday", "Saturday"], startTime: "11:00", endTime: "13:00" }, room: "Design Studio", campus: "Main Campus", totalSeats: 25, enrolledSeats: 22, status: "in-progress", isActive: true },

  // Video Editing Batches
  { id: "batch-17", name: "VE-01", courseId: "course-6", trainerId: "trainer-6", startDate: "2026-05-01", endDate: "2026-08-01", schedule: { days: ["Monday", "Wednesday"], startTime: "14:00", endTime: "16:00" }, room: "Media Lab", campus: "Main Campus", totalSeats: 20, enrolledSeats: 20, status: "completed", isActive: false },
  { id: "batch-18", name: "VE-02", courseId: "course-6", trainerId: "trainer-6", startDate: "2026-09-01", endDate: "2026-12-01", schedule: { days: ["Tuesday", "Thursday"], startTime: "14:00", endTime: "16:00" }, room: "Media Lab", campus: "Main Campus", totalSeats: 20, enrolledSeats: 18, status: "in-progress", isActive: true },

  // UI/UX Batches
  { id: "batch-19", name: "UX-01", courseId: "course-7", trainerId: "trainer-7", startDate: "2026-03-15", endDate: "2026-06-15", schedule: { days: ["Tuesday", "Thursday", "Saturday"], startTime: "09:00", endTime: "11:00" }, room: "Room 301", campus: "Main Campus", totalSeats: 30, enrolledSeats: 30, status: "completed", isActive: false },
  { id: "batch-20", name: "UX-02", courseId: "course-7", trainerId: "trainer-7", startDate: "2026-07-15", endDate: "2026-10-15", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "11:00", endTime: "13:00" }, room: "Room 301", campus: "Main Campus", totalSeats: 30, enrolledSeats: 28, status: "in-progress", isActive: true },
  { id: "batch-21", name: "UX-03", courseId: "course-7", trainerId: "trainer-7", startDate: "2026-11-15", endDate: "2027-02-15", schedule: { days: ["Tuesday", "Thursday"], startTime: "09:00", endTime: "12:00" }, room: "Room 301", campus: "Main Campus", totalSeats: 30, enrolledSeats: 0, status: "upcoming", isActive: true },

  // Cyber Security Batches
  { id: "batch-22", name: "CS-01", courseId: "course-8", trainerId: "trainer-8", startDate: "2026-06-01", endDate: "2026-10-01", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "14:00", endTime: "16:00" }, room: "Lab E", campus: "Main Campus", totalSeats: 25, enrolledSeats: 23, status: "in-progress", isActive: true },
  { id: "batch-23", name: "CS-02", courseId: "course-8", trainerId: "trainer-8", startDate: "2026-11-01", endDate: "2027-03-01", schedule: { days: ["Tuesday", "Thursday"], startTime: "09:00", endTime: "12:00" }, room: "Lab E", campus: "Main Campus", totalSeats: 25, enrolledSeats: 0, status: "upcoming", isActive: true },

  // Networking Batches
  { id: "batch-24", name: "NET-01", courseId: "course-9", trainerId: "trainer-9", startDate: "2026-04-01", endDate: "2026-07-01", schedule: { days: ["Tuesday", "Thursday", "Saturday"], startTime: "14:00", endTime: "16:00" }, room: "Lab F", campus: "Main Campus", totalSeats: 25, enrolledSeats: 25, status: "completed", isActive: false },
  { id: "batch-25", name: "NET-02", courseId: "course-9", trainerId: "trainer-9", startDate: "2026-08-15", endDate: "2026-11-15", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "09:00", endTime: "11:00" }, room: "Lab F", campus: "Main Campus", totalSeats: 25, enrolledSeats: 20, status: "in-progress", isActive: true },

  // Freelancing Batches
  { id: "batch-26", name: "FR-01", courseId: "course-10", trainerId: "trainer-10", startDate: "2026-02-01", endDate: "2026-04-01", schedule: { days: ["Saturday"], startTime: "10:00", endTime: "14:00" }, room: "Room 101", campus: "Main Campus", totalSeats: 50, enrolledSeats: 50, status: "completed", isActive: false },
  { id: "batch-27", name: "FR-02", courseId: "course-10", trainerId: "trainer-10", startDate: "2026-05-01", endDate: "2026-07-01", schedule: { days: ["Saturday"], startTime: "10:00", endTime: "14:00" }, room: "Room 101", campus: "Main Campus", totalSeats: 50, enrolledSeats: 50, status: "completed", isActive: false },
  { id: "batch-28", name: "FR-03", courseId: "course-10", trainerId: "trainer-10", startDate: "2026-09-01", endDate: "2026-11-01", schedule: { days: ["Saturday"], startTime: "10:00", endTime: "14:00" }, room: "Room 101", campus: "Main Campus", totalSeats: 50, enrolledSeats: 42, status: "in-progress", isActive: true },

  // Data Science Batch
  { id: "batch-29", name: "DS-01", courseId: "course-11", trainerId: "trainer-11", startDate: "2026-07-01", endDate: "2026-11-01", schedule: { days: ["Monday", "Wednesday", "Friday"], startTime: "11:00", endTime: "13:00" }, room: "Lab D", campus: "Main Campus", totalSeats: 30, enrolledSeats: 26, status: "in-progress", isActive: true },

  // Cloud Computing Batch
  { id: "batch-30", name: "CC-01", courseId: "course-12", trainerId: "trainer-12", startDate: "2026-08-01", endDate: "2026-12-01", schedule: { days: ["Tuesday", "Thursday"], startTime: "14:00", endTime: "17:00" }, room: "Lab E", campus: "Main Campus", totalSeats: 25, enrolledSeats: 20, status: "in-progress", isActive: true },
];

export function getBatchById(id: string): Batch | undefined {
  return batches.find((b) => b.id === id);
}

export function getBatchesByCourse(courseId: string): Batch[] {
  return batches.filter((b) => b.courseId === courseId);
}

export function getBatchesByTrainer(trainerId: string): Batch[] {
  return batches.filter((b) => b.trainerId === trainerId);
}

export function getActiveBatches(): Batch[] {
  return batches.filter((b) => b.isActive);
}

export function getEnrollingBatches(): Batch[] {
  return batches.filter((b) => b.status === "enrolling" || b.status === "upcoming");
}
