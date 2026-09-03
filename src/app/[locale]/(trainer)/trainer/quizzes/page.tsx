"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { batches } from "@/lib/data/batches";
import { getTrainerQuizzes, createQuiz } from "@/lib/services/quiz-service";
import type { Quiz } from "@/lib/types";
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
  HelpCircle, Plus, Clock, Award, Calendar,
  ArrowRight, Settings, Users, BookOpen
} from "lucide-react";

export default function TrainerQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() =>
    getTrainerQuizzes("trainer-1")
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newBatchId, setNewBatchId] = useState("batch-1");
  const [newDuration, setNewDuration] = useState(30);
  const [newPassingMarks, setNewPassingMarks] = useState(30);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = createQuiz({
      title: newTitle,
      description: newDescription,
      courseId: "course-1",
      batchId: newBatchId,
      trainerId: "trainer-1",
      moduleId: "wd-m5",
      totalMarks: 50,
      duration: Number(newDuration) || 30,
      passingMarks: Number(newPassingMarks) || 30,
      date: new Date().toISOString().split("T")[0],
      status: "draft",
    });

    if (res.success && res.data) {
      setQuizzes([res.data, ...quizzes]);
      setIsCreateOpen(false);
      setNewTitle("");
      setNewDescription("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
            <HelpCircle className="h-3.5 w-3.5" />
            Evaluation Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Quiz Management & Builder</h1>
          <p className="text-sm text-muted-foreground">
            Author MCQ, True/False, and short answer assessments with automated grading
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2 font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Create New Quiz
        </Button>
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => {
          const batch = batches.find((b) => b.id === quiz.batchId);

          return (
            <Card key={quiz.id} className="hover:border-primary/40 transition-colors flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground">
                    {batch?.name || quiz.batchId}
                  </span>
                  <StatusBadge status={quiz.status} />
                </div>
                <CardTitle className="text-base font-bold line-clamp-1">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {quiz.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/40 text-center text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Duration</span>
                    <span className="font-bold">{quiz.duration} mins</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Questions</span>
                    <span className="font-bold">{quiz.totalQuestions} Qs</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Total Marks</span>
                    <span className="font-bold">{quiz.totalMarks} pts</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Link href={`/trainer/quizzes/${quiz.id}/builder`} className="flex-1">
                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 gap-1.5 font-semibold">
                      <Settings className="h-3.5 w-3.5" />
                      Manage Question Pool
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Modal Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Academic Quiz</DialogTitle>
            <DialogDescription>
              Initialize a new quiz container, set timing, and begin authoring questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Quiz Title *</label>
              <Input
                required
                placeholder="e.g. React 19 & Next.js 15 App Router Architecture"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Duration (Minutes) *</label>
                <Input
                  type="number"
                  min={5}
                  max={180}
                  required
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Passing Marks *</label>
                <Input
                  type="number"
                  min={5}
                  max={100}
                  required
                  value={newPassingMarks}
                  onChange={(e) => setNewPassingMarks(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Description / Syllabus Scope</label>
              <Textarea
                rows={3}
                placeholder="Topics covered in this assessment..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
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
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                Initialize Quiz
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
