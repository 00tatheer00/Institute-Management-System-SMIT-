"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { toast } from "@/components/shared/apple-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCheck,
  Sparkles,
  GraduationCap,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  category: "admissions" | "system" | "academic";
  link?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Admission Application",
    desc: "Muhammad Hamza applied for Web Development (Batch 2026).",
    time: "5m ago",
    unread: true,
    category: "admissions",
    link: "/admin/admissions",
  },
  {
    id: "notif-2",
    title: "Entrance Test Scheduled",
    desc: "Gulshan Campus Batch 2026 exam venue assigned for Sunday 9:30 AM.",
    time: "1h ago",
    unread: true,
    category: "academic",
    link: "/admin/classes",
  },
  {
    id: "notif-3",
    title: "Attendance Scan Complete",
    desc: "Lab A turnstile biometric attendance sync successful (124 records).",
    time: "3h ago",
    unread: true,
    category: "system",
    link: "/admin/attendance",
  },
  {
    id: "notif-4",
    title: "Batch 2025 Certificates Issued",
    desc: "Official verification hashes generated for 340 graduating students.",
    time: "1d ago",
    unread: false,
    category: "academic",
    link: "/admin/certificates",
  },
];

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "admissions">("all");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredList = notifications.filter((n) => {
    if (filter === "unread") return n.unread;
    if (filter === "admissions") return n.category === "admissions";
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const simulatePush = () => {
    const randomId = Math.random().toString(36).substring(2, 7);
    const newNotif: NotificationItem = {
      id: `sim-${randomId}`,
      title: "New Applicant Registered",
      desc: `Candidate #SMIT-2026-${Math.floor(1000 + Math.random() * 9000)} uploaded photograph & generated smart card.`,
      time: "Just now",
      unread: true,
      category: "admissions",
      link: "/admin/admissions",
    };

    setNotifications((prev) => [newNotif, ...prev]);
    toast.info("New Notification", newNotif.desc);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          />
        }
      >
        <Bell className="h-4 w-4 text-slate-700 dark:text-slate-200" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 text-[9px] font-black text-white items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-0 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden"
      >
        {/* Header Bar */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Notifications
            </span>
            {unreadCount > 0 && (
              <Badge className="bg-[#0071e3] text-white text-[9px] font-extrabold px-1.5 py-0 h-4">
                {unreadCount} New
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={simulatePush}
              className="text-[10px] font-bold text-[#0071e3] hover:underline px-2 py-1 rounded-md hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer flex items-center gap-1"
              title="Test push notification"
            >
              <Plus className="h-3 w-3" />
              <span>Simulate</span>
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-3 py-2 bg-slate-50/70 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800/60">
          {(["all", "unread", "admissions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification Cards List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer ${
                item.unread ? "bg-sky-50/30 dark:bg-sky-950/20" : ""
              }`}
              onClick={() => {
                setNotifications((prev) =>
                  prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
                );
              }}
            >
              <div
                className={`mt-0.5 h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ${
                  item.category === "admissions"
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600"
                    : item.category === "system"
                    ? "bg-sky-100 dark:bg-sky-950 text-[#0071e3]"
                    : "bg-amber-100 dark:bg-amber-950 text-amber-600"
                }`}
              >
                {item.category === "admissions" ? (
                  <GraduationCap className="h-3.5 w-3.5" />
                ) : item.category === "system" ? (
                  <Sparkles className="h-3.5 w-3.5" />
                ) : (
                  <Calendar className="h-3.5 w-3.5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h5>
                  <span className="text-[9px] text-slate-400 shrink-0 font-medium">
                    {item.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 mt-0.5">
                  {item.desc}
                </p>
              </div>

              {item.unread && (
                <div className="h-2 w-2 rounded-full bg-[#0071e3] shrink-0 mt-1.5" />
              )}
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No notifications in this category.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
