import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getTrainerById } from "@/lib/data/trainers";
import { getBatchesByTrainer } from "@/lib/data/batches";
import { initialClasses } from "@/lib/data/classes";
import { getTrainerAssignments } from "@/lib/services/assignment-service";
import { getAssignmentStats } from "@/lib/services/submission-service";
import { getLowAttendanceStudents } from "@/lib/services/attendance-service";
import { getBatchGradeMetrics } from "@/lib/services/result-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Users, BookOpen, Layers, CheckSquare, FileText,
  AlertTriangle, ArrowRight, Clock, MapPin, Award
} from "lucide-react";

export default async function TrainerDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const trainer = getTrainerById("trainer-1") || {
    id: "trainer-1",
    name: "Ahmed Hassan",
    expertise: ["Web Development", "React", "Next.js"],
  };

  const batches = getBatchesByTrainer("trainer-1");
  const todaysClasses = initialClasses.filter((c) => c.trainerId === "trainer-1");
  const assignments = getTrainerAssignments("trainer-1");
  const lowAttendanceStudents = getLowAttendanceStudents(75).slice(0, 5);
  const batch1Metrics = getBatchGradeMetrics("batch-1");

  // Calculate grading queue count
  let totalPendingGrading = 0;
  assignments.forEach((a) => {
    const stats = getAssignmentStats(a.id);
    totalPendingGrading += stats.pendingCount;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur-xs mb-2">
              <BookOpen className="h-3.5 w-3.5" />
              Faculty Academic Console
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Welcome back, {trainer.name}
            </h1>
            <p className="text-sm text-emerald-100 mt-1 max-w-xl">
              You have {todaysClasses.length} lecture sessions scheduled today and {totalPendingGrading} student submissions in your grading queue.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/trainer/attendance">
              <Button variant="secondary" className="bg-white text-emerald-900 hover:bg-white/90 gap-1.5 font-semibold text-xs shadow-sm">
                <CheckSquare className="h-3.5 w-3.5 text-emerald-700" />
                Mark Classroom Attendance
              </Button>
            </Link>
            <Link href="/trainer/assignments">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5" />
                Manage Assignments
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── KPI Stats (Apple UI Soft Light Gradients) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900 shadow-xs hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Assigned Batches
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20 shadow-2xs">
              <Layers className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-sans">{batches.length}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Active cohorts in Web Development
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-sky-200/70 dark:border-sky-800/40 bg-gradient-to-br from-sky-500/10 via-white to-blue-500/5 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-slate-900 shadow-xs hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Classes Today
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-sky-500/15 text-[#0071e3] dark:text-sky-400 flex items-center justify-center ring-1 ring-sky-500/20 shadow-2xs">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-sans">{todaysClasses.length}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Lab A &amp; Lab B scheduled
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-amber-200/70 dark:border-amber-800/40 bg-gradient-to-br from-amber-500/10 via-white to-orange-500/5 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-slate-900 shadow-xs hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Grading
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-1 ring-amber-500/20 shadow-2xs">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400 font-sans">
              {totalPendingGrading}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Requires evaluation &amp; feedback
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-purple-200/70 dark:border-purple-800/40 bg-gradient-to-br from-purple-500/10 via-white to-indigo-500/5 dark:from-purple-950/40 dark:via-slate-900/60 dark:to-slate-900 shadow-xs hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cohort Pass Rate
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center ring-1 ring-purple-500/20 shadow-2xs">
              <Award className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-purple-600 dark:text-purple-400 font-sans">
              {batch1Metrics.passRate}%
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Based on midterms &amp; assessments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Today's Schedule & At-Risk Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Assigned Batches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Today&apos;s Lecture Schedule</CardTitle>
                <CardDescription className="text-xs">
                  Review room assignments, topics, and take attendance
                </CardDescription>
              </div>
              <Link href="/trainer/attendance">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Attendance Portal <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysClasses.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground">
                        {session.batchId.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-semibold">{session.title}</h4>
                      <StatusBadge status={session.status || "scheduled"} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {session.startTime} - {session.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {session.room}
                      </span>
                      <span>Module: {session.moduleId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/trainer/attendance?batch=${session.batchId}&class=${session.id}`}>
                      <Button size="sm" variant="outline" className="text-xs h-8">
                        <CheckSquare className="h-3 w-3 me-1 text-emerald-600" />
                        Mark Attendance
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Assigned Batches List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">My Assigned Cohorts</CardTitle>
              <CardDescription className="text-xs">
                Cohorts under your direct instruction for this academic term
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {batches.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-lg border bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold">{b.name}</h4>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {b.schedule?.startTime} - {b.schedule?.endTime} • {b.schedule?.days?.join(", ")}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-1 border-t">
                      <span className="text-muted-foreground">Enrolled Students:</span>
                      <span className="font-semibold">{b.enrolledSeats} / {b.totalSeats}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Link href={`/trainer/attendance?batch=${b.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs h-7">
                          Attendance
                        </Button>
                      </Link>
                      <Link href={`/trainer/results?batch=${b.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs h-7">
                          Results
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: At-Risk Students & Quick Shortcuts */}
        <div className="space-y-6">
          {/* At-Risk / Attention Required Students */}
          <Card className="border-amber-200 dark:border-amber-900/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <CardTitle className="text-sm font-bold">Students Needing Attention</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Rule-based alerts: Attendance below 75% threshold
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {lowAttendanceStudents.map((alert) => (
                <div
                  key={alert.student.id}
                  className="p-2.5 rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/30 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{alert.student.name}</span>
                    <span className="text-destructive font-bold">{alert.attendancePercentage}%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {alert.batchName} • {alert.classesAttended}/{alert.totalClasses} classes attended
                  </p>
                  <div className="pt-1 flex justify-end">
                    <Link href={`/trainer/attendance?batch=${alert.student.batchId}`}>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-medium">
                        View Attendance Log →
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Academic Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/trainer/assignments">
                <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  Create New Assignment
                </Button>
              </Link>
              <Link href="/trainer/quizzes">
                <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                  Build Interactive Quiz
                </Button>
              </Link>
              <Link href="/trainer/materials">
                <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                  Upload Course Materials
                </Button>
              </Link>
              <Link href="/trainer/results">
                <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                  <Award className="h-3.5 w-3.5 text-amber-600" />
                  Review Cohort Gradebook
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
