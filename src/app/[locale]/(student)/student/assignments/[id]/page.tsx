"use client";

import { useState, use } from "react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getAssignmentById } from "@/lib/services/assignment-service";
import {
  getStudentSubmission,
  submitAssignment,
} from "@/lib/services/submission-service";
import type { AssignmentSubmission } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  ArrowLeft, Calendar, FileText, Upload, CheckCircle2,
  AlertCircle, ExternalLink, FileArchive, Award
} from "lucide-react";

export default function StudentAssignmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = use(params);
  const studentId = "student-1"; // Muhammad Khan
  const assignment = getAssignmentById(id);
  if (!assignment) notFound();

  const [submission, setSubmission] = useState<AssignmentSubmission | undefined>(() => {
    return getStudentSubmission(assignment.id, studentId);
  });

  const [submissionText, setSubmissionText] = useState(
    submission?.submissionText || ""
  );
  const [fileName, setFileName] = useState(submission?.fileName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() && !fileName.trim()) return;

    setIsSubmitting(true);
    const res = submitAssignment(assignment.id, studentId, {
      submissionText,
      fileName: fileName || "project-submission.zip",
      fileUrl: `https://storage.mhit.edu.pk/submissions/${studentId}/${fileName || "project-submission.zip"}`,
      fileSize: "2.1 MB",
    });

    setIsSubmitting(false);
    if (res.success && res.data) {
      setSubmission(res.data);
      setSuccessMessage("Your assignment has been submitted successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const isGraded = submission?.status === "graded";
  const isSubmitted = submission && (submission.status === "submitted" || submission.status === "late");

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/student/assignments"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Assignments
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{assignment.title}</h1>
          {submission ? (
            <StatusBadge status={submission.status} />
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              Not Submitted
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Calendar className="h-3.5 w-3.5 text-blue-600" /> Due: {assignment.dueDate}
          </span>
          <span>Total Marks: {assignment.totalMarks} Marks</span>
          <span>Module: {assignment.moduleId}</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Graded Feedback Card if Graded */}
      {isGraded && (
        <Card className="border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Award className="h-5 w-5" />
                <CardTitle className="text-base font-bold">Graded Assessment & Feedback</CardTitle>
              </div>
              <div className="text-end">
                <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  {submission.obtainedMarks}
                </span>
                <span className="text-xs text-muted-foreground">/{assignment.totalMarks} pts</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              Trainer Feedback:
            </p>
            <div className="p-3 rounded-lg bg-white/80 dark:bg-card/80 border border-emerald-200 dark:border-emerald-800/50 text-xs italic leading-relaxed text-foreground">
              &quot;{submission.feedback || "Good work!"}&quot;
            </div>
            <p className="text-[11px] text-muted-foreground">
              Graded on {submission.gradedAt ? new Date(submission.gradedAt).toLocaleDateString() : "Recent"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instructions & Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Instructions & Rubric</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/40 p-4 border text-sm font-mono whitespace-pre-wrap leading-relaxed">
            {assignment.instructions || assignment.description}
          </div>
        </CardContent>
      </Card>

      {/* Submission Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {isSubmitted ? "Your Submitted Work" : "Submit Your Assignment"}
          </CardTitle>
          <CardDescription className="text-xs">
            Provide links to your live deployment, GitHub repository, and any project notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                Submission Notes & Web / GitHub Repository Links *
              </label>
              <Textarea
                rows={4}
                required
                disabled={isGraded}
                placeholder="Paste your live URL, GitHub repo link, or explanatory notes..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                Attach Project Bundle (.zip, .pdf)
              </label>
              <div className="flex items-center gap-3">
                <Input
                  disabled={isGraded}
                  placeholder="e.g. portfolio-submission.zip"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {!isGraded && (
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 gap-1.5"
                >
                  <Upload className="h-4 w-4" />
                  {isSubmitted ? "Update Submission" : "Submit Coursework"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
