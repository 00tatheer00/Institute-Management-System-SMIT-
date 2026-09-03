import { initialQuizzes, initialQuizQuestions, initialQuizAttempts } from "@/lib/data/quizzes";
import { students } from "@/lib/data/students";
import type { Quiz, QuizQuestion, QuizAttempt } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";
import { recordQuizResult } from "./result-service";

const quizStore: Quiz[] = [...initialQuizzes];
const questionsStore: Record<string, QuizQuestion[]> = { ...initialQuizQuestions };
const attemptStore: QuizAttempt[] = [...initialQuizAttempts];
const searchFields: (keyof Quiz)[] = ["title", "description", "instructions"];

export function getQuizzes(params: QueryParams = {}): PaginatedResult<Quiz> {
  return queryItems(quizStore, { pageSize: 15, ...params }, searchFields);
}

/**
 * Fetch quiz by ID.
 * CRITICAL SECURITY ARCHITECTURE:
 * If isTrainer is false (i.e. student view), the correctAnswer field is completely
 * stripped from every question payload before returning to prevent inspect-element cheating!
 */
export function getQuizById(id: string, isTrainer = false): Quiz | undefined {
  const quiz = quizStore.find((q) => q.id === id);
  if (!quiz) return undefined;

  const questions = questionsStore[id] || [];

  if (isTrainer) {
    return { ...quiz, questions };
  }

  // Student view: sanitize questions by stripping secret answer key
  const sanitizedQuestions = questions.map((q) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { correctAnswer, ...safeQuestion } = q;
    return { ...safeQuestion, correctAnswer: "" };
  });

  return { ...quiz, questions: sanitizedQuestions };
}

export function getTrainerQuizzes(trainerId: string, batchId?: string): Quiz[] {
  return quizStore.filter((q) => {
    if (q.trainerId !== trainerId) return false;
    if (batchId && q.batchId !== batchId) return false;
    return true;
  });
}

export function getStudentQuizzes(batchId: string): Quiz[] {
  return quizStore.filter((q) => q.batchId === batchId && q.status !== "draft" && q.status !== "archived");
}

export function createQuiz(
  data: Omit<Quiz, "id" | "totalQuestions">
): MutationResult<Quiz> {
  const id = `quiz-${Date.now()}`;
  const newQuiz: Quiz = {
    ...data,
    id,
    totalQuestions: 0,
    questions: [],
  };

  quizStore.unshift(newQuiz);
  questionsStore[id] = [];
  return { success: true, data: newQuiz };
}

export function updateQuiz(id: string, data: Partial<Quiz>): MutationResult<Quiz> {
  const index = quizStore.findIndex((q) => q.id === id);
  if (index === -1) return { success: false, error: "Quiz not found" };

  const updated: Quiz = {
    ...quizStore[index],
    ...data,
  };

  quizStore[index] = updated;
  return { success: true, data: updated };
}

export function publishQuiz(id: string): MutationResult<Quiz> {
  return updateQuiz(id, { status: "open" });
}

export function closeQuiz(id: string): MutationResult<Quiz> {
  return updateQuiz(id, { status: "closed" });
}

// ============================================================
// QUESTION BUILDER METHODS
// ============================================================

export function addQuizQuestion(
  quizId: string,
  questionData: Omit<QuizQuestion, "id" | "quizId" | "order">
): MutationResult<QuizQuestion> {
  const list = questionsStore[quizId] || [];
  const newQuestion: QuizQuestion = {
    ...questionData,
    id: `q-${quizId}-${Date.now()}`,
    quizId,
    order: list.length + 1,
  };

  list.push(newQuestion);
  questionsStore[quizId] = list;

  // Recalculate quiz totals
  const quiz = quizStore.find((q) => q.id === quizId);
  if (quiz) {
    quiz.totalQuestions = list.length;
    quiz.totalMarks = list.reduce((sum, q) => sum + q.marks, 0);
  }

  return { success: true, data: newQuestion };
}

