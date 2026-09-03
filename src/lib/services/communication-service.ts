import type {
  NotificationChannel,
  NotificationDispatchJob,
  UserRole,
} from "@/lib/types";

/**
 * Communication Architecture & Multi-Channel Dispatcher
 *
 * Provider Interface Abstraction:
 * Communication Service
 *        ↓
 * Provider Interface (In-App, Email, SMS, WhatsApp)
 *
 * This clean contract allows external gateway drivers (SendGrid, Twilio, Meta Cloud API)
 * to be plugged in seamlessly during future integration phases without altering domain logic.
 */

export interface CommunicationProvider {
  channel: NotificationChannel;
  name: string;
  isAvailable: boolean;
  send(job: NotificationDispatchJob): Promise<boolean>;
}

// Mock In-App Provider
const inAppProvider: CommunicationProvider = {
  channel: "in-app",
  name: "Internal Portal Feed Driver",
  isAvailable: true,
  async send(job) {
    // In-memory delivery to student/trainer notification store
    return true;
  },
};

// Mock Email Provider Contract (Prepared for SendGrid / AWS SES)
const emailProvider: CommunicationProvider = {
  channel: "email",
  name: "Transactional SMTP & SES Driver",
  isAvailable: false, // Architecture-ready (mock mode)
  async send(job) {
    return true;
  },
};

// Mock SMS Provider Contract (Prepared for Twilio / Local Telco APIs)
const smsProvider: CommunicationProvider = {
  channel: "sms",
  name: "Telco SMS Gateway Adapter",
  isAvailable: false,
  async send(job) {
    return true;
  },
};

// Mock WhatsApp Provider Contract (Prepared for Meta Cloud Business API)
const whatsappProvider: CommunicationProvider = {
  channel: "whatsapp",
  name: "WhatsApp Business API Adapter",
  isAvailable: false,
  async send(job) {
    return true;
  },
};

const providers: Record<NotificationChannel, CommunicationProvider> = {
  "in-app": inAppProvider,
  email: emailProvider,
  sms: smsProvider,
  whatsapp: whatsappProvider,
};

const dispatchQueue: NotificationDispatchJob[] = [];

export function getCommunicationProviders(): {
  channel: NotificationChannel;
  name: string;
  status: "active" | "configured-mock" | "disabled";
}[] {
  return [
    { channel: "in-app", name: "In-App Notification Feed", status: "active" },
    { channel: "email", name: "Institutional Email Dispatcher", status: "configured-mock" },
    { channel: "sms", name: "Campus Mobile SMS Gateway", status: "configured-mock" },
    { channel: "whatsapp", name: "WhatsApp Broadcast API", status: "configured-mock" },
  ];
}

export function queueNotification(data: {
  recipientId: string;
  recipientRole: UserRole;
  channel: NotificationChannel;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}): NotificationDispatchJob {
  const provider = providers[data.channel];

  const job: NotificationDispatchJob = {
    id: `disp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipientId: data.recipientId,
    recipientRole: data.recipientRole,
    channel: data.channel,
    title: data.title,
    body: data.body,
    status: provider.isAvailable ? "dispatched" : "queued",
    providerName: provider.name,
    dispatchedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    metadata: data.metadata,
  };

  dispatchQueue.unshift(job);
  return job;
}

export function getDispatchHistory(): NotificationDispatchJob[] {
  return dispatchQueue;
}
