"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { batches } from "@/lib/data/batches";
import { courses } from "@/lib/data/courses";
import { getTrainerAssignments, createAssignment } from "@/lib/services/assignment-service";
import { getAssignmentStats } from "@/lib/services/submission-service";
import type { Assignment, AssignmentState } from "@/lib/types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText, Plus, Users, Calendar, ArrowRight, CheckCircle2,
  Clock, CheckSquare
} from "lucide-react";

export default function TrainerAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    getTrainerAssignments("trainer-1")
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newInstructions, setNewInstructions] = useState("");
  const [newBatchId, setNewBatchId] = useState("batch-1");
  const [newDueDate, setNewDueDate] = useState("2026-09-25");
  const [newTotalMarks, setNewTotalMarks] = useState(100);
  const [newSubmissionType, setNewSubmissionType] = useState<"file" | "link" | "text" | "all">("all");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = createAssignment({
      title: newTitle,
      description: newDescription,
      instructions: newInstructions,
      courseId: "course-1",
      batchId: newBatchId,
      trainerId: "trainer-1",
      moduleId: "wd-m5",
      dueDate: newDueDate,
      totalMarks: Number(newTotalMarks) || 100,
      submissionType: newSubmissionType,
      status: "published",
      isPublished: true,
    });

    if (res.success && res.data) {
      setAssignments([res.data, ...assignments]);
      setIsCreateOpen(false);
      // Reset
      setNewTitle("");
      setNewDescription("");
      setNewInstructions("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <FileText className="h-3.5 w-3.5" />
            Learning Management
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments Management</h1>
          <p className="text-sm text-muted-foreground">
            Create tasks, set grading rubrics, and review student code submissions
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Create New Assignment
        </Button>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const stats = getAssignmentStats(assignment.id);
          const batch = batches.find((b) => b.id === assignment.batchId);

          return (
            <Card key={assignment.id} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground">
                        {batch?.name || assignment.batchId}
                      </span>
                      <h3 className="text-base font-bold text-foreground">
                        {assignment.title}
                      </h3>
                      <StatusBadge status={assignment.status || "published"} />
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {assignment.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        Due: {assignment.dueDate}
                      </span>
                      <span>Total Marks: {assignment.totalMarks} pts</span>
                      <span>Type: {assignment.submissionType?.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Middle: Submission Stats Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center lg:px-4 lg:border-x">
                    <div className="p-2 rounded-lg bg-muted/50 min-w-[75px]">
                      <p className="text-[11px] text-muted-foreground">Submissions</p>
                      <p className="text-base font-bold text-foreground">
                        {stats.submittedCount}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 min-w-[75px]">
                      <p className="text-[11px] text-amber-700 dark:text-amber-400">To Grade</p>
                      <p className="text-base font-bold text-amber-700 dark:text-amber-400">
                        {stats.pendingCount}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 min-w-[75px]">
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Graded</p>
                      <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                        {stats.gradedCount}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col gap-2 justify-end">
                    <Link href={`/trainer/assignments/${assignment.id}/submissions`}>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 gap-1.5 font-semibold">
                        <CheckSquare className="h-3.5 w-3.5" />
                        Review Submissions ({stats.submittedCount})
                      </Button>
                    </Link>
                    <Link href={`/trainer/assignments/${assignment.id}`}>
                      <Button size="sm" variant="outline" className="w-full text-xs h-8">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Modal Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Academic Assignment</DialogTitle>
            <DialogDescription>
              Publish a new task with submission guidelines and scoring rubric for your batch.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Assignment Title *</label>
              <Input
                required
                placeholder="e.g. Next.js 15 Fullstack Dashboard Project"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Cohort Batch *</label>
                <Select
                  value={newBatchId}
                  onValueChange={(val: string | null) => {
                    if (val) setNewBatchId(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Submission Deadline *</label>
                <Input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Total Points / Marks *</label>
                <Input
                  type="number"
                  min={10}
                  max={500}
                  required
                  value={newTotalMarks}
                  onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Submission Type</label>
                <Select
                  value={newSubmissionType}
                  onValueChange={(val: string | null) => {
                    if (val) setNewSubmissionType(val as "file" | "link" | "text" | "all");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All (File, Link, Text)</SelectItem>
                    <SelectItem value="link">GitHub / Web Link</SelectItem>
                    <SelectItem value="file">File Upload (.zip, .pdf)</SelectItem>
                    <SelectItem value="text">Direct Text Submission</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Short Overview Description</label>
              <Textarea
                rows={2}
                placeholder="High-level description of what students are expected to build..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Detailed Instructions & Grading Rubric</label>
              <Textarea
                rows={4}
                placeholder="1. Semantic HTML requirements...&#10;2. Responsive layout criteria...&#10;3. Score breakdown..."
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Publish Assignment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
