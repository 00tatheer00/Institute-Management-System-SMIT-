import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAssignments } from "@/lib/services/assignment-service";
import { getAssignmentStats } from "@/lib/services/submission-service";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  FileText, Calendar, Clock, Award, Users,
  CheckSquare, ArrowRight, ExternalLink
} from "lucide-react";

export default async function AdminAssignmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { data: allAssignments } = getAssignments({ pageSize: 50 });

  const totalPublished = allAssignments.filter((a) => a.isPublished).length;
  const totalDraft = allAssignments.filter((a) => !a.isPublished).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Assignments & Coursework"
        description="Oversee homework projects, code submissions, and trainer evaluation progress across all institute programs."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Assignments" },
        ]}
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Assignments</p>
          <p className="text-2xl font-bold text-foreground">{allAssignments.length}</p>
          <p className="text-xs text-muted-foreground">Across all curricula</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Active / Published</p>
          <p className="text-2xl font-bold text-emerald-600">{totalPublished}</p>
          <p className="text-xs text-muted-foreground">Currently open for submissions</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Draft Tasks</p>
          <p className="text-2xl font-bold text-amber-600">{totalDraft}</p>
          <p className="text-xs text-muted-foreground">Under preparation by faculty</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Programs Covered</p>
          <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
          <p className="text-xs text-muted-foreground">Web, App, AI & Design</p>
        </Card>
      </div>

      {/* Master Assignments Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Institutional Assignment Ledger ({allAssignments.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review assignment rubrics, submission metrics, and grading statuses
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Assignment Title</th>
                  <th className="py-3 px-4 font-semibold">Program</th>
                  <th className="py-3 px-4 font-semibold">Cohort</th>
                  <th className="py-3 px-4 font-semibold">Deadline</th>
                  <th className="py-3 px-4 font-semibold">Marks</th>
                  <th className="py-3 px-4 font-semibold">Submissions</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allAssignments.map((a) => {
                  const course = courses.find((c) => c.id === a.courseId);
                  const batch = batches.find((b) => b.id === a.batchId);
                  const stats = getAssignmentStats(a.id);

                  return (
                    <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {a.title}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {course?.name || a.courseId}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium">
                        {batch?.name || a.batchId}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono">
                        {a.dueDate}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">
                        {a.totalMarks} pts
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <span className="font-bold text-foreground">{stats.submittedCount}</span>
                        <span className="text-muted-foreground"> / {stats.totalEnrolled}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={a.status || "published"} />
                      </td>
                      <td className="py-3 px-4 text-end">
                        <Link href={`/trainer/assignments/${a.id}/submissions`}>
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Review Submissions
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
