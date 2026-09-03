import type { StudentNotification, NotificationCategory } from "@/lib/types";
import { initialNotifications } from "@/lib/data/notifications";

const notificationStore: StudentNotification[] = [...initialNotifications];

export function getStudentNotifications(
  studentId: string,
  category?: NotificationCategory | "all"
): StudentNotification[] {
  return notificationStore.filter((n) => {
    const matchesStudent = n.studentId === studentId;
    const matchesCategory = !category || category === "all" || n.category === category;
    return matchesStudent && matchesCategory;
  });
}

export function getUnreadNotificationCount(studentId: string): number {
  return notificationStore.filter((n) => n.studentId === studentId && !n.isRead).length;
}

export function markNotificationAsRead(id: string): boolean {
  const notif = notificationStore.find((n) => n.id === id);
  if (!notif) return false;
  notif.isRead = true;
  return true;
}

export function markAllNotificationsAsRead(studentId: string): void {
  for (const n of notificationStore) {
    if (n.studentId === studentId) {
      n.isRead = true;
    }
  }
}

export function createNotification(data: {
  studentId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  linkUrl?: string;
}): StudentNotification {
  const newNotif: StudentNotification = {
    id: `notif-${Date.now()}`,
    studentId: data.studentId,
    title: data.title,
    message: data.message,
    category: data.category,
    isRead: false,
    linkUrl: data.linkUrl,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  notificationStore.unshift(newNotif);
  return newNotif;
}
