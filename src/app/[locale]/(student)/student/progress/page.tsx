import { setRequestLocale } from "next-intl/server";
import { getStudentAcademicProgress } from "@/lib/services/academic-progress-service";
import { getCourseById } from "@/lib/data/courses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  CheckCircle2, Clock, AlertTriangle, BookOpen,
  Award, CheckSquare, Layers, ShieldCheck
} from "lucide-react";

export default async function StudentProgressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Student 1 (Muhammad Khan)
  const progress = getStudentAcademicProgress("student-1");
  const course = getCourseById(progress.courseId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <Award className="h-3.5 w-3.5" />
          Academic Milestone Tracking
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Curriculum & Academic Progress</h1>
        <p className="text-sm text-muted-foreground">
          Track syllabus module completion, attendance thresholds, and graduation readiness
        </p>
      </div>

      {/* At-Risk or Good-Standing Banner */}
      {progress.atRisk?.isAtRisk ? (
        <Card className="border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <h4 className="font-bold text-amber-900 dark:text-amber-200">
                Academic Attention Required
              </h4>
              <ul className="list-disc list-inside text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                {progress.atRisk.reasons.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/10">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-sm">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                Good Academic Standing:
              </span>{" "}
              <span className="text-xs text-muted-foreground">
                You are on track across attendance, assignment submissions, and quiz passing scores!
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* High-Level Progress Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Curriculum Covered
            </span>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {progress.overallProgressPercentage}%
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress.overallProgressPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Based on completed module lecture hours
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Assignment Completion
            </span>
            <CheckSquare className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {progress.assignmentCompletionRate}%
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${progress.assignmentCompletionRate}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Coursework submitted on time
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Attendance Health
            </span>
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600">
            {progress.attendanceRate}%
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${progress.attendanceRate}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Min requirement for certificate: 75%
          </p>
        </Card>
      </div>

      {/* Curriculum Module Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {course?.name || "Web Development"} — Module Roadmap
          </CardTitle>
          <CardDescription className="text-xs">
            Step-by-step curriculum milestones and mastery progression
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {progress.modules.map((m, idx) => {
            const pct = Math.round((m.completedHours / m.totalHours) * 100);

            return (
              <div
                key={m.moduleId}
                className="p-4 rounded-xl border bg-card hover:bg-muted/20 transition-colors space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                        m.isCompleted
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : pct > 0
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {m.moduleName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {m.completedHours} of {m.totalHours} hours completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs font-extrabold text-foreground">{pct}%</span>
                    {m.isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                      </span>
                    ) : pct > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                        <Clock className="h-3.5 w-3.5" /> In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      m.isCompleted ? "bg-emerald-600" : "bg-blue-600"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
