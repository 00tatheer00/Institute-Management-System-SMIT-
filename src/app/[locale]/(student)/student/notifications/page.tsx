"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import {
  getStudentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/services/notification-service";
import type { StudentNotification, NotificationCategory } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell, CheckCheck, Clock, FileText, HelpCircle,
  Megaphone, Award, CheckSquare, ExternalLink
} from "lucide-react";

const categoryIconMap: Record<NotificationCategory, React.ReactNode> = {
  assignment: <FileText className="h-4 w-4 text-blue-600" />,
  quiz: <HelpCircle className="h-4 w-4 text-purple-600" />,
  result: <Award className="h-4 w-4 text-emerald-600" />,
  attendance: <CheckSquare className="h-4 w-4 text-amber-600" />,
  announcement: <Megaphone className="h-4 w-4 text-rose-600" />,
  academic: <FileText className="h-4 w-4 text-indigo-600" />,
  certificate: <Award className="h-4 w-4 text-amber-500" />,
  system: <Bell className="h-4 w-4 text-muted-foreground" />,
};

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<StudentNotification[]>(() =>
    getStudentNotifications("student-1")
  );

  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredNotifications = useMemo(() => {
    if (filterCategory === "all") return notifications;
    if (filterCategory === "unread") return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.category === filterCategory);
  }, [notifications, filterCategory]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead("student-1");
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <Bell className="h-3.5 w-3.5" />
            Communication Feed
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications & Broadcasts</h1>
          <p className="text-sm text-muted-foreground">
            Evaluation updates, lecture notices, deadline reminders, and institutional announcements
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllRead}
            className="gap-1.5 text-xs h-8"
          >
            <CheckCheck className="h-3.5 w-3.5 text-blue-600" />
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={filterCategory === "all" ? "default" : "outline"}
          onClick={() => setFilterCategory("all")}
          className="text-xs h-8"
        >
          All ({notifications.length})
        </Button>
        <Button
          size="sm"
          variant={filterCategory === "unread" ? "default" : "outline"}
          onClick={() => setFilterCategory("unread")}
          className="text-xs h-8"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          size="sm"
          variant={filterCategory === "assignment" ? "default" : "outline"}
          onClick={() => setFilterCategory("assignment")}
          className="text-xs h-8"
        >
          Assignments
        </Button>
        <Button
          size="sm"
          variant={filterCategory === "quiz" ? "default" : "outline"}
          onClick={() => setFilterCategory("quiz")}
          className="text-xs h-8"
        >
          Quizzes
        </Button>
        <Button
          size="sm"
          variant={filterCategory === "announcement" ? "default" : "outline"}
          onClick={() => setFilterCategory("announcement")}
          className="text-xs h-8"
        >
          Broadcasts
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`transition-colors ${
                !notif.isRead
                  ? "border-blue-300 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/10"
                  : "hover:bg-muted/20"
              }`}
            >
              <CardContent className="p-4 flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-muted shrink-0 mt-0.5">
                  {categoryIconMap[notif.category] || <Bell className="h-4 w-4" />}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-foreground truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                      {notif.createdAt}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    {notif.linkUrl ? (
                      <Link href={notif.linkUrl}>
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                          <ExternalLink className="h-3 w-3" /> View Details
                        </Button>
                      </Link>
                    ) : <div />}

                    {!notif.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-[11px] text-blue-600 hover:text-blue-700 h-6 px-2"
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground border rounded-xl bg-card">
            No notifications found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
