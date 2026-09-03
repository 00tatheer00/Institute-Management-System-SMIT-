"use client";

import { useState, useMemo, use } from "react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getAssignmentById } from "@/lib/services/assignment-service";
import {
  getSubmissions,
  gradeSubmission,
  type AssignmentSubmissionStats,
} from "@/lib/services/submission-service";
import { students } from "@/lib/data/students";
import type { AssignmentSubmission } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft, CheckSquare, Search, ExternalLink,
  FileArchive, Clock, CheckCircle2, AlertTriangle
} from "lucide-react";

export default function TrainerAssignmentSubmissionsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = use(params);
  const assignment = getAssignmentById(id);
  if (!assignment) notFound();

  // Load initial submissions
  const [submissionList, setSubmissionList] = useState<AssignmentSubmission[]>(() => {
    return getSubmissions(assignment.id, { pageSize: 100 }).data;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Grading Modal State
  const [gradingSub, setGradingSub] = useState<AssignmentSubmission | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(100);
  const [gradeFeedback, setGradeFeedback] = useState<string>("");
  const [gradeError, setGradeError] = useState<string | null>(null);

  const openGradingModal = (sub: AssignmentSubmission) => {
    setGradingSub(sub);
    setGradeMarks(sub.obtainedMarks ?? assignment.totalMarks);
    setGradeFeedback(sub.feedback || "");
    setGradeError(null);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;

    if (gradeMarks < 0 || gradeMarks > assignment.totalMarks) {
      setGradeError(`Marks must be between 0 and ${assignment.totalMarks}`);
      return;
    }

    const res = gradeSubmission(
      gradingSub.id,
      gradeMarks,
      gradeFeedback,
      "trainer-1"
    );

    if (res.success && res.data) {
      setSubmissionList((prev) =>
        prev.map((s) => (s.id === gradingSub.id ? res.data! : s))
      );
      setGradingSub(null);
    } else {
      setGradeError(res.error || "Failed to save grade");
    }
  };

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissionList.filter((sub) => {
      const student = students.find((s) => s.id === sub.studentId);
      const studentName = student?.name.toLowerCase() || "";
      const regId = student?.registrationId.toLowerCase() || "";
      const q = searchQuery.toLowerCase();

      const matchesSearch = !q || studentName.includes(q) || regId.includes(q);
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "pending" && (sub.status === "submitted" || sub.status === "late")) ||
        sub.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [submissionList, searchQuery, filterStatus]);

  const activeGradingStudent = gradingSub
    ? students.find((s) => s.id === gradingSub.studentId)
    : null;

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/trainer/assignments/${assignment.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {assignment.title}
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Review Submissions
          </h1>
          <p className="text-sm text-muted-foreground">
            Total Marks: {assignment.totalMarks} • Due: {assignment.dueDate}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <Button
                size="sm"
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                className="text-xs h-8"
              >
                All ({submissionList.length})
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
                className="text-xs h-8"
              >
                Pending Grade
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "graded" ? "default" : "outline"}
                onClick={() => setFilterStatus("graded")}
                className="text-xs h-8"
              >
                Graded
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "late" ? "default" : "outline"}
                onClick={() => setFilterStatus("late")}
                className="text-xs h-8"
              >
                Late Submissions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Submissions ({filteredSubmissions.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review student code, examine deployment links, and assign grades
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y border-t">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub, idx) => {
                const student = students.find((s) => s.id === sub.studentId);

                return (
                  <div
                    key={sub.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-4"
                  >
                    {/* Student Info */}
                    <div className="space-y-1 min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {student?.name || "Student"}
                        </span>
                        <StatusBadge status={sub.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {student?.registrationId} • Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Submission text / links preview */}
                    <div className="flex-1 max-w-xl text-xs space-y-1.5">
                      <p className="text-foreground/80 line-clamp-2 bg-muted/40 p-2 rounded-md font-mono">
                        {sub.submissionText || "No written notes attached."}
                      </p>
                      {sub.fileName && (
                        <div className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                          <FileArchive className="h-3.5 w-3.5" />
                          <span>{sub.fileName}</span>
                          <span className="text-muted-foreground">({sub.fileSize})</span>
                        </div>
                      )}
                    </div>

                    {/* Score & Grading Action */}
                    <div className="flex items-center gap-4 lg:ps-4">
                      <div className="text-end min-w-[80px]">
                        {sub.status === "graded" ? (
                          <div>
                            <span className="text-lg font-bold text-emerald-600">
                              {sub.obtainedMarks}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              /{assignment.totalMarks}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md">
                            Pending Grade
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant={sub.status === "graded" ? "outline" : "default"}
                        className={
                          sub.status === "graded"
                            ? "text-xs h-8"
                            : "bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-semibold"
                        }
                        onClick={() => openGradingModal(sub)}
                      >
                        <CheckSquare className="h-3.5 w-3.5 me-1" />
                        {sub.status === "graded" ? "Edit Grade" : "Grade Submission"}
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No submissions found matching criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Grading Modal */}
      <Dialog open={!!gradingSub} onOpenChange={(open) => !open && setGradingSub(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Grade Submission — {activeGradingStudent?.name}
            </DialogTitle>
            <DialogDescription>
              {activeGradingStudent?.registrationId} • Max Marks: {assignment.totalMarks}
            </DialogDescription>
          </DialogHeader>

          {gradingSub && (
            <form onSubmit={handleSaveGrade} className="space-y-4 pt-2">
              {/* Submission content preview */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Student Submission Content
                </label>
                <div className="p-3 rounded-lg bg-muted/60 text-xs font-mono whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {gradingSub.submissionText || "No submission text provided."}
                </div>
                {gradingSub.fileName && (
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                    <FileArchive className="h-3.5 w-3.5" /> Attached: {gradingSub.fileName}
                  </p>
                )}
              </div>

              {/* Marks input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">
                  Obtained Marks (0 – {assignment.totalMarks}) *
                </label>
                <Input
                  type="number"
                  min={0}
                  max={assignment.totalMarks}
                  required
                  value={gradeMarks}
                  onChange={(e) => {
                    setGradeError(null);
                    setGradeMarks(Number(e.target.value));
                  }}
                  className="font-bold text-base"
                />
              </div>

              {/* Feedback */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">
                  Trainer Feedback & Recommendations
                </label>
                <Textarea
                  rows={4}
                  placeholder="Provide constructive feedback, highlighting strong areas and suggested improvements..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                />
              </div>

              {gradeError && (
                <div className="p-2.5 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{gradeError}</span>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGradingSub(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Save & Publish Grade
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
