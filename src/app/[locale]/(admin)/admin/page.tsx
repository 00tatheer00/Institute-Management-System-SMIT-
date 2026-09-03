import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  EnrollmentChart, CourseDistributionChart, AttendanceChart, AdmissionsFunnelChart,
} from "@/components/admin/dashboard-charts";
import {
  getDashboardStats, getStudentsByCourseChart, getEnrollmentTrendChart,
  getAttendanceTrendChart, getAdmissionsFunnelChart,
} from "@/lib/services/dashboard-service";
import { getAttendanceAnalytics } from "@/lib/services/analytics-service";
import { runDataHealthDiagnostics } from "@/lib/services/data-health-service";
import { getFinancialSummary } from "@/lib/services/finance-service";
import { getTodaysClasses, events, announcements } from "@/lib/data/misc";
import { applications } from "@/lib/data/applications";
import { batches, getEnrollingBatches } from "@/lib/data/batches";
import { courses } from "@/lib/data/courses";
import { trainers } from "@/lib/data/trainers";
import { getTrainerById } from "@/lib/data/trainers";
import {
  GraduationCap, Users, BookOpen, Layers, ClipboardList, Calendar,
  TrendingUp, UserPlus, Upload, Plus, ArrowRight, Clock, AlertTriangle,
  AlertCircle, DollarSign, Activity, FileSpreadsheet, ShieldAlert, Sparkles, CheckCircle2
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

  // Phase 5 Executive Data
  const attendanceAnalytics = getAttendanceAnalytics();
  const healthResult = runDataHealthDiagnostics();
  const financeSummary = getFinancialSummary();
  const lowAttendanceCount = attendanceAnalytics.lowAttendanceStudents.length;

  return (
    <div className="space-y-6">
      {/* Executive Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <Activity className="h-3.5 w-3.5" />
            Executive Intelligence Command
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            Real-time academic standing, admissions conversion, and campus operations oversight
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/analytics">
            <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 font-medium">
              <TrendingUp className="h-3.5 w-3.5 text-blue-600" /> Analytics Hub
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 font-medium">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Export Reports
            </Button>
          </Link>
          <Link href="/admin/finance">
            <Button size="sm" className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <DollarSign className="h-3.5 w-3.5" /> Finance &amp; Grants
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical System Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alert 1: Low Attendance Warning */}
        <Card className="border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/10">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-foreground">Attendance Alert</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {lowAttendanceCount} Students &lt; 75%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Candidates at risk of certificate ineligibility. Review intervention list.
              </p>
              <Link href="/admin/analytics/attendance" className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold hover:underline inline-block pt-0.5">
                View Low Attendance Roster →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alert 2: Admissions Inflow Pending */}
        <Card className="border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/10">
          <CardContent className="p-4 flex items-start gap-3">
            <ClipboardList className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-foreground">Admissions Review</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {stats.pendingAdmissions} Pending
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Online intake applications awaiting qualification assessment.
              </p>
              <Link href="/admin/admissions" className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold hover:underline inline-block pt-0.5">
                Process Applications →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alert 3: Database & Integrity Health */}
        <Card className="border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10">
          <CardContent className="p-4 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-foreground">Data Health Scan</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {healthResult.summary.overallStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {healthResult.summary.totalIssues === 0
                  ? "All relational constraints & registration IDs intact."
                  : `${healthResult.summary.totalIssues} integrity warnings identified.`}
              </p>
              <Link href="/admin/data-management" className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline inline-block pt-0.5">
                Open Diagnostics →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard title={t("totalStudents")} value={stats.totalStudents} icon={<GraduationCap className="h-5 w-5" />} change={12} trend="up" changeLabel="vs last month" />
        <StatCard title={t("activeStudents")} value={stats.activeStudents} icon={<Users className="h-5 w-5" />} change={8} trend="up" changeLabel="vs last month" />
        <StatCard title={t("activeBatches")} value={stats.activeBatches} icon={<Layers className="h-5 w-5" />} change={2} trend="up" changeLabel="new cohorts" />
        <StatCard title="Avg. Attendance" value={`${stats.avgAttendance}%`} icon={<TrendingUp className="h-5 w-5" />} change={3} trend="up" changeLabel="pass benchmark" />
      </div>

      {/* Financial Health Summary Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 space-y-1 bg-card">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Endowment &amp; Grants</p>
          <p className="text-2xl font-extrabold text-foreground">PKR {(financeSummary.totalFunding / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-muted-foreground">Free training subsidized</p>
        </Card>
        <Card className="p-4 space-y-1 bg-card">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Disbursed Operations</p>
          <p className="text-2xl font-extrabold text-blue-600">PKR {(financeSummary.totalExpenses / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-muted-foreground">Hardware, faculty &amp; solar power</p>
        </Card>
        <Card className="p-4 space-y-1 bg-card">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Operating Reserve</p>
          <p className="text-2xl font-extrabold text-emerald-600">PKR {(financeSummary.remainingBalance / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-muted-foreground">Net operational cushion</p>
        </Card>
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
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
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
              <Link href="/admin/admissions"><Button variant="ghost" size="sm" className="text-xs">Review <ArrowRight className="h-3 w-3 ms-1" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentApps.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{app.studentName}</p>
                  <p className="text-xs text-muted-foreground">{app.applicationId} · {app.city}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enrolling Batches */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Upcoming Batches</CardTitle>
              <Link href="/admin/batches"><Button variant="ghost" size="sm" className="text-xs">Batches <ArrowRight className="h-3 w-3 ms-1" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {enrollingBatches.map((batch) => (
              <div key={batch.id} className="p-2 rounded-lg border bg-muted/20 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{batch.name}</span>
                  <span className="text-blue-600">{batch.enrolledSeats}/{batch.totalSeats} seats</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.round((batch.enrolledSeats / batch.totalSeats) * 100)}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground">{batch.schedule?.days?.join(", ")} · {batch.room}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
