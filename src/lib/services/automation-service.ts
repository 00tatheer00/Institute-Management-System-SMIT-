import type { AutomationRule, NotificationChannel } from "@/lib/types";
import { dispatchTemplateNotification } from "./communication-service";
import { students } from "@/lib/data/students";
import { initialAssignments } from "@/lib/data/assignments";
import { initialQuizzes } from "@/lib/data/quizzes";

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: "auto-1",
    eventName: "on_admission_applied",
    label: "Application Submitted Confirmation",
    category: "admission",
    isEnabled: true,
    channels: ["in-app", "email"],
    templateCode: "admission_received",
  },
  {
    id: "auto-2",
    eventName: "on_admission_shortlisted",
    label: "Candidate Shortlisted Notice",
    category: "admission",
    isEnabled: true,
    channels: ["in-app", "email", "whatsapp", "sms"],
    templateCode: "admission_shortlisted",
  },
  {
    id: "auto-3",
    eventName: "on_student_absent",
    label: "Daily Absent Notification",
    category: "attendance",
    isEnabled: true,
    channels: ["in-app", "whatsapp"],
    templateCode: "attendance_absent",
  },
  {
    id: "auto-4",
    eventName: "on_attendance_low",
    label: "Attendance Below 75% Warning",
    category: "attendance",
    isEnabled: true,
    channels: ["in-app", "whatsapp", "email"],
    templateCode: "attendance_warning",
  },
  {
    id: "auto-5",
    eventName: "on_assignment_created",
    label: "New Assignment Published",
    category: "academic",
    isEnabled: true,
    channels: ["in-app", "whatsapp"],
    templateCode: "assignment_published",
  },
  {
    id: "auto-6",
    eventName: "on_assignment_graded",
    label: "Assignment Graded Notification",
    category: "academic",
    isEnabled: true,
    channels: ["in-app", "email"],
    templateCode: "assignment_graded",
  },
  {
    id: "auto-7",
    eventName: "on_quiz_created",
    label: "New Quiz Announced",
    category: "academic",
    isEnabled: true,
    channels: ["in-app", "whatsapp"],
    templateCode: "quiz_published",
  },
  {
    id: "auto-8",
    eventName: "on_result_published",
    label: "Term Results Published",
    category: "academic",
    isEnabled: true,
    channels: ["in-app", "whatsapp", "email"],
    templateCode: "result_published",
  },
  {
    id: "auto-9",
    eventName: "on_certificate_issued",
    label: "Certificate Issued Announcement",
    category: "certificate",
    isEnabled: true,
    channels: ["in-app", "email", "whatsapp"],
    templateCode: "certificate_issued",
  },
  {
    id: "auto-10",
    eventName: "on_support_reply",
    label: "Helpdesk Reply Received",
    category: "support",
    isEnabled: true,
    channels: ["in-app", "email"],
    templateCode: "support_ticket_reply",
  },
];

let automationRules: AutomationRule[] = [...INITIAL_AUTOMATION_RULES];

export function getAutomationRules(): AutomationRule[] {
  return automationRules;
}

export function updateAutomationRule(
  id: string,
  data: Partial<AutomationRule>
): AutomationRule | null {
  const index = automationRules.findIndex((r) => r.id === id);
  if (index === -1) return null;

  automationRules[index] = {
    ...automationRules[index],
    ...data,
  };

  return automationRules[index];
}

// =============================================================================
// DOMAIN EVENT TRIGGERS
// =============================================================================

export async function triggerAttendanceEvent(data: {
  studentId: string;
  studentName: string;
  studentPhone?: string;
  studentEmail?: string;
  courseName: string;
  batchName: string;
  status: "absent" | "present" | "late" | "excused";
  currentPercentage: number;
}) {
  const isAbsent = data.status === "absent";
  const isLow = data.currentPercentage < 75;

  const today = new Date().toISOString().split("T")[0];

  // 1. Trigger Absent Alert
  if (isAbsent) {
    const rule = automationRules.find((r) => r.eventName === "on_student_absent" && r.isEnabled);
    if (rule) {
      for (const channel of rule.channels) {
        await dispatchTemplateNotification({
          recipientId: data.studentId,
          recipientName: data.studentName,
          recipientContact: channel === "email" ? (data.studentEmail || "student@mhit.edu.pk") : (data.studentPhone || "+923001234567"),
          recipientRole: "student",
          channel,
          templateCode: rule.templateCode,
          variables: {
            student_name: data.studentName,
            course_name: data.courseName,
            batch_name: data.batchName,
          },
          idempotencyKey: `att-absent-${data.studentId}-${today}-${channel}`,
        });
      }
    }
  }

  // 2. Trigger Low Attendance Warning (<75%)
  if (isLow) {
    const rule = automationRules.find((r) => r.eventName === "on_attendance_low" && r.isEnabled);
    if (rule) {
      for (const channel of rule.channels) {
        await dispatchTemplateNotification({
          recipientId: data.studentId,
          recipientName: data.studentName,
          recipientContact: channel === "email" ? (data.studentEmail || "student@mhit.edu.pk") : (data.studentPhone || "+923001234567"),
          recipientRole: "student",
          channel,
          templateCode: rule.templateCode,
          variables: {
            student_name: data.studentName,
            attendance_percentage: data.currentPercentage,
          },
          idempotencyKey: `att-low-${data.studentId}-${today}-${channel}`,
        });
      }
    }
  }
}

