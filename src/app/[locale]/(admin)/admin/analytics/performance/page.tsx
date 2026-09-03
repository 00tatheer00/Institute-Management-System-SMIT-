"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getPerformanceAnalytics } from "@/lib/services/analytics-service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, BookOpen, Layers, CheckSquare, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from "recharts";

export default function AdminPerformanceAnalyticsPage() {
  const [perf] = useState(() => getPerformanceAnalytics());

  const GRADE_COLORS: Record<string, string> = {
    "A+": "#16a34a",
    A: "#22c55e",
    "B+": "#3b82f6",
    B: "#60a5fa",
    C: "#f59e0b",
    D: "#f97316",
    F: "#ef4444",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Analytics & Grade Distribution"
        description="Comprehensive grading metrics, institutional pass rates, and assessment benchmark distribution."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Analytics", href: "/admin/analytics" },
          { label: "Performance" },
        ]}
      />

      {/* Sub-Module Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        <Link href="/admin/analytics">
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 font-medium">
            <Users className="h-3.5 w-3.5" /> Overview &amp; Students
          </Button>
        </Link>
        <Link href="/admin/analytics/courses">
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 font-medium">
            <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Course Standings
          </Button>
        </Link>
        <Link href="/admin/analytics/batches">
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 font-medium">
            <Layers className="h-3.5 w-3.5 text-indigo-600" /> Batch Comparison
          </Button>
        </Link>
        <Link href="/admin/analytics/attendance">
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 font-medium">
            <CheckSquare className="h-3.5 w-3.5 text-amber-600" /> Attendance Trends
          </Button>
        </Link>
        <Link href="/admin/analytics/performance">
          <Button size="sm" variant="default" className="text-xs h-8 gap-1.5 font-medium">
            <Award className="h-3.5 w-3.5" /> Grade Distributions
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Campus Average Assessment Score</p>
          <p className="text-3xl font-extrabold text-foreground">{perf.overallAverageScore}%</p>
          <p className="text-xs text-muted-foreground">Across quizzes, code assignments, &amp; capstones</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Institutional Pass Rate</p>
          <p className="text-3xl font-extrabold text-emerald-600">{perf.overallPassRate}%</p>
          <p className="text-xs text-muted-foreground">Passing threshold is 50% cumulative grade</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">High Distinction Tier (A / A+)</p>
          <p className="text-3xl font-extrabold text-blue-600">75%</p>
          <p className="text-xs text-muted-foreground">Students scoring 80% or above</p>
        </Card>
      </div>

      {/* Grade Distribution Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Letter Grade Distribution Across Campus</CardTitle>
          <CardDescription className="text-xs">
            Volume of evaluated student assessments categorized by institutional grading matrix
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={perf.gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="grade" tick={{ fontSize: 13, fontWeight: "bold" }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {perf.gradeDistribution.map((entry) => (
                  <Cell key={`cell-${entry.grade}`} fill={GRADE_COLORS[entry.grade] || "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Assessment Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {perf.assessmentBreakdown.map((a) => (
          <Card key={a.type} className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground font-semibold uppercase">{a.type}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">{a.avgScore}% avg.</span>
              <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                {a.totalCount} evaluations
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
