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
import { StatusBadge } from "@/components/shared/status-badge";
import {
  GraduationCap, BookOpen, Clock, Calendar, CheckSquare,
  Award, ArrowRight, AlertCircle, FileText, CheckCircle2,
  ChevronRight, MapPin
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
    <div className="space-y-6">
      {/* Student Welcome Hero */}
      <div className="rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-800 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur-xs mb-2">
              <GraduationCap className="h-3.5 w-3.5" />
              Student Academic Workspace
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Welcome back, {student.name}
            </h1>
            <p className="text-sm text-blue-100 mt-1 max-w-xl">
              Enrolled in <span className="font-semibold text-white">{course?.name}</span> • Cohort {batch?.name}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link href="/student/assignments">
              <Button variant="secondary" className="bg-white text-blue-900 hover:bg-white/90 gap-1.5 font-semibold text-xs shadow-sm">
                <FileText className="h-3.5 w-3.5 text-blue-700" />
                View Assignments
              </Button>
            </Link>
            <Link href="/student/progress">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-1.5 text-xs">
                <Award className="h-3.5 w-3.5" />
                Academic Progress
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress & Attendance Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Course Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Course Progress
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{progress.overallProgressPercentage}%</div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress.overallProgressPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Module 5 of 6 in progress
            </p>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Attendance Standing
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-emerald-600">{attendance.percentage}%</div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${attendance.percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              ✓ Satisfies 75% minimum threshold
            </p>
          </CardContent>
        </Card>

        {/* Current Standing / GPA */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Academic Grade
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {progress.letterGrade} ({progress.currentGpa.toFixed(1)} GPA)
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Assignment & Quiz aggregate
            </p>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Assessments
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {assignments.length + quizzes.filter((q) => q.status === "open").length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Open tasks and live assessments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Class & Pending Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Lecture Session */}
          {upcomingClass && (
            <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Next Scheduled Lecture
                  </span>
                  <StatusBadge status={upcomingClass.status || "scheduled"} />
                </div>
                <CardTitle className="text-base font-bold">
                  {upcomingClass.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {upcomingClass.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t pt-2">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" /> {upcomingClass.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {upcomingClass.startTime} - {upcomingClass.endTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {upcomingClass.room}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending / Active Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">My Assignments</CardTitle>
                <CardDescription className="text-xs">
                  Review deadlines and submit your coursework
                </CardDescription>
              </div>
              <Link href="/student/assignments">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments.slice(0, 3).map((asgn) => (
                <div
                  key={asgn.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold">{asgn.title}</h4>
                      <StatusBadge status={asgn.status || "published"} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Clock className="h-3 w-3 text-blue-600" /> Due: {asgn.dueDate}
                      </span>
                      <span>Total: {asgn.totalMarks} Marks</span>
                    </div>
                  </div>

                  <Link href={`/student/assignments/${asgn.id}`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-semibold">
                      Submit Work
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Available Quizzes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Interactive Quizzes</CardTitle>
                <CardDescription className="text-xs">
                  Assessments with immediate grading and performance feedback
                </CardDescription>
              </div>
              <Link href="/student/quizzes">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Quiz Center <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold">{quiz.title}</h4>
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
                      className={quiz.status === "open" ? "bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 font-semibold" : "text-xs h-8"}
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Recent Grades</CardTitle>
              <CardDescription className="text-xs">
                Verified evaluation marks from faculty
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.map((res) => (
                <div
                  key={res.id}
                  className="p-3 rounded-lg border bg-muted/20 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="truncate max-w-[170px]">{res.assessmentTitle}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {res.grade} ({res.percentage}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                    <span className="uppercase font-mono">{res.assessmentType}</span>
                    <span>{res.obtainedMarks}/{res.totalMarks} pts</span>
                  </div>
                  {res.remarks && (
                    <p className="text-[11px] text-muted-foreground italic border-t pt-1">
                      &quot;{res.remarks}&quot;
                    </p>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <Link href="/student/results">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    View Full Grade Transcript →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Learning Shortcuts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Student Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/student/attendance">
                <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                  <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
                  My Attendance Timeline
                </Button>
              </Link>
              <Link href="/student/progress">
                <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                  <Award className="h-3.5 w-3.5 text-purple-600" />
                  Curriculum Module Roadmap
                </Button>
              </Link>
              <Link href="/student/materials">
                <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  Download Handouts & Slides
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
