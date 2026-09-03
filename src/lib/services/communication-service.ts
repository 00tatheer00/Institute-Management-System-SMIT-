import type {
  NotificationChannel,
  CommunicationLog,
  UserRole,
  ProviderConfig,
} from "@/lib/types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { createNotification } from "./notification-service";
import { interpolateVariables, getTemplateByCode } from "./template-service";

// =============================================================================
// PROVIDER INTERFACES & CONTRACTS
// =============================================================================

export interface SendJobPayload {
  recipientId: string;
  recipientName: string;
  recipientContact: string; // phone or email
  recipientRole: UserRole;
  channel: NotificationChannel;
  title: string;
  body: string;
  templateCode?: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}

export interface ProviderResult {
  success: boolean;
  externalMessageId?: string;
  error?: string;
  status: "sent" | "delivered" | "failed";
}

export interface CommunicationDriver {
  channel: NotificationChannel;
  name: string;
  isConfigured(): boolean;
  send(payload: SendJobPayload): Promise<ProviderResult>;
}

// 1. IN-APP FEED DRIVER
const inAppDriver: CommunicationDriver = {
  channel: "in-app",
  name: "Internal In-App Feed Driver",
  isConfigured() {
    return true; // Always active
  },
  async send(payload) {
    try {
      createNotification({
        studentId: payload.recipientId,
        title: payload.title,
        message: payload.body,
        category: "general",
      });

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        await supabase.from("notifications").insert({
          user_id: payload.recipientId,
          role: payload.recipientRole,
          title: payload.title,
          message: payload.body,
          channel: "in-app",
          is_read: false,
          metadata: payload.metadata || {},
        } as any);
      }

      return { success: true, status: "delivered" };
    } catch (err) {
      return { success: false, status: "failed", error: err instanceof Error ? err.message : "In-App delivery failed" };
    }
  },
};

// 2. WHATSAPP ADAPTER (Meta WhatsApp Business Cloud API / Twilio WhatsApp)
const whatsappDriver: CommunicationDriver = {
  channel: "whatsapp",
  name: "WhatsApp Cloud Business API",
  isConfigured() {
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    return Boolean(token && phoneId && !token.includes("your-token"));
  },
  async send(payload) {
    const isReady = this.isConfigured();

    if (isReady) {
      try {
        const token = process.env.WHATSAPP_API_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: payload.recipientContact.replace(/[^\d]/g, ""),
            type: "text",
            text: { body: `${payload.title}\n\n${payload.body}` },
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          return { success: false, status: "failed", error: errData.error?.message || "WhatsApp API error" };
        }

        const data = await res.json().catch(() => ({}));
        return { success: true, status: "sent", externalMessageId: data.messages?.[0]?.id };
      } catch (err) {
        return { success: false, status: "failed", error: err instanceof Error ? err.message : "WhatsApp request failed" };
      }
    }

    // Architecture-Ready Simulated Delivery (Mock Mode when credentials not provided)
    return {
      success: true,
      status: "delivered",
      externalMessageId: `wa-sim-${Date.now()}`,
    };
  },
};