export function updateQuizQuestion(
  quizId: string,
  questionId: string,
  data: Partial<QuizQuestion>
): MutationResult<QuizQuestion> {
  const list = questionsStore[quizId] || [];
  const index = list.findIndex((q) => q.id === questionId);
  if (index === -1) return { success: false, error: "Question not found" };

  list[index] = { ...list[index], ...data };
  questionsStore[quizId] = list;

  const quiz = quizStore.find((q) => q.id === quizId);
  if (quiz) {
    quiz.totalMarks = list.reduce((sum, q) => sum + q.marks, 0);
  }

  return { success: true, data: list[index] };
}

export function deleteQuizQuestion(quizId: string, questionId: string): MutationResult<null> {
  const list = questionsStore[quizId] || [];
  const index = list.findIndex((q) => q.id === questionId);
  if (index === -1) return { success: false, error: "Question not found" };

  list.splice(index, 1);
  // Re-number orders
  list.forEach((q, idx) => {
    q.order = idx + 1;
  });
  questionsStore[quizId] = list;

  const quiz = quizStore.find((q) => q.id === quizId);
  if (quiz) {
    quiz.totalQuestions = list.length;
    quiz.totalMarks = list.reduce((sum, q) => sum + q.marks, 0);
  }

  return { success: true };
}

export function reorderQuizQuestions(quizId: string, questionIds: string[]): MutationResult<QuizQuestion[]> {
  const list = questionsStore[quizId] || [];
  const reordered: QuizQuestion[] = [];

  questionIds.forEach((id, idx) => {
    const item = list.find((q) => q.id === id);
    if (item) {
      item.order = idx + 1;
      reordered.push(item);
    }
  });

  questionsStore[quizId] = reordered;
  return { success: true, data: reordered };
}

// ============================================================
// STUDENT QUIZ ATTEMPT & SECURE SCORING
// ============================================================

export function submitQuizAttempt(
  quizId: string,
  studentId: string,
  answers: Record<string, string>
) {
  const quiz = quizStore.find((q) => q.id === quizId);
  if (!quiz) return { success: false, error: "Quiz not found" };

  // Check if attempt already exists (single-attempt policy)
  const existingAttempt = attemptStore.find(
    (a) => a.quizId === quizId && a.studentId === studentId && a.status === "graded"
  );
  if (existingAttempt) {
    return { success: false, error: "You have already completed this quiz." };
  }

  const questions = questionsStore[quizId] || [];
  let score = 0;
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0) || quiz.totalMarks;

  // Server-side scoring against private correctAnswer
  questions.forEach((q) => {
    const studentAnswer = (answers[q.id] || "").trim().toLowerCase();
    const correctAnswer = (q.correctAnswer || "").trim().toLowerCase();

    if (studentAnswer === correctAnswer) {
      score += q.marks;
    }
  });

  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  const now = new Date().toISOString();

  const newAttempt: QuizAttempt = {
    id: `att-${Date.now()}`,
    quizId,
    studentId,
    startedAt: now,
    submittedAt: now,
    score,
    totalMarks,
    percentage,
    answers,
    status: "graded",
  };

  attemptStore.push(newAttempt);

  // Sync to centralized result-service
  const student = students.find((s) => s.id === studentId);
  const resultMutation = recordQuizResult({
    studentId,
    studentName: student?.name,
    courseId: quiz.courseId,
    batchId: quiz.batchId,
    quizId: quiz.id,
    quizTitle: quiz.title,
    obtainedMarks: score,
    totalMarks,
    remarks: percentage >= (quiz.passingMarks || 50) ? "Passed" : "Did not meet passing marks",
  });

  return {
    success: true,
    data: {
      attempt: newAttempt,
      result: resultMutation.data,
      score,
      totalMarks,
      percentage,
      isPassing: percentage >= ((quiz.passingMarks || 25) / totalMarks) * 100,
    },
  };
}

export function getStudentQuizAttempt(quizId: string, studentId: string): QuizAttempt | undefined {
  return attemptStore.find((a) => a.quizId === quizId && a.studentId === studentId);
}

export function getQuizAttempts(quizId: string): QuizAttempt[] {
  return attemptStore.filter((a) => a.quizId === quizId);
}
