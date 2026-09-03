import type { StudentFeedback, FeedbackCategory } from "@/lib/types";
import { initialFeedback } from "@/lib/data/feedback";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";

const feedbackStore: StudentFeedback[] = [...initialFeedback];

const fbSearchFields: (keyof StudentFeedback)[] = [
  "targetName",
  "comment",
  "category",
  "studentName",
];

export interface FeedbackAnalytics {
  totalCount: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number; percentage: number }[];
  trainerBreakdown: { trainerName: string; averageRating: number; reviewCount: number }[];
  courseBreakdown: { courseName: string; averageRating: number; reviewCount: number }[];
}

export function getAllFeedback(params: QueryParams = {}): PaginatedResult<StudentFeedback> {
  return queryItems(feedbackStore, { pageSize: 15, ...params }, fbSearchFields);
}

export function getStudentFeedback(studentId: string): StudentFeedback[] {
  return feedbackStore.filter((f) => f.studentId === studentId);
}

export function submitFeedback(data: {
  studentId: string;
  studentName: string;
  isAnonymous: boolean;
  category: FeedbackCategory;
  targetId: string;
  targetName: string;
  rating: number;
  comment: string;
}): StudentFeedback {
  const newFeedback: StudentFeedback = {
    id: `fb-${Date.now()}`,
    studentId: data.studentId,
    studentName: data.isAnonymous ? "Anonymous Student" : data.studentName,
    isAnonymous: data.isAnonymous,
    category: data.category,
    targetId: data.targetId,
    targetName: data.targetName,
    rating: data.rating,
    comment: data.comment,
    createdAt: new Date().toISOString().split("T")[0],
    status: "published",
  };

  feedbackStore.unshift(newFeedback);
  return newFeedback;
}

export function getFeedbackStats(): FeedbackAnalytics {
  const total = feedbackStore.length;
  const avg =
    total > 0
      ? Number((feedbackStore.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1))
      : 5.0;

  // Distribution for ratings 1-5
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = feedbackStore.filter((f) => Math.round(f.rating) === stars).length;
    return {
      rating: stars,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  // Trainer ratings breakdown
  const trainerFeedback = feedbackStore.filter((f) => f.category === "trainer");
  const trainerMap: Record<string, { total: number; count: number }> = {};
  for (const f of trainerFeedback) {
    if (!trainerMap[f.targetName]) {
      trainerMap[f.targetName] = { total: 0, count: 0 };
    }
    trainerMap[f.targetName].total += f.rating;
    trainerMap[f.targetName].count += 1;
  }
  const trainerBreakdown = Object.entries(trainerMap).map(([name, stats]) => ({
    trainerName: name,
    averageRating: Number((stats.total / stats.count).toFixed(1)),
    reviewCount: stats.count,
  }));

  // Course breakdown
  const courseFeedback = feedbackStore.filter((f) => f.category === "course");
  const courseMap: Record<string, { total: number; count: number }> = {};
  for (const f of courseFeedback) {
    if (!courseMap[f.targetName]) {
      courseMap[f.targetName] = { total: 0, count: 0 };
    }
    courseMap[f.targetName].total += f.rating;
    courseMap[f.targetName].count += 1;
  }
  const courseBreakdown = Object.entries(courseMap).map(([name, stats]) => ({
    courseName: name,
    averageRating: Number((stats.total / stats.count).toFixed(1)),
    reviewCount: stats.count,
  }));

  return {
    totalCount: total,
    averageRating: avg,
    ratingDistribution: distribution,
    trainerBreakdown,
    courseBreakdown,
  };
}
