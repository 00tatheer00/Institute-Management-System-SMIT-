import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  EnrollmentChart, CourseDistributionChart, AttendanceChart, AdmissionsFunnelChart,
} from "@/components/admin/dashboard-charts";
import {
  getDashboardStats, getStudentsByCourseChart, getEnrollmentTrendChart,
  getAttendanceTrendChart, getAdmissionsFunnelChart,
} from "@/lib/services/dashboard-service";
import { getTodaysClasses, events, announcements } from "@/lib/data/misc";
import { applications } from "@/lib/data/applications";
import { batches, getEnrollingBatches } from "@/lib/data/batches";
import { getCourseById } from "@/lib/data/courses";
import { getTrainerById } from "@/lib/data/trainers";
import {
  GraduationCap, Users, BookOpen, Layers, ClipboardList, Calendar,
  TrendingUp, UserPlus, Upload, Plus, ArrowRight, Clock, AlertTriangle,
} from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.dashboard" });
  return { title: t("title") };
}

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.dashboard");

  const stats = getDashboardStats();
  const courseChartData = getStudentsByCourseChart();
  const enrollmentData = getEnrollmentTrendChart();
  const attendanceData = getAttendanceTrendChart();
  const funnelData = getAdmissionsFunnelChart();
  const todaysClasses = getTodaysClasses();
  const enrollingBatches = getEnrollingBatches().slice(0, 4);
  const recentApps = applications.filter((a) => a.status === "pending" || a.status === "under-review").slice(0, 5);
  const upcomingEvents = events.filter((e) => e.status === "upcoming").slice(0, 3);

  const quickActions = [
    { label: "Add Student", href: "/admin/students/new", icon: <UserPlus className="h-5 w-5" /> },
    { label: "Import Students", href: "/admin/import", icon: <Upload className="h-5 w-5" /> },
    { label: "Create Batch", href: "/admin/batches", icon: <Plus className="h-5 w-5" /> },
    { label: "Add Course", href: "/admin/courses", icon: <BookOpen className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("welcome")}, Admin</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title={t("totalStudents")} value={stats.totalStudents} icon={<GraduationCap className="h-5 w-5" />} change={12} trend="up" changeLabel="vs last month" />
        <StatCard title={t("activeStudents")} value={stats.activeStudents} icon={<Users className="h-5 w-5" />} change={8} trend="up" changeLabel="vs last month" />
        <StatCard title={t("activeBatches")} value={stats.activeBatches} icon={<Layers className="h-5 w-5" />} change={2} trend="up" changeLabel="new this month" />
        <StatCard title={t("totalCourses")} value={stats.totalCourses} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title={t("totalTrainers")} value={stats.totalTrainers} icon={<Users className="h-5 w-5" />} />
        <StatCard title={t("pendingApplications")} value={stats.pendingAdmissions} icon={<ClipboardList className="h-5 w-5" />} change={-5} trend="down" changeLabel="vs last week" />
        <StatCard title={t("todaysClasses")} value={stats.todaysClasses} icon={<Calendar className="h-5 w-5" />} />
        <StatCard title="Avg. Attendance" value={`${stats.avgAttendance}%`} icon={<TrendingUp className="h-5 w-5" />} change={3} trend="up" changeLabel="vs last month" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <EnrollmentChart data={enrollmentData} />
        <CourseDistributionChart data={courseChartData} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <AttendanceChart data={attendanceData} />
        <AdmissionsFunnelChart data={funnelData} />
      </div>

      {/* Operational Sections */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Today's Classes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">{t("todaysClasses")}</CardTitle>
              <Link href="/admin/classes"><Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="h-3 w-3 ms-1" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No classes scheduled today</p>
            ) : (
              todaysClasses.map((cls) => {
                const trainer = getTrainerById(cls.trainerId);
                return (
                  <div key={cls.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{cls.title}</p>
                      <p className="text-xs text-muted-foreground">{cls.startTime} – {cls.endTime} · {cls.room}</p>
                      {trainer && <p className="text-xs text-muted-foreground">{trainer.name}</p>}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Admissions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">{t("recentAdmissions")}</CardTitle>
              <Link href="/admin/admissions"><Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="h-3 w-3 ms-1" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentApps.map((app) => {
              const course = getCourseById(app.courseId);
              return (
                <div key={app.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{app.studentName}</p>
                    <p className="text-xs text-muted-foreground truncate">{course?.name}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{t("quickActions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 text-xs font-medium">
                    <div className="text-brand">{action.icon}</div>
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Upcoming Batches */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Upcoming Batches</CardTitle>
              <Link href="/admin/batches"><Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="h-3 w-3 ms-1" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {enrollingBatches.map((batch) => {
              const course = getCourseById(batch.courseId);
              return (
                <div key={batch.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{batch.name}</p>
                    <p className="text-xs text-muted-foreground">{course?.name} · Starts {new Date(batch.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {batch.enrolledSeats}/{batch.totalSeats}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">{t("upcomingEvents")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()} · {event.location}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
