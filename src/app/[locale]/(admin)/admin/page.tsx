import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertCircle, DollarSign, Activity, FileSpreadsheet, ShieldAlert, Sparkles, CheckCircle2,
  Zap, ArrowUpRight
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
    <div className="space-y-6 animate-fade-in">
      {/* ─── Executive Welcome Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl gradient-mesh p-6 sm:p-8 text-white shadow-depth">
        {/* Ambient glow & dot grid */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/15">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Executive Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Institutional Operations &amp; Intelligence
            </h1>
            <p className="text-sm text-white/75 leading-relaxed">
              Real-time student lifecycle, cohort progression, attendance benchmarks, and intake analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/admin/analytics">
              <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 font-medium border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-105">
                <TrendingUp className="h-3.5 w-3.5 text-teal-300" /> Analytics Hub
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 font-medium border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-105">
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-300" /> Export Reports
              </Button>
            </Link>
            <Link href="/admin/finance">
              <Button size="sm" variant="glow" className="text-xs h-9 gap-1.5 font-semibold transition-all duration-200 hover:scale-105 shadow-brand">
                <DollarSign className="h-3.5 w-3.5" /> Finance &amp; Grants
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Critical System Alerts Bar ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alert 1: Low Attendance Warning */}
        <Card className="border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/60 via-amber-50/20 to-transparent dark:from-amber-950/20 dark:to-transparent shadow-sm hover:shadow-float transition-all duration-300 group">
          <CardContent className="p-4 flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 transition-transform group-hover:scale-110">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-foreground">Attendance Alert</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                  {lowAttendanceCount} Students &lt; 75%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                Candidates at risk of certificate ineligibility. Review intervention roster.
              </p>
              <Link href="/admin/analytics/attendance" className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold hover:underline inline-flex items-center gap-1 pt-0.5">
                View Low Attendance Roster <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alert 2: Admissions Inflow Pending */}
        <Card className="border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/60 via-blue-50/20 to-transparent dark:from-blue-950/20 dark:to-transparent shadow-sm hover:shadow-float transition-all duration-300 group">
          <CardContent className="p-4 flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 transition-transform group-hover:scale-110">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-foreground">Admissions Inflow</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                  {stats.pendingAdmissions} Pending
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                Online intake applications awaiting qualification assessment.
              </p>
              <Link href="/admin/admissions" className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1 pt-0.5">
                Process Applications <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alert 3: Database & Integrity Health */}
        <Card className="border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/60 via-emerald-50/20 to-transparent dark:from-emerald-950/20 dark:to-transparent shadow-sm hover:shadow-float transition-all duration-300 group">
          <CardContent className="p-4 flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 transition-transform group-hover:scale-110">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-foreground">Data Health Scan</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                  {healthResult.summary.overallStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                {healthResult.summary.totalIssues === 0
                  ? "All relational constraints & registration IDs intact."
                  : `${healthResult.summary.totalIssues} integrity warnings identified.`}
              </p>
              <Link href="/admin/data-management" className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1 pt-0.5">
                Open Diagnostics <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── KPI Cards Grid (Apple UI Soft Light Gradients) ─── */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard title={t("totalStudents")} value={stats.totalStudents} icon={<GraduationCap className="h-5 w-5" />} change={12} trend="up" changeLabel="vs last month" variant="blue" />
        <StatCard title={t("activeStudents")} value={stats.activeStudents} icon={<Users className="h-5 w-5" />} change={8} trend="up" changeLabel="vs last month" variant="emerald" />
        <StatCard title={t("activeBatches")} value={stats.activeBatches} icon={<Layers className="h-5 w-5" />} change={2} trend="up" changeLabel="new cohorts" variant="purple" />
        <StatCard title="Avg. Attendance" value={`${stats.avgAttendance}%`} icon={<TrendingUp className="h-5 w-5" />} change={3} trend="up" changeLabel="pass benchmark" variant="amber" />
      </div>

      {/* ─── Financial Health Summary Row (Apple UI Soft Light Gradients) ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 space-y-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/10 via-white to-cyan-500/5 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-slate-900 border border-sky-200/70 dark:border-sky-800/40 shadow-xs hover-lift">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Total Endowment &amp; Grants</p>
          <p className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-sans">PKR {(financeSummary.totalFunding / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> 100% Free subsidized tech education
          </p>
        </Card>
        <Card className="p-5 space-y-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-white to-emerald-500/5 dark:from-teal-950/40 dark:via-slate-900/60 dark:to-slate-900 border border-teal-200/70 dark:border-teal-800/40 shadow-xs hover-lift">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Disbursed Operations</p>
          <p className="text-2xl lg:text-3xl font-black tracking-tight text-teal-600 dark:text-teal-400 font-sans">PKR {(financeSummary.totalExpenses / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-teal-500" /> Modern labs, faculty &amp; solar grid
          </p>
        </Card>
        <Card className="p-5 space-y-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-green-500/5 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900 border border-emerald-200/70 dark:border-emerald-800/40 shadow-xs hover-lift">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600" />
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Operating Reserve</p>
          <p className="text-2xl lg:text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 font-sans">PKR {(financeSummary.remainingBalance / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Healthy institutional cash buffer
          </p>
        </Card>
      </div>

      {/* ─── Charts Rows ─── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <EnrollmentChart data={enrollmentData} />
        <CourseDistributionChart data={courseChartData} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <AttendanceChart data={attendanceData} />
        <AdmissionsFunnelChart data={funnelData} />
      </div>

      {/* ─── Operational Triad (Apple UI Soft Light Gradient Cards) ─── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Today's Classes */}
        <Card className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-br from-slate-50/80 via-white to-sky-50/20 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-slate-950 shadow-xs hover-lift">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{t("todaysClasses")}</CardTitle>
                <CardDescription className="text-xs text-slate-400">Live schedule &amp; rooms</CardDescription>
              </div>
              <Link href="/admin/classes">
                <Button variant="ghost" size="sm" className="text-xs h-8 hover:bg-[#0071e3]/10 text-[#0071e3] font-bold rounded-xl">
                  View All <ArrowRight className="h-3 w-3 ms-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysClasses.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No classes scheduled today</p>
            ) : (
              todaysClasses.map((cls) => {
                const trainer = getTrainerById(cls.trainerId);
                return (
                  <div key={cls.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/80 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/60 text-[#0071e3] shadow-xs">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{cls.title}</p>
                      <p className="text-[11px] text-slate-500">{cls.startTime} – {cls.endTime} · <span className="font-semibold text-slate-700 dark:text-slate-300">{cls.room}</span></p>
                      {trainer && <p className="text-[10px] text-[#0071e3] font-bold mt-0.5">{trainer.name}</p>}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Admissions */}
        <Card className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/20 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-slate-950 shadow-xs hover-lift">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{t("recentAdmissions")}</CardTitle>
                <CardDescription className="text-xs text-slate-400">Latest online applicants</CardDescription>
              </div>
              <Link href="/admin/admissions">
                <Button variant="ghost" size="sm" className="text-xs h-8 hover:bg-[#0071e3]/10 text-[#0071e3] font-bold rounded-xl">
                  Review <ArrowRight className="h-3 w-3 ms-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recentApps.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/80 transition-colors">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{app.studentName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{app.applicationId} · {app.city}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Batches */}
        <Card className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-br from-slate-50/80 via-white to-emerald-50/20 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-slate-950 shadow-xs hover-lift">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Upcoming Batches</CardTitle>
                <CardDescription className="text-xs text-slate-400">Active enrollment intake</CardDescription>
              </div>
              <Link href="/admin/batches">
                <Button variant="ghost" size="sm" className="text-xs h-8 hover:bg-emerald-500/10 text-emerald-600 font-bold rounded-xl">
                  Batches <ArrowRight className="h-3 w-3 ms-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {enrollingBatches.map((batch) => (
              <div key={batch.id} className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/50 space-y-2 hover:border-[#0071e3]/30 transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{batch.name}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">{batch.enrolledSeats}/{batch.totalSeats} seats</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0071e3] to-teal-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.round((batch.enrolledSeats / batch.totalSeats) * 100)}%` }} />
                </div>
                <p className="text-[10.5px] text-slate-400 font-medium">{batch.schedule?.days?.join(", ")} · {batch.room}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
