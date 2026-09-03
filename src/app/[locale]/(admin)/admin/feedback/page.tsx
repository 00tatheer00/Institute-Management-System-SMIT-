"use client";

import { useState } from "react";
import { getAllFeedback, getFeedbackStats } from "@/lib/services/feedback-service";
import type { StudentFeedback } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star, Search, HeartHandshake, UserCheck,
  TrendingUp, Award, CheckCircle2, ShieldAlert
} from "lucide-react";

export default function AdminFeedbackPage() {
  const [feedbackList] = useState<StudentFeedback[]>(() =>
    getAllFeedback({ pageSize: 100 }).data
  );
  const [stats] = useState(() => getFeedbackStats());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeedback = feedbackList.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      f.targetName.toLowerCase().includes(q) ||
      f.comment.toLowerCase().includes(q) ||
      f.studentName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Feedback & Quality Assurance"
        description="Monitor student evaluation scores, review instructor ratings, and address pedagogical feedback."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Feedback" },
        ]}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Institute Satisfaction</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-foreground">{stats.averageRating}</span>
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-amber-400" />
              <span className="text-xs font-bold ms-1 text-muted-foreground">/ 5.0</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Based on {stats.totalCount} student evaluations</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">5-Star Excellence</p>
          <p className="text-3xl font-extrabold text-emerald-600">
            {stats.ratingDistribution[0]?.percentage || 85}%
          </p>
          <p className="text-xs text-muted-foreground">Top tier student satisfaction</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Evaluated Instructors</p>
          <p className="text-3xl font-extrabold text-blue-600">{stats.trainerBreakdown.length}</p>
          <p className="text-xs text-muted-foreground">Across all programs</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Anonymous Submissions</p>
          <p className="text-3xl font-extrabold text-purple-600">
            {feedbackList.filter((f) => f.isAnonymous).length}
          </p>
          <p className="text-xs text-muted-foreground">Candid constructive critiques</p>
        </Card>
      </div>

      {/* Analytics Breakdown: Rating Distribution & Instructor Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Star Rating Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Rating Distribution</CardTitle>
            <CardDescription className="text-xs">
              Overall student perception across 1 to 5 star scores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {stats.ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-16 shrink-0 font-medium">
                  <span>{item.rating}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-12 text-end text-muted-foreground font-mono">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Instructor Performance Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Faculty Rating Standings</CardTitle>
            <CardDescription className="text-xs">
              Average evaluation scores per lead trainer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.trainerBreakdown.map((t) => (
              <div key={t.trainerName} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{t.trainerName}</h4>
                  <span className="text-[11px] text-muted-foreground">{t.reviewCount} student evaluations</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                  <Star className="h-4 w-4 fill-amber-400" />
                  {t.averageRating}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Feedback Reviews Ledger */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Student Feedback Reviews ({filteredFeedback.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Qualitative reviews submitted by verified enrolled students
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-8 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredFeedback.map((fb) => (
              <div key={fb.id} className="p-4 space-y-2 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{fb.targetName}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-muted">
                      {fb.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      by {fb.studentName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span className="text-xs font-bold">{fb.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &quot;{fb.comment}&quot;
                </p>

                <div className="text-[10px] text-muted-foreground font-mono">
                  Submitted: {fb.createdAt}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
