import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAssignmentById } from "@/lib/services/assignment-service";
import { getAssignmentStats } from "@/lib/services/submission-service";
import { batches } from "@/lib/data/batches";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  FileText, Calendar, Users, Award, ArrowLeft,
  CheckSquare, Clock, ExternalLink
} from "lucide-react";

export default async function TrainerAssignmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const assignment = getAssignmentById(id);
  if (!assignment) notFound();

  const stats = getAssignmentStats(assignment.id);
  const batch = batches.find((b) => b.id === assignment.batchId);

  return (
    <div className="space-y-6">
      {/* Back nav & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/trainer/assignments"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Assignments List
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/trainer/assignments/${assignment.id}/submissions`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs font-semibold">
              <CheckSquare className="h-4 w-4" />
              Open Grading Queue ({stats.pendingCount} to grade)
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground">
              {batch?.name || assignment.batchId}
            </span>
            <StatusBadge status={assignment.status || "published"} />
          </div>
          <CardTitle className="text-xl lg:text-2xl font-bold">
            {assignment.title}
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            {assignment.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              Deadline: {assignment.dueDate}
            </span>
            <span>Total Score: {assignment.totalMarks} Marks</span>
            <span>Submission Mode: {assignment.submissionType?.toUpperCase()}</span>
            <span>Published At: {assignment.publishedAt ? new Date(assignment.publishedAt).toLocaleDateString() : "Draft"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="text-center p-4">
          <p className="text-xs text-muted-foreground">Enrolled Students</p>
          <p className="text-2xl font-bold mt-1">{stats.totalEnrolled}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-muted-foreground">Submissions</p>
          <p className="text-2xl font-bold mt-1">{stats.submittedCount}</p>
        </Card>
        <Card className="text-center p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Pending Grade</p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">{stats.pendingCount}</p>
        </Card>
        <Card className="text-center p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Graded</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{stats.gradedCount}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-muted-foreground">Average Score</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {stats.averageScore > 0 ? `${stats.averageScore}/${assignment.totalMarks}` : "—"}
          </p>
        </Card>
      </div>

      {/* Instructions & Rubric */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Submission Guidelines & Rubric
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/40 p-4 border text-sm font-mono whitespace-pre-wrap leading-relaxed">
            {assignment.instructions || "No specific guidelines provided."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