export async function triggerAssignmentGradedEvent(data: {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  assignmentTitle: string;
  obtainedMarks: number;
  totalMarks: number;
}) {
  const rule = automationRules.find((r) => r.eventName === "on_assignment_graded" && r.isEnabled);
  if (!rule) return;

  for (const channel of rule.channels) {
    await dispatchTemplateNotification({
      recipientId: data.studentId,
      recipientName: data.studentName,
      recipientContact: channel === "email" ? (data.studentEmail || "student@mhit.edu.pk") : "+923001234567",
      recipientRole: "student",
      channel,
      templateCode: rule.templateCode,
      variables: {
        student_name: data.studentName,
        assignment_name: data.assignmentTitle,
        result: `${data.obtainedMarks}/${data.totalMarks}`,
      },
      idempotencyKey: `asg-graded-${data.studentId}-${data.assignmentTitle}-${channel}`,
    });
  }
}

export async function triggerCertificateIssuedEvent(data: {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  courseName: string;
  certificateNumber: string;
}) {
  const rule = automationRules.find((r) => r.eventName === "on_certificate_issued" && r.isEnabled);
  if (!rule) return;

  for (const channel of rule.channels) {
    await dispatchTemplateNotification({
      recipientId: data.studentId,
      recipientName: data.studentName,
      recipientContact: channel === "email" ? (data.studentEmail || "student@mhit.edu.pk") : (data.studentPhone || "+923001234567"),
      recipientRole: "student",
      channel,
      templateCode: rule.templateCode,
      variables: {
        student_name: data.studentName,
        course_name: data.courseName,
        certificate_serial: data.certificateNumber,
      },
      idempotencyKey: `cert-issued-${data.certificateNumber}-${channel}`,
    });
  }
}

export async function triggerSupportReplyEvent(data: {
  ticketId: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
}) {
  const rule = automationRules.find((r) => r.eventName === "on_support_reply" && r.isEnabled);
  if (!rule) return;

  for (const channel of rule.channels) {
    await dispatchTemplateNotification({
      recipientId: data.studentId,
      recipientName: data.studentName,
      recipientContact: channel === "email" ? (data.studentEmail || "student@mhit.edu.pk") : "+923001234567",
      recipientRole: "student",
      channel,
      templateCode: rule.templateCode,
      variables: {
        support_ticket_id: data.ticketNumber,
      },
      idempotencyKey: `supp-reply-${data.ticketId}-${Date.now().toString(36)}-${channel}`,
    });
  }
}

// =============================================================================
// SCHEDULED REMINDERS CRON RUNNER
// =============================================================================

export async function processScheduledReminders(): Promise<{
  scanned: number;
  remindersSent: number;
}> {
  let remindersSent = 0;
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowDateStr = tomorrow.toISOString().split("T")[0];

  // 1. Scan assignments due tomorrow
  const upcomingAssignments = initialAssignments.filter((a) => a.dueDate.startsWith(tomorrowDateStr));

  for (const asg of upcomingAssignments) {
    // Find enrolled active students in batch
    const enrolled = students.filter((s) => s.batchId === asg.batchId && s.status === "active");

    for (const st of enrolled) {
      await dispatchTemplateNotification({
        recipientId: st.id,
        recipientName: st.name,
        recipientContact: st.email || "+923001234567",
        recipientRole: "student",
        channel: "in-app",
        templateCode: "assignment_published",
        variables: {
          assignment_name: `${asg.title} (Reminder: Due Tomorrow)`,
          batch_name: asg.batchId,
          event_date: asg.dueDate,
        },
        idempotencyKey: `remind-asg-${asg.id}-${st.id}-${tomorrowDateStr}`,
      });
      remindersSent++;
    }
  }

  // 2. Scan quizzes scheduled for tomorrow
  const upcomingQuizzes = initialQuizzes.filter((q) => q.status === "open");
  for (const q of upcomingQuizzes) {
    const enrolled = students.filter((s) => s.batchId === q.batchId && s.status === "active");
    for (const st of enrolled) {
      await dispatchTemplateNotification({
        recipientId: st.id,
        recipientName: st.name,
        recipientContact: st.phone || "+923001234567",
        recipientRole: "student",
        channel: "in-app",
        templateCode: "quiz_published",
        variables: {
          quiz_name: `${q.title} (Tomorrow)`,
          batch_name: q.batchId,
        },
        idempotencyKey: `remind-quiz-${q.id}-${st.id}-${tomorrowDateStr}`,
      });
      remindersSent++;
    }
  }

  return {
    scanned: upcomingAssignments.length + upcomingQuizzes.length,
    remindersSent,
  };
}
