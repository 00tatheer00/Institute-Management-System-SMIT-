"use client";

import { useState, use } from "react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  getQuizById,
  addQuizQuestion,
  deleteQuizQuestion,
  publishQuiz,
  closeQuiz,
} from "@/lib/services/quiz-service";
import type { QuizQuestion, QuizQuestionType } from "@/lib/types";
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
  ArrowLeft, Plus, Trash2, CheckCircle2,
  HelpCircle, Settings, Award, Layers
} from "lucide-react";

export default function TrainerQuizBuilderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = use(params);
  // Pass isTrainer = true to load secret answer key in trainer builder!
  const quiz = getQuizById(id, true);
  if (!quiz) notFound();

  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz.questions || []);
  const [quizStatus, setQuizStatus] = useState(quiz.status);

  // Add Question Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [qType, setQType] = useState<QuizQuestionType>("multiple-choice");
  const [qText, setQText] = useState("");
  const [qMarks, setQMarks] = useState(10);
  const [qOptions, setQOptions] = useState<string[]>(["", "", "", ""]);
  const [qCorrectAnswer, setQCorrectAnswer] = useState("");

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;

    let finalOptions: string[] = [];
    if (qType === "multiple-choice") {
      finalOptions = qOptions.filter((opt) => opt.trim().length > 0);
    } else if (qType === "true-false") {
      finalOptions = ["True", "False"];
    }

    const res = addQuizQuestion(quiz.id, {
      question: qText,
      type: qType,
      options: finalOptions,
      correctAnswer: qCorrectAnswer,
      marks: Number(qMarks) || 10,
    });

    if (res.success && res.data) {
      setQuestions([...questions, res.data]);
      setIsAddOpen(false);
      // Reset
      setQText("");
      setQOptions(["", "", "", ""]);
      setQCorrectAnswer("");
    }
  };

  const handleDelete = (questionId: string) => {
    deleteQuizQuestion(quiz.id, questionId);
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleTogglePublish = () => {
    if (quizStatus === "open") {
      closeQuiz(quiz.id);
      setQuizStatus("closed");
    } else {
      publishQuiz(quiz.id);
      setQuizStatus("open");
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/trainer/quizzes"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Quizzes
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
            <StatusBadge status={quizStatus} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {questions.length} Questions • {totalPoints} Total Marks • {quiz.duration} Minutes Duration
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleTogglePublish}
            className="text-xs h-9"
          >
            {quizStatus === "open" ? "Close Quiz" : "Publish Quiz (Make Live)"}
          </Button>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2 text-xs font-semibold shadow-xs h-9"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <Card key={q.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs uppercase font-semibold text-muted-foreground px-2 py-0.5 bg-muted rounded">
                      {q.type}
                    </span>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                      {q.marks} pts
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground pt-1">
                    {q.question}
                  </h3>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(q.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = opt === q.correctAnswer;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-md text-xs flex items-center justify-between border ${
                          isCorrect
                            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold"
                            : "bg-muted/40 border-border text-foreground"
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && (
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {q.type === "short-answer" && (
                <div className="mt-2 p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="font-semibold">Expected Correct Keyword: </span>
                  <span className="font-mono">{q.correctAnswer}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {questions.length === 0 && (
          <Card className="p-12 text-center text-muted-foreground border-dashed">
            <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm font-semibold">No questions added yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click &quot;Add Question&quot; above to create MCQs, True/False, or Short Answer items.
            </p>
          </Card>
        )}
      </div>

      {/* Add Question Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Assessment Question</DialogTitle>
            <DialogDescription>
              Formulate your prompt, designate the correct answer key, and assign point weight.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddQuestion} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Question Type</label>
                <Select
                  value={qType}
                  onValueChange={(val: string | null) => {
                    if (val) {
                      setQType(val as QuizQuestionType);
                      setQCorrectAnswer("");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice (MCQ)</SelectItem>
                    <SelectItem value="true-false">True / False</SelectItem>
                    <SelectItem value="short-answer">Short Answer Keyword</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Points / Marks</label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={qMarks}
                  onChange={(e) => setQMarks(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Question Text *</label>
              <Textarea
                required
                rows={3}
                placeholder="e.g. Which CSS property is used to align items along the cross axis in Flexbox?"
                value={qText}
                onChange={(e) => setQText(e.target.value)}
              />
            </div>

            {/* Options based on Type */}
            {qType === "multiple-choice" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold">Answer Choices</label>
                {qOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-6">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <Input
                      placeholder={`Choice ${idx + 1}...`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...qOptions];
                        copy[idx] = e.target.value;
                        setQOptions(copy);
                      }}
                      className="h-8 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant={qCorrectAnswer === opt && opt ? "default" : "outline"}
                      className={
                        qCorrectAnswer === opt && opt
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 shrink-0"
                          : "text-xs h-8 shrink-0"
                      }
                      onClick={() => setQCorrectAnswer(opt)}
                    >
                      {qCorrectAnswer === opt && opt ? "Correct Key" : "Set Correct"}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {qType === "true-false" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Correct Answer *</label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={qCorrectAnswer === "True" ? "default" : "outline"}
                    className={qCorrectAnswer === "True" ? "bg-emerald-600 text-white" : ""}
                    onClick={() => setQCorrectAnswer("True")}
                  >
                    True
                  </Button>
                  <Button
                    type="button"
                    variant={qCorrectAnswer === "False" ? "default" : "outline"}
                    className={qCorrectAnswer === "False" ? "bg-emerald-600 text-white" : ""}
                    onClick={() => setQCorrectAnswer("False")}
                  >
                    False
                  </Button>
                </div>
              </div>
            )}

            {qType === "short-answer" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Correct Answer Keyword *</label>
                <Input
                  required
                  placeholder="e.g. alt, async, await"
                  value={qCorrectAnswer}
                  onChange={(e) => setQCorrectAnswer(e.target.value)}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                Save Question to Quiz
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
