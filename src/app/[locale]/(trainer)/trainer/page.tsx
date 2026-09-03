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

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Assigned Batches
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active cohorts in Web Development
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Classes Today
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysClasses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lab A & Lab B scheduled
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Submissions Awaiting Grade
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {totalPendingGrading}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires evaluation & feedback
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cohort Pass Rate
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-teal-100 dark:bg-teal-950/50 flex items-center justify-center text-teal-600">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {batch1Metrics.passRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on midterms & assessments
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
