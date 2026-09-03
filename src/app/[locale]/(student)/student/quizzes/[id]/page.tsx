"use client";

import { useState, useEffect, use } from "react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  getQuizById,
  submitQuizAttempt,
  getStudentQuizAttempt,
} from "@/lib/services/quiz-service";
import type { Quiz, QuizQuestion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Clock, ArrowLeft, ArrowRight, CheckCircle2,
  AlertTriangle, Award, ShieldAlert, CheckSquare
} from "lucide-react";

export default function StudentQuizTakingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = use(params);
  const studentId = "student-1"; // Muhammad Khan

  // Fetch sanitized quiz (isTrainer = false guarantees correctAnswer is NOT exposed!)
  const quiz = getQuizById(id, false);
  if (!quiz) notFound();

  // Check if previously completed
  const existingAttempt = getStudentQuizAttempt(quiz.id, studentId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(!!existingAttempt);
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    totalMarks: number;
    percentage: number;
    isPassing: boolean;
  } | null>(
    existingAttempt
      ? {
          score: existingAttempt.score || 0,
          totalMarks: existingAttempt.totalMarks,
          percentage: existingAttempt.percentage || 0,
          isPassing: (existingAttempt.percentage || 0) >= ((quiz.passingMarks || 25) / quiz.totalMarks) * 100,
        }
      : null
  );

  // Timer: 20 minutes countdown
  const [timeLeft, setTimeLeft] = useState<number>(quiz.duration * 60);

  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const questions: QuizQuestion[] = quiz.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = () => {
    if (isSubmitted) return;

    const res = submitQuizAttempt(quiz.id, studentId, answers);
    if (res.success && res.data) {
      setSubmissionResult(res.data);
      setIsSubmitted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Bar with Timer */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/quizzes"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Exit to Quizzes
        </Link>

        {!isSubmitted && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold">
            <Clock className="h-3.5 w-3.5 animate-pulse text-amber-600" />
            Time Remaining: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Result Display Card if Completed */}
      {isSubmitted && submissionResult && (
        <Card className="border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 text-center p-6 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Assessment Completed
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Your score has been verified and registered in your academic gradebook.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto p-3 rounded-lg bg-card border text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px]">Score</span>
              <span className="text-lg font-extrabold text-foreground">
                {submissionResult.score} / {submissionResult.totalMarks}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Percentage</span>
              <span className="text-lg font-extrabold text-emerald-600">
                {submissionResult.percentage}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Status</span>
              <span
                className={`text-sm font-bold block mt-1 ${
                  submissionResult.isPassing ? "text-emerald-600" : "text-destructive"
                }`}
              >
                {submissionResult.isPassing ? "PASSED" : "FAILED"}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/student/results">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
                View in Grade Transcript →
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Live Question Card */}
      {!isSubmitted && currentQuestion && (
        <Card className="shadow-sm">
          {/* Stepper Header */}
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span className="font-semibold uppercase text-purple-600 tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span>{currentQuestion.marks} Points</span>
            </div>

            <CardTitle className="text-base font-bold leading-snug">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Options */}
            {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestion.id] === opt;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAnswer(currentQuestion.id, opt)}
                      className={`w-full p-3.5 rounded-lg border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-purple-50 dark:bg-purple-950/40 border-purple-600 text-purple-900 dark:text-purple-200 font-semibold shadow-xs"
                          : "bg-card hover:bg-muted/50 border-border text-foreground"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "true-false" && (
              <div className="grid grid-cols-2 gap-3">
                {["True", "False"].map((choice) => {
                  const isSelected = answers[currentQuestion.id] === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleSelectAnswer(currentQuestion.id, choice)}
                      className={`p-4 rounded-lg border text-center font-bold text-sm transition-all ${
                        isSelected
                          ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                          : "bg-card hover:bg-muted/50 border-border text-foreground"
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "short-answer" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Type your answer keyword below:
                </label>
                <Input
                  placeholder="e.g. alt, async, await..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                  className="h-10 text-sm font-mono"
                />
              </div>
            )}

            {/* Navigation Stepper Controls */}
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="text-xs h-9"
              >
                Previous Question
              </Button>

              <div className="flex items-center gap-1.5">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? "w-6 bg-purple-600"
                        : answers[q.id]
                        ? "w-2.5 bg-emerald-500"
                        : "w-2.5 bg-muted"
                    }`}
                    title={`Question ${idx + 1}`}
                  />
                ))}
              </div>

              {currentIndex < questions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 font-semibold"
                >
                  Next Question
                  <ArrowRight className="h-3.5 w-3.5 ms-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleSubmitQuiz}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 font-bold shadow-xs"
                >
                  <CheckSquare className="h-3.5 w-3.5 me-1" />
                  Submit Assessment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
