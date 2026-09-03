import type { NotificationTemplate } from "@/lib/types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export const INITIAL_TEMPLATES: NotificationTemplate[] = [
  {
    id: "tpl-1",
    code: "admission_received",
    name: "Application Received",
    category: "admission",
    channels: ["in-app", "email", "whatsapp"],
    titleEn: "Application Received: {{course_name}}",
    bodyEn: "Dear {{student_name}}, your admission application for {{course_name}} has been received. Your registration ID is {{registration_id}}.",
    titleUr: "درخواست موصول ہوگئی: {{course_name}}",
    bodyUr: "محترم {{student_name}}، آپ کی {{course_name}} کے لیے داخلہ درخواست موصول ہو گئی ہے۔ آپ کی رجسٹریشن آئی ڈی {{registration_id}} ہے۔",
    variables: ["student_name", "course_name", "registration_id"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
  {
    id: "tpl-2",
    code: "admission_shortlisted",
    name: "Application Shortlisted",
    category: "admission",
    channels: ["in-app", "email", "whatsapp", "sms"],
    titleEn: "Admission Shortlist: {{course_name}}",
    bodyEn: "Congratulations {{student_name}}! You have been shortlisted for {{course_name}}. Your interview is scheduled on {{event_date}}.",
    titleUr: "داخلہ شارٹ لسٹ: {{course_name}}",
    bodyUr: "مبارک ہو {{student_name}}! آپ کو {{course_name}} کے لیے شارٹ لسٹ کر لیا گیا ہے۔ آپ کا انٹرویو {{event_date}} کو ہے۔",
    variables: ["student_name", "course_name", "event_date"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
  {
    id: "tpl-3",
    code: "attendance_absent",
    name: "Student Absent Alert",
    category: "attendance",
    channels: ["in-app", "whatsapp", "sms"],
    titleEn: "Absent Alert: {{course_name}} - {{batch_name}}",
    bodyEn: "Dear {{student_name}}, you were marked absent today for {{course_name}} ({{batch_name}}). Please maintain mandatory attendance.",
    titleUr: "غیر حاضری کی اطلاع: {{course_name}} - {{batch_name}}",
    bodyUr: "محترم {{student_name}}، آج آپ {{course_name}} ({{batch_name}}) میں غیر حاضر مارک ہوئے ہیں۔ برائے مہربانی اپنی حاضری یقینی بنائیں۔",
    variables: ["student_name", "course_name", "batch_name"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
  {
    id: "tpl-4",
    code: "attendance_warning",
    name: "Low Attendance Warning (<75%)",
    category: "attendance",
    channels: ["in-app", "email", "whatsapp"],
    titleEn: "Attendance Alert: Attendance below 75%",
    bodyEn: "Dear {{student_name}}, your attendance is currently {{attendance_percentage}}%, which is below the mandatory 75% SMIT council threshold.",
    titleUr: "حاضری کا انتباہ: حاضری 75 فیصد سے کم ہے",
    bodyUr: "محترم {{student_name}}، آپ کی حاضری اس وقت {{attendance_percentage}} فیصد ہے، جو 75 فیصد کی لازمی حد سے کم ہے۔",
    variables: ["student_name", "attendance_percentage"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
  {
    id: "tpl-5",
    code: "assignment_published",
    name: "New Assignment Published",
    category: "academic",
    channels: ["in-app", "whatsapp", "email"],
    titleEn: "New Assignment: {{assignment_name}}",
    bodyEn: "A new assignment \"{{assignment_name}}\" has been posted for {{batch_name}}. Deadline: {{event_date}}.",
    titleUr: "نیا اسائنمنٹ شائع ہوا: {{assignment_name}}",
    bodyUr: "بیچ {{batch_name}} کے لیے نیا اسائنمنٹ \"{{assignment_name}}\" پوسٹ کر دیا گیا ہے۔ آخری تاریخ: {{event_date}}۔",
    variables: ["assignment_name", "batch_name", "event_date"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
  {
    id: "tpl-6",
    code: "assignment_graded",
    name: "Assignment Graded",
    category: "academic",
    channels: ["in-app", "email"],
    titleEn: "Assignment Evaluated: {{assignment_name}}",
    bodyEn: "Dear {{student_name}}, your submission for \"{{assignment_name}}\" has been graded. Marks: {{result}}.",
    titleUr: "اسائنمنٹ چیک ہو گیا: {{assignment_name}}",
    bodyUr: "محترم {{student_name}}، آپ کا اسائنمنٹ \"{{assignment_name}}\" چیک ہو چکا ہے۔ حاصل کردہ نمبر: {{result}}۔",
    variables: ["student_name", "assignment_name", "result"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
  {
    id: "tpl-7",
    code: "quiz_published",
    name: "New Quiz Announced",
    category: "academic",
    channels: ["in-app", "whatsapp"],
    titleEn: "New Quiz Scheduled: {{quiz_name}}",
    bodyEn: "A new quiz \"{{quiz_name}}\" is scheduled for {{batch_name}}. Please prepare according to syllabus.",
    titleUr: "نیا کوئز شیڈول: {{quiz_name}}",
    bodyUr: "بیچ {{batch_name}} کے لیے نیا کوئز \"{{quiz_name}}\" شیڈول کیا گیا ہے۔",
    variables: ["quiz_name", "batch_name"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
  {
    id: "tpl-8",
    code: "result_published",
    name: "Official Result Published",
    category: "academic",
    channels: ["in-app", "email", "whatsapp"],
    titleEn: "Academic Result Published: {{course_name}}",
    bodyEn: "Official academic results for {{batch_name}} are now published. Check your student transcript portal.",
    titleUr: "سرکاری نتیجہ جاری: {{course_name}}",
    bodyUr: "بیچ {{batch_name}} کے سرکاری نتائج جاری کر دیے گئے ہیں۔ اپنے سٹوڈنٹ پورٹل میں ٹرانسکرپٹ دیکھیں۔",
    variables: ["course_name", "batch_name"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
  {
    id: "tpl-9",
    code: "certificate_issued",
    name: "Certificate Issued",
    category: "certificate",
    channels: ["in-app", "email", "whatsapp"],
    titleEn: "Congratulations! Certificate Issued: {{certificate_serial}}",
    bodyEn: "Dear {{student_name}}, your official graduation certificate for {{course_name}} (Serial: {{certificate_serial}}) has been issued.",
    titleUr: "مبارک ہو! سرٹیفکیٹ جاری: {{certificate_serial}}",
    bodyUr: "محترم {{student_name}}، {{course_name}} کے لیے آپ کا گریجویشن سرٹیفکیٹ (سیریل: {{certificate_serial}}) جاری کر دیا گیا ہے۔",
    variables: ["student_name", "course_name", "certificate_serial"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
  {
    id: "tpl-10",
    code: "support_ticket_reply",
    name: "Support Ticket Reply",
    category: "support",
    channels: ["in-app", "email"],
    titleEn: "Support Update: Ticket #{{support_ticket_id}}",
    bodyEn: "Staff has replied to your support request #{{support_ticket_id}}. Please visit the helpdesk console to view details.",
    titleUr: "سپورٹ اپ ڈیٹ: ٹکٹ #{{support_ticket_id}}",
    bodyUr: "ہیلپ ڈیسک عملے نے آپ کے ٹکٹ #{{support_ticket_id}} کا جواب دیا ہے۔ تفصیلات دیکھنے کے لیے پورٹل وزٹ کریں۔",
    variables: ["support_ticket_id"],
    isActive: true,
    createdAt: "2026-01-01 10:00",
    updatedAt: "2026-01-01 10:00",
  },
];

let templateStore: NotificationTemplate[] = [...INITIAL_TEMPLATES];

/**
 * Safe variable placeholder interpolation
 * Replaces `{{variable_name}}` with supplied value or falls back to empty string
 * Completely safe against code injection (pure string regex replacement)
 */
export function interpolateVariables(template: string, variables: Record<string, string | number | undefined>): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    const val = variables[key];
    return val !== undefined && val !== null ? String(val) : match;
  });
}

export function getAllTemplates(): NotificationTemplate[] {
  return templateStore;
}

export function getTemplateByCode(code: string): NotificationTemplate | undefined {
  return templateStore.find((t) => t.code === code);
}

export function getTemplatesByCategory(category: string): NotificationTemplate[] {
  return templateStore.filter((t) => t.category === category);
}

export function createTemplate(data: Omit<NotificationTemplate, "id" | "createdAt" | "updatedAt">): NotificationTemplate {
  const newTemplate: NotificationTemplate = {
    ...data,
    id: `tpl-${Date.now()}`,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  templateStore.unshift(newTemplate);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("notification_templates")
      .insert({
        id: newTemplate.id,
        code: newTemplate.code,
        name: newTemplate.name,
        category: newTemplate.category,
        channels: newTemplate.channels,
        title_en: newTemplate.titleEn,
        body_en: newTemplate.bodyEn,
        title_ur: newTemplate.titleUr,
        body_ur: newTemplate.bodyUr,
        variables: newTemplate.variables,
        is_active: newTemplate.isActive,
      } as any)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase template insert error:", error);
      });
  }

  return newTemplate;
}

export function updateTemplate(id: string, data: Partial<NotificationTemplate>): NotificationTemplate | null {
  const index = templateStore.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated: NotificationTemplate = {
    ...templateStore[index],
    ...data,
    updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  templateStore[index] = updated;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("notification_templates")
      .update({
        name: updated.name,
        channels: updated.channels,
        title_en: updated.titleEn,
        body_en: updated.bodyEn,
        title_ur: updated.titleUr,
        body_ur: updated.bodyUr,
        variables: updated.variables,
        is_active: updated.isActive,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", id)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase template update error:", error);
      });
  }

  return updated;
}
