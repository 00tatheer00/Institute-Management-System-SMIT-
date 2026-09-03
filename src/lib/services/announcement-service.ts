import type { Announcement } from "@/lib/types";
import { announcements as initialAnnouncements } from "@/lib/data/misc";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";

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
  return newAnn;
}

export function deleteAnnouncement(id: string): boolean {
  const index = announcementStore.findIndex((a) => a.id === id);
  if (index === -1) return false;
  announcementStore.splice(index, 1);
  return true;
}
