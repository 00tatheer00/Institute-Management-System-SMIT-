import type {
  SupportTicket,
  SupportReply,
  SupportCategory,
  SupportPriority,
  SupportStatus,
} from "@/lib/types";
import { initialTickets } from "@/lib/data/support";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";
import { triggerSupportReplyEvent } from "./automation-service";

const ticketStore: SupportTicket[] = [...initialTickets];

const ticketSearchFields: (keyof SupportTicket)[] = [
  "ticketNumber",
  "studentName",
  "subject",
  "description",
  "category",
];

export function getAllTickets(params: QueryParams = {}): PaginatedResult<SupportTicket> {
  return queryItems(ticketStore, { pageSize: 15, ...params }, ticketSearchFields);
}

export function getStudentTickets(studentId: string): SupportTicket[] {
  return ticketStore.filter((t) => t.studentId === studentId);
}

export function getTicketById(id: string): SupportTicket | undefined {
  return ticketStore.find((t) => t.id === id || t.ticketNumber === id);
}

export function createTicket(data: {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  courseName?: string;
  batchName?: string;
  category: SupportCategory;
  subject: string;
  description: string;
  priority: SupportPriority;
}): SupportTicket {
  const count = ticketStore.length + 1;
  const ticketNumber = `SUP-2026-${String(count).padStart(4, "0")}`;

  const newTicket: SupportTicket = {
    id: `ticket-${Date.now()}`,
    ticketNumber,
    studentId: data.studentId,
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    courseName: data.courseName || "Web Development",
    batchName: data.batchName || "WD-01",
    category: data.category,
    subject: data.subject,
    description: data.description,
    priority: data.priority,
    status: "open",
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    replies: [],
  };

  ticketStore.unshift(newTicket);
  return newTicket;
}

export function addTicketReply(data: {
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: "student" | "admin" | "trainer";
  message: string;
}): SupportReply | null {
  const ticket = ticketStore.find((t) => t.id === data.ticketId);
  if (!ticket) return null;

  const reply: SupportReply = {
    id: `rep-${Date.now()}`,
    ticketId: data.ticketId,
    authorId: data.authorId,
    authorName: data.authorName,
    authorRole: data.authorRole,
    message: data.message,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  ticket.replies.push(reply);
  ticket.updatedAt = reply.createdAt;

  if (data.authorRole === "admin" || data.authorRole === "trainer") {
    if (ticket.status === "open") {
      ticket.status = "in-progress";
    }
    triggerSupportReplyEvent({
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      studentId: ticket.studentId,
      studentName: ticket.studentName,
      studentEmail: ticket.studentEmail,
    }).catch((e) => console.error("Support reply notification trigger error:", e));
  } else if (data.authorRole === "student") {
    if (ticket.status === "waiting-student") {
      ticket.status = "in-progress";
    }
  }

  return reply;
}

export function updateTicketStatus(ticketId: string, status: SupportStatus): boolean {
  const ticket = ticketStore.find((t) => t.id === ticketId);
  if (!ticket) return false;

  ticket.status = status;
  ticket.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
  if (status === "resolved" || status === "closed") {
    ticket.resolvedAt = ticket.updatedAt;
  }
  return true;
}
