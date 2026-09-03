import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getStudentById } from "@/lib/data/students";
import { getCourseById } from "@/lib/data/courses";
import { getBatchById } from "@/lib/data/batches";
import { initialClasses } from "@/lib/data/classes";
import { getStudentAssignments } from "@/lib/services/assignment-service";
import { getStudentQuizzes } from "@/lib/services/quiz-service";
import { getStudentResults } from "@/lib/services/result-service";
import { getStudentAcademicProgress } from "@/lib/services/academic-progress-service";
import { getStudentAttendanceSummary } from "@/lib/services/attendance-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  GraduationCap, BookOpen, Clock, Calendar, CheckSquare,
  Award, ArrowRight, AlertCircle, FileText, CheckCircle2,
  ChevronRight, MapPin, Sparkles, Zap, ArrowUpRight
} from "lucide-react";

export default async function StudentDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Student 1 (Muhammad Khan) Demo Account
  const student = getStudentById("student-1") || {
    id: "student-1",
    name: "Muhammad Khan",
    registrationId: "MH-C1-2026-0001",
    courseId: "course-1",
    batchId: "batch-1",
    attendancePercentage: 88,
  };

  const course = getCourseById(student.courseId);
  const batch = getBatchById(student.batchId);
  const progress = getStudentAcademicProgress(student.id);
  const attendance = getStudentAttendanceSummary(student.id);
  const assignments = getStudentAssignments(student.batchId);
  const quizzes = getStudentQuizzes(student.batchId);
  const results = getStudentResults(student.id).slice(0, 4);

  // Today / upcoming class for this student's batch
  const upcomingClass = initialClasses.find(
    (c) => c.batchId === student.batchId && (!c.isCompleted || c.status === "scheduled" || c.status === "in-progress")
  ) || initialClasses[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Student Welcome Hero ─── */}
      <div className="relative overflow-hidden rounded-2xl gradient-mesh p-6 sm:p-8 text-white shadow-depth">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="hero-shape hero-shape-1 opacity-20 pointer-events-none" />
        <div className="hero-shape hero-shape-2 opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/15">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Student Academic Hub</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 font-mono text-[11px]">{student.registrationId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {student.name}
            </h1>
            <p className="text-sm text-white/80 max-w-xl leading-relaxed">
              Enrolled in <span className="font-bold text-white underline decoration-brand underline-offset-4">{course?.name}</span> • Cohort <span className="font-semibold text-white">{batch?.name}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link href="/student/assignments">
              <Button size="sm" className="bg-white text-blue-900 hover:bg-white/90 gap-1.5 font-bold text-xs shadow-md transition-all duration-200 hover:scale-105">
                <FileText className="h-3.5 w-3.5 text-blue-700" />
                View Assignments
              </Button>
            </Link>
            <Link href="/student/progress">
              <Button size="sm" variant="outline" className="border-white/25 text-white hover:bg-white/10 gap-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105">
                <Award className="h-3.5 w-3.5" />
                Academic Standing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Progress & Attendance Metrics Bar (Apple UI Soft Light Gradients) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Course Progress */}
        <Card className="rounded-2xl border border-sky-200/70 dark:border-sky-800/40 bg-gradient-to-br from-sky-500/10 via-white to-blue-500/5 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-slate-900 shadow-xs hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Course Progress
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-sky-500/15 text-[#0071e3] dark:text-sky-400 flex items-center justify-center ring-1 ring-sky-500/20 shadow-2xs">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-sans">{progress.overallProgressPercentage}%</div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0071e3] to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress.overallProgressPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Module 5 of 6 in progress
            </p>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900 shadow-xs hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Attendance Standing
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20 shadow-2xs">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 font-sans">{attendance.percentage}%</div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${attendance.percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              ✓ Satisfies 75% minimum threshold
            </p>
          </CardContent>
        </Card>

        {/* Current Standing / GPA */}
        <Card className="rounded-2xl border border-purple-200/70 dark:border-purple-800/40 bg-gradient-to-br from-purple-500/10 via-white to-violet-500/5 dark:from-purple-950/40 dark:via-slate-900/60 dark:to-slate-900 shadow-xs hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Academic Grade
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center ring-1 ring-purple-500/20 shadow-2xs">
              <Award className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-purple-700 dark:text-purple-400 font-sans">
              {progress.letterGrade} <span className="text-sm font-semibold text-slate-400 font-mono">({progress.currentGpa.toFixed(1)} GPA)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
              Assignment &amp; Quiz aggregate
            </p>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card className="rounded-2xl border border-amber-200/70 dark:border-amber-800/40 bg-gradient-to-br from-amber-500/10 via-white to-orange-500/5 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-slate-900 shadow-xs hover-lift transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Assessments
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-1 ring-amber-500/20 shadow-2xs">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400 font-sans">
              {assignments.length + quizzes.filter((q) => q.status === "open").length}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
              Open tasks and live assessments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Class, Assignments & Quizzes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Lecture Session */}
          {/* Next Lecture Session (Apple UI Soft Light Gradient) */}
          {upcomingClass && (
            <Card className="rounded-2xl border border-sky-200/70 dark:border-sky-800/40 bg-gradient-to-br from-sky-500/10 via-white to-blue-500/5 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-slate-900 shadow-xs hover-lift overflow-hidden relative">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#0071e3] to-blue-500" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0071e3] dark:text-sky-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                    </span>
                    Next Scheduled Lecture
                  </span>
                  <StatusBadge status={upcomingClass.status || "scheduled"} />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {upcomingClass.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {upcomingClass.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
                  <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Calendar className="h-4 w-4 text-[#0071e3]" /> {upcomingClass.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" /> {upcomingClass.startTime} - {upcomingClass.endTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" /> Room: <span className="font-bold text-slate-900 dark:text-white">{upcomingClass.room}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending / Active Assignments */}
          <Card className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-br from-slate-50/80 via-white to-slate-50/40 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-slate-950 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">My Assignments</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Review deadlines and submit your coursework
                </CardDescription>
              </div>
              <Link href="/student/assignments">
                <Button variant="ghost" size="sm" className="text-xs gap-1 hover:bg-[#0071e3]/10 text-[#0071e3] font-bold rounded-xl">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments.slice(0, 3).map((asgn) => (
                <div
                  key={asgn.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/60 bg-card hover:shadow-sm hover:border-brand/30 transition-all duration-200 gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold group-hover:text-brand transition-colors">{asgn.title}</h4>
                      <StatusBadge status={asgn.status || "published"} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Clock className="h-3.5 w-3.5 text-blue-600" /> Due: {asgn.dueDate}
                      </span>
                      <span>•</span>
                      <span>Total: {asgn.totalMarks} Marks</span>
                    </div>
                  </div>

                  <Link href={`/student/assignments/${asgn.id}`}>
                    <Button size="sm" variant="glow" className="text-xs h-8 font-semibold shadow-xs">
                      Submit Work
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Available Quizzes */}
          <Card className="border-0 shadow-float">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Interactive Quizzes</CardTitle>
                <CardDescription className="text-xs">
                  Assessments with immediate grading and performance feedback
                </CardDescription>
              </div>
              <Link href="/student/quizzes">
                <Button variant="ghost" size="sm" className="text-xs gap-1 hover:bg-brand/5">
                  Quiz Center <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/60 bg-card hover:shadow-sm hover:border-purple-300 transition-all duration-200 gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold group-hover:text-purple-600 transition-colors">{quiz.title}</h4>
                      <StatusBadge status={quiz.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {quiz.duration} mins • {quiz.totalQuestions} questions • Passing: {quiz.passingMarks} pts
                    </p>
                  </div>

                  <Link href={`/student/quizzes/${quiz.id}`}>
                    <Button
                      size="sm"
                      variant={quiz.status === "open" ? "default" : "outline"}
                      className={quiz.status === "open" ? "bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 font-semibold shadow-sm" : "text-xs h-8"}
                    >
                      {quiz.status === "open" ? "Start Quiz Now" : "View Details"}
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Results & Quick Shortcuts */}
        <div className="space-y-6">
          {/* Recent Assessment Results */}
          <Card className="border-0 shadow-float hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Recent Grades</CardTitle>
              <CardDescription className="text-xs">
                Verified evaluation marks from faculty
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2 text-xs hover:border-brand/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="truncate max-w-[170px] text-foreground">{res.assessmentTitle}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60">
                      {res.grade} ({res.percentage}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                    <span className="uppercase font-mono tracking-wider font-semibold">{res.assessmentType}</span>
                    <span className="font-medium">{res.obtainedMarks}/{res.totalMarks} pts</span>
                  </div>
                  {res.remarks && (
                    <p className="text-[11px] text-muted-foreground italic border-t border-border/50 pt-1.5">
                      &ldquo;{res.remarks}&rdquo;
                    </p>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <Link href="/student/results">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8.5 font-medium hover:shadow-xs transition-all">
                    View Full Grade Transcript →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Learning & Operations Shortcuts */}
          <Card className="border-0 shadow-float hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Essential Shortcuts</CardTitle>
              <CardDescription className="text-xs">Direct module access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/student/projects">
                <Button variant="outline" className="w-full justify-start text-xs h-9.5 gap-2.5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                  <div className="h-6 w-6 rounded-md bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  My Academic Projects
                </Button>
              </Link>
              <Link href="/student/certificates">
                <Button variant="outline" className="w-full justify-start text-xs h-9.5 gap-2.5 hover:border-amber-300 hover:bg-amber-50/30 transition-all">
                  <div className="h-6 w-6 rounded-md bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  Earned Certificates &amp; Eligibility
                </Button>
              </Link>
              <Link href="/student/documents">
                <Button variant="outline" className="w-full justify-start text-xs h-9.5 gap-2.5 hover:border-teal-300 hover:bg-teal-50/30 transition-all">
                  <div className="h-6 w-6 rounded-md bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  Verification Documents Vault
                </Button>
              </Link>
              <Link href="/student/support">
                <Button variant="outline" className="w-full justify-start text-xs h-9.5 gap-2.5 hover:border-rose-300 hover:bg-rose-50/30 transition-all">
                  <div className="h-6 w-6 rounded-md bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                  </div>
                  Student Helpdesk &amp; Support
                </Button>
              </Link>
              <Link href="/student/feedback">
                <Button variant="outline" className="w-full justify-start text-xs h-9.5 gap-2.5 hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                  <div className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  Course &amp; Trainer Feedback
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