// 3. EMAIL ADAPTER (Resend / Transactional SMTP)
const emailDriver: CommunicationDriver = {
  channel: "email",
  name: "Resend / SMTP Gateway Adapter",
  isConfigured() {
    const apiKey = process.env.RESEND_API_KEY;
    return Boolean(apiKey && !apiKey.includes("your-key"));
  },
  async send(payload) {
    const isReady = this.isConfigured();

    if (isReady) {
      try {
        const apiKey = process.env.RESEND_API_KEY;
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Mohsin & Huma IT Center <notifications@mhit.edu.pk>",
            to: [payload.recipientContact],
            subject: payload.title,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #1e3a8a;">Mohsin & Huma IT Center × SMIT</h2>
                <h3 style="color: #374151;">${payload.title}</h3>
                <p style="color: #4b5563; line-height: 1.6;">${payload.body.replace(/\n/g, "<br/>")}</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af;">This is an automated institutional communication from the MHIT Portal.</p>
              </div>
            `,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { success: false, status: "failed", error: err.message || "Email dispatch failed" };
        }

        const data = await res.json().catch(() => ({}));
        return { success: true, status: "sent", externalMessageId: data.id };
      } catch (err) {
        return { success: false, status: "failed", error: err instanceof Error ? err.message : "Email request failed" };
      }
    }

    // Architecture-Ready Simulated Delivery (Mock Mode)
    return {
      success: true,
      status: "delivered",
      externalMessageId: `email-sim-${Date.now()}`,
    };
  },
};

// 4. SMS ADAPTER (Twilio / Campus Telco API)
const smsDriver: CommunicationDriver = {
  channel: "sms",
  name: "Campus Mobile SMS Gateway",
  isConfigured() {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    return Boolean(sid && token && !sid.includes("your-sid"));
  },
  async send(payload) {
    const isReady = this.isConfigured();

    if (isReady) {
      try {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_PHONE_NUMBER || "+1234567890";

        const formData = new URLSearchParams();
        formData.append("To", payload.recipientContact);
        formData.append("From", from);
        formData.append("Body", `${payload.title}: ${payload.body}`);

        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { success: false, status: "failed", error: err.message || "SMS dispatch failed" };
        }

        const data = await res.json().catch(() => ({}));
        return { success: true, status: "sent", externalMessageId: data.sid };
      } catch (err) {
        return { success: false, status: "failed", error: err instanceof Error ? err.message : "SMS request failed" };
      }
    }

    // Architecture-Ready Simulated Delivery (Mock Mode)
    return {
      success: true,
      status: "delivered",
      externalMessageId: `sms-sim-${Date.now()}`,
    };
  },
};

const drivers: Record<NotificationChannel, CommunicationDriver> = {
  "in-app": inAppDriver,
  whatsapp: whatsappDriver,
  email: emailDriver,
  sms: smsDriver,
};

// =============================================================================
// COMMUNICATION LOGS LEDGER & IDEMPOTENCY ENGINE
// =============================================================================

const INITIAL_LOGS: CommunicationLog[] = [
  {
    id: "log-1",
    recipientId: "student-1",
    recipientName: "Muhammad Khan",
    recipientContact: "+92 300 1234567",
    recipientRole: "student",
    channel: "whatsapp",
    templateCode: "attendance_warning",
    title: "Attendance Alert: Attendance below 75%",
    body: "Dear Muhammad Khan, your attendance is currently 72%, which is below the mandatory 75% SMIT council threshold.",
    status: "delivered",
    provider: "WhatsApp Cloud Business API",
    idempotencyKey: "att-warn-student-1-2026-03-01",
    retryCount: 0,
    maxRetries: 3,
    deliveredAt: "2026-03-01 09:30",
    createdAt: "2026-03-01 09:29",
  },
  {
    id: "log-2",
    recipientId: "student-2",
    recipientName: "Fatima Ali",
    recipientContact: "fatima.ali@student.mhit.edu.pk",
    recipientRole: "student",
    channel: "email",
    templateCode: "certificate_issued",
    title: "Congratulations! Certificate Issued: MH-WD-2026-00002",
    body: "Dear Fatima Ali, your official graduation certificate for Web Development has been issued.",
    status: "delivered",
    provider: "Resend / SMTP Gateway Adapter",
    idempotencyKey: "cert-issued-student-2-2026-03-01",
    retryCount: 0,
    maxRetries: 3,
    deliveredAt: "2026-03-01 11:15",
    createdAt: "2026-03-01 11:14",
  },
  {
    id: "log-3",
    recipientId: "student-3",
    recipientName: "Ali Raza",
    recipientContact: "+92 321 9876543",
    recipientRole: "student",
    channel: "sms",
    templateCode: "attendance_absent",
    title: "Absent Alert: Web Development - WD-01",
    body: "Dear Ali Raza, you were marked absent today for Web Development (WD-01).",
    status: "failed",
    provider: "Campus Mobile SMS Gateway",
    idempotencyKey: "att-absent-student-3-2026-03-02",
    errorMessage: "Network route destination timeout",
    retryCount: 2,
    maxRetries: 3,
    createdAt: "2026-03-02 14:05",
  },
];

let communicationLogs: CommunicationLog[] = [...INITIAL_LOGS];

export function getCommunicationLogs(filters?: {
  channel?: NotificationChannel | "all";
  status?: string | "all";
  recipientId?: string;
  query?: string;
}): CommunicationLog[] {
  return communicationLogs.filter((log) => {
    if (filters?.channel && filters.channel !== "all" && log.channel !== filters.channel) return false;
    if (filters?.status && filters.status !== "all" && log.status !== filters.status) return false;
    if (filters?.recipientId && log.recipientId !== filters.recipientId) return false;
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      const match =
        log.recipientName.toLowerCase().includes(q) ||
        log.recipientContact.toLowerCase().includes(q) ||
        log.title.toLowerCase().includes(q) ||
        log.body.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export function getProviderConfigs(): ProviderConfig[] {
  return [
    {
      channel: "in-app",
      name: "Internal In-App Feed Driver",
      isConfigured: true,
      isEnabled: true,
      providerId: "system-in-app",
      lastTestStatus: "success",
      lastTestAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    },
    {
      channel: "whatsapp",
      name: "WhatsApp Cloud Business API",
      isConfigured: whatsappDriver.isConfigured(),
      isEnabled: true,
      providerId: "meta-cloud-api",
      webhookUrl: "https://portal.mhit.edu.pk/api/webhooks/whatsapp",
      lastTestStatus: "success",
      lastTestAt: "2026-03-02 12:00",
    },
    {
      channel: "email",
      name: "Institutional Email Dispatcher (Resend / SMTP)",
      isConfigured: emailDriver.isConfigured(),
      isEnabled: true,
      providerId: "resend-smtp",
      webhookUrl: "https://portal.mhit.edu.pk/api/webhooks/email",
      lastTestStatus: "success",
      lastTestAt: "2026-03-02 12:00",
    },
    {
      channel: "sms",
      name: "Campus Mobile SMS Gateway (Twilio / Telco)",
      isConfigured: smsDriver.isConfigured(),
      isEnabled: true,
      providerId: "twilio-sms",
      webhookUrl: "https://portal.mhit.edu.pk/api/webhooks/sms",
      lastTestStatus: "success",
      lastTestAt: "2026-03-02 12:00",
    },
  ];
}

/**
 * Primary Multi-Channel Dispatch Engine with Idempotency Protection
 */
export async function dispatchNotification(payload: SendJobPayload): Promise<CommunicationLog> {
  // 1. Idempotency Check: prevent duplicate messages for the same event
  if (payload.idempotencyKey) {
    const existing = communicationLogs.find(
      (l) => l.idempotencyKey === payload.idempotencyKey && (l.status === "sent" || l.status === "delivered")
    );
    if (existing) {
      return existing;
    }
  }

  const driver = drivers[payload.channel] || inAppDriver;

  const log: CommunicationLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipientId: payload.recipientId,
    recipientName: payload.recipientName,
    recipientContact: payload.recipientContact,
    recipientRole: payload.recipientRole,
    channel: payload.channel,
    templateCode: payload.templateCode,
    title: payload.title,
    body: payload.body,
    status: "sending",
    provider: driver.name,
    idempotencyKey: payload.idempotencyKey,
    retryCount: 0,
    maxRetries: 3,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  communicationLogs.unshift(log);

  // 2. Transmit via provider adapter
  try {
    const result = await driver.send(payload);

    log.status = result.status;
    if (result.status === "delivered" || result.status === "sent") {
      log.deliveredAt = new Date().toISOString().replace("T", " ").substring(0, 16);
    } else {
      log.errorMessage = result.error;
    }
  } catch (err) {
    log.status = "failed";
    log.errorMessage = err instanceof Error ? err.message : "Dispatch driver execution error";
  }

  // 3. Persist to Supabase when configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("communication_logs")
      .insert({
        id: log.id,
        recipient_id: log.recipientId,
        recipient_name: log.recipientName,
        recipient_contact: log.recipientContact,
        recipient_role: log.recipientRole,
        channel: log.channel,
        template_code: log.templateCode || null,
        title: log.title,
        body: log.body,
        status: log.status as any,
        provider: log.provider,
        idempotency_key: log.idempotencyKey || null,
        error_message: log.errorMessage || null,
        retry_count: log.retryCount,
        max_retries: log.maxRetries,
        delivered_at: log.deliveredAt || null,
      } as any)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase communication log insert error:", error);
      });
  }

  return log;
}

/**
 * Safe Retry Engine for Failed Messages
 */
export async function retryCommunicationLog(logId: string): Promise<CommunicationLog | null> {
  const log = communicationLogs.find((l) => l.id === logId);
  if (!log) return null;

  if (log.retryCount >= log.maxRetries) {
    log.status = "failed";
    log.errorMessage = `Exceeded maximum retry limit (${log.maxRetries} attempts).`;
    return log;
  }

  log.retryCount += 1;
  log.status = "sending";

  const driver = drivers[log.channel] || inAppDriver;

  const result = await driver.send({
    recipientId: log.recipientId,
    recipientName: log.recipientName,
    recipientContact: log.recipientContact,
    recipientRole: log.recipientRole,
    channel: log.channel,
    title: log.title,
    body: log.body,
    templateCode: log.templateCode,
  });

  log.status = result.status;
  if (result.status === "delivered" || result.status === "sent") {
    log.deliveredAt = new Date().toISOString().replace("T", " ").substring(0, 16);
    log.errorMessage = undefined;
  } else {
    log.errorMessage = result.error;
  }

  return log;
}

/**
 * Dispatch from Reusable Template helper
 */
export async function dispatchTemplateNotification(data: {
  recipientId: string;
  recipientName: string;
  recipientContact: string;
  recipientRole: UserRole;
  channel: NotificationChannel;
  templateCode: string;
  variables: Record<string, string | number | undefined>;
  locale?: "en" | "ur";
  idempotencyKey?: string;
}): Promise<CommunicationLog | null> {
  const template = getTemplateByCode(data.templateCode);
  if (!template) return null;

  const isUrdu = data.locale === "ur";
  const rawTitle = isUrdu ? template.titleUr : template.titleEn;
  const rawBody = isUrdu ? template.bodyUr : template.bodyEn;

  const title = interpolateVariables(rawTitle, data.variables);
  const body = interpolateVariables(rawBody, data.variables);

  return dispatchNotification({
    recipientId: data.recipientId,
    recipientName: data.recipientName,
    recipientContact: data.recipientContact,
    recipientRole: data.recipientRole,
    channel: data.channel,
    title,
    body,
    templateCode: template.code,
    idempotencyKey: data.idempotencyKey,
    metadata: data.variables,
  });
}
