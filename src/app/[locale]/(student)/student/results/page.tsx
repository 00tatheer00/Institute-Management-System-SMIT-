import { setRequestLocale } from "next-intl/server";
import { getStudentById } from "@/lib/data/students";
import { getCourseById } from "@/lib/data/courses";
import { getBatchById } from "@/lib/data/batches";
import { getStudentResults, calculateGrade } from "@/lib/services/result-service";
import { getStudentAcademicProgress } from "@/lib/services/academic-progress-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award, FileText, Download, CheckCircle2,
  Calendar, Layers, Printer
} from "lucide-react";

export default async function StudentResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Student 1 (Muhammad Khan)
  const student = getStudentById("student-1");
  const course = getCourseById(student?.courseId || "course-1");
  const batch = getBatchById(student?.batchId || "batch-1");
  const results = getStudentResults("student-1");
  const progress = getStudentAcademicProgress("student-1");

  const totalPossible = results.reduce((sum, r) => sum + r.totalMarks, 0);
  const totalObtained = results.reduce((sum, r) => sum + r.obtainedMarks, 0);
  const aggregatePercentage = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 90;
  const gradeDef = calculateGrade(aggregatePercentage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
            <Award className="h-3.5 w-3.5" />
            Official Academic Record
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Grade Transcript & Results</h1>
          <p className="text-sm text-muted-foreground">
            Certified evaluation scores, continuous assessment grades, and GPA calculations
          </p>
        </div>
      </div>

      {/* Transcript Header Dossier Card */}
      <Card className="border-purple-200 dark:border-purple-900/40 bg-gradient-to-br from-purple-50/30 to-background dark:from-purple-950/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                Official Student Transcript
              </span>
              <h2 className="text-xl font-bold text-foreground">
                {student?.name || "Muhammad Khan"}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>Roll No: <strong className="text-foreground">{student?.registrationId}</strong></span>
                <span>Program: <strong className="text-foreground">{course?.name}</strong></span>
                <span>Cohort: <strong className="text-foreground">{batch?.name}</strong></span>
              </div>
            </div>

            {/* GPA Box */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border shadow-xs">
              <div className="text-center px-2">
                <span className="text-xs text-muted-foreground block">Cumulative GPA</span>
                <span className="text-2xl font-extrabold text-purple-600">
                  {gradeDef.gpaPoint.toFixed(1)}
                </span>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center px-2">
                <span className="text-xs text-muted-foreground block">Letter Grade</span>
                <span className="text-2xl font-extrabold text-emerald-600">
                  {gradeDef.grade}
                </span>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center px-2">
                <span className="text-xs text-muted-foreground block">Aggregate</span>
                <span className="text-2xl font-extrabold text-foreground">
                  {aggregatePercentage}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Continuous Assessment Breakdown</CardTitle>
          <CardDescription className="text-xs">
            Detailed performance across assignments, live quizzes, and semester examinations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Assessment Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Marks Obtained</th>
                  <th className="py-3 px-4 font-semibold">Percentage</th>
                  <th className="py-3 px-4 font-semibold">Grade</th>
                  <th className="py-3 px-4 font-semibold">Remarks</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {results.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {row.assessmentTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                        {row.assessmentType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {row.obtainedMarks} / {row.totalMarks}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      {row.percentage}%
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          row.grade === "A+" || row.grade === "A"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : row.grade === "B+" || row.grade === "B"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground italic">
                      {row.remarks || "—"}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
