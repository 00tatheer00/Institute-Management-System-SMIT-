"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { getStudentQuizzes, getStudentQuizAttempt } from "@/lib/services/quiz-service";
import type { Quiz } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  HelpCircle, Clock, Award, CheckCircle2,
  AlertCircle, ArrowRight, BookOpen
} from "lucide-react";

export default function StudentQuizzesPage() {
  const studentId = "student-1"; // Muhammad Khan
  const batchId = "batch-1";

  const quizzes = useMemo(() => {
    return getStudentQuizzes(batchId);
  }, [batchId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
          <HelpCircle className="h-3.5 w-3.5" />
          Interactive Assessment
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Quiz Examination Center</h1>
        <p className="text-sm text-muted-foreground">
          Timed multiple choice, true/false, and short answer assessments with instant evaluation
        </p>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => {
          const attempt = getStudentQuizAttempt(quiz.id, studentId);
          const hasAttempted = !!attempt;

          return (
            <Card key={quiz.id} className="hover:border-primary/40 transition-colors flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-muted text-foreground">
                    Module: {quiz.moduleId}
                  </span>
                  <StatusBadge status={hasAttempted ? "completed" : quiz.status} />
                </div>
                <CardTitle className="text-base font-bold">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {quiz.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/40 text-center text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Time Limit</span>
                    <span className="font-bold">{quiz.duration} mins</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Questions</span>
                    <span className="font-bold">{quiz.totalQuestions} items</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Pass Mark</span>
                    <span className="font-bold">{quiz.passingMarks || 25} pts</span>
                  </div>
                </div>

                {hasAttempted && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
                    <span className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Completed
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                      Score: {attempt.score}/{attempt.totalMarks} ({attempt.percentage}%)
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <Link href={`/student/quizzes/${quiz.id}`}>
                    <Button
                      size="sm"
                      className={
                        !hasAttempted && quiz.status === "open"
                          ? "w-full bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 font-semibold shadow-xs"
                          : "w-full text-xs h-8"
                      }
                      variant={!hasAttempted && quiz.status === "open" ? "default" : "outline"}
                    >
                      {hasAttempted
                        ? "View Result Breakdown"
                        : quiz.status === "open"
                        ? "Start Quiz Assessment Now"
                        : "View Quiz Overview"}
                      <ArrowRight className="h-3.5 w-3.5 ms-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
