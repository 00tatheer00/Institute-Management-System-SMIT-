import type { Announcement, NotificationChannel } from "@/lib/types";
import { announcements as initialAnnouncements } from "@/lib/data/misc";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";
import { students } from "@/lib/data/students";
import { dispatchNotification } from "./communication-service";

const announcementStore: Announcement[] = [...initialAnnouncements];

const annSearchFields: (keyof Announcement)[] = ["title", "content", "category", "publishedBy"];

export function getAnnouncements(params: QueryParams = {}): PaginatedResult<Announcement> {
  return queryItems(announcementStore, { pageSize: 15, ...params }, annSearchFields);
}

export function getPublicAnnouncements(): Announcement[] {
  return announcementStore;
}

export function getAnnouncementById(id: string): Announcement | undefined {
  return announcementStore.find((a) => a.id === id);
}

export function createAnnouncement(data: {
  title: string;
  content: string;
  category: "academic" | "admission" | "event" | "general";
  isImportant?: boolean;
  publishedBy?: string;
  distributionChannels?: NotificationChannel[];
  targetBatchId?: string;
}): Announcement {
  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    title: data.title,
    content: data.content,
    category: data.category,
    isImportant: !!data.isImportant,
    publishedAt: new Date().toISOString().split("T")[0],
    publishedBy: data.publishedBy || "Administration Office",
  };

  announcementStore.unshift(newAnn);

  // If distribution channels are specified, broadcast to students
  if (data.distributionChannels && data.distributionChannels.length > 0) {
    const targetStudents = data.targetBatchId
      ? students.filter((s) => s.batchId === data.targetBatchId && s.status === "active")
      : students.slice(0, 10);

    targetStudents.forEach((st) => {
      data.distributionChannels!.forEach((channel) => {
        dispatchNotification({
          recipientId: st.id,
          recipientName: st.name,
          recipientContact: channel === "email" ? (st.email || "student@mhit.edu.pk") : (st.phone || "+923001234567"),
          recipientRole: "student",
          channel,
          title: `Announcement: ${newAnn.title}`,
          body: newAnn.content,
          idempotencyKey: `ann-${newAnn.id}-${st.id}-${channel}`,
        }).catch((e) => console.error("Announcement dispatch error:", e));
      });
    });
  }

  return newAnn;
}

export function deleteAnnouncement(id: string): boolean {
  const index = announcementStore.findIndex((a) => a.id === id);
  if (index === -1) return false;
  announcementStore.splice(index, 1);
  return true;
}
