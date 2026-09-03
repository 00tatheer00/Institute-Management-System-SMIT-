import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getQuizzes } from "@/lib/services/quiz-service";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  HelpCircle, Clock, Award, Users, BookOpen,
  Settings, CheckCircle2
} from "lucide-react";

export default async function AdminQuizzesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { data: allQuizzes } = getQuizzes({ pageSize: 50 });
  const activeQuizzes = allQuizzes.filter((q) => q.status === "open" || q.status === "published").length;
  const completedQuizzes = allQuizzes.filter((q) => q.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quizzes & Continuous Assessment"
        description="Monitor online examination pools, automated question grading, and cohort competency metrics."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Quizzes" },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Quizzes</p>
          <p className="text-2xl font-bold text-foreground">{allQuizzes.length}</p>
          <p className="text-xs text-muted-foreground">Authored assessments</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Currently Live</p>
          <p className="text-2xl font-bold text-purple-600">{activeQuizzes}</p>
          <p className="text-xs text-muted-foreground">Open for student submissions</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Completed</p>
          <p className="text-2xl font-bold text-emerald-600">{completedQuizzes}</p>
          <p className="text-xs text-muted-foreground">Fully scored & evaluated</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Security Engine</p>
          <p className="text-2xl font-bold text-blue-600">Active</p>
          <p className="text-xs text-muted-foreground">Answer key isolation enabled</p>
        </Card>
      </div>

      {/* Master Quiz Ledger */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Institutional Quiz Directory ({allQuizzes.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review question inventory, time constraints, and cohort examination readiness
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Quiz Title</th>
                  <th className="py-3 px-4 font-semibold">Program</th>
                  <th className="py-3 px-4 font-semibold">Cohort</th>
                  <th className="py-3 px-4 font-semibold">Questions</th>
                  <th className="py-3 px-4 font-semibold">Duration</th>
                  <th className="py-3 px-4 font-semibold">Passing Marks</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allQuizzes.map((q) => {
                  const course = courses.find((c) => c.id === q.courseId);
                  const batch = batches.find((b) => b.id === q.batchId);

                  return (
                    <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {q.title}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {course?.name || q.courseId}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium">
                        {batch?.name || q.batchId}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono">
                        {q.totalQuestions} Questions
                      </td>
                      <td className="py-3 px-4 text-xs font-mono">
                        {q.duration} mins
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">
                        {q.passingMarks || 25} / {q.totalMarks} pts
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="py-3 px-4 text-end">
                        <Link href={`/trainer/quizzes/${q.id}/builder`}>
                          <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                            <Settings className="h-3 w-3" /> Question Pool
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
