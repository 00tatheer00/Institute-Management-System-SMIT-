"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getStudentAnalytics } from "@/lib/services/analytics-service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from "recharts";
import {
  TrendingUp, Users, GraduationCap, UserX,
  BookOpen, Layers, CheckSquare, Award, ArrowRight
} from "lucide-react";

export default function AdminAnalyticsOverviewPage() {
  const [analytics] = useState(() => getStudentAnalytics());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Institutional Analytics & Intelligence"
          description="Macro-level metrics on student retention, curricular pass rates, laboratory utilization, and cohort performance."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Analytics" },
          ]}
        />
      </div>

      {/* Sub-Module Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        <Link href="/admin/analytics">
          <Button size="sm" variant="default" className="text-xs h-8 gap-1.5 font-medium">
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
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 font-medium">
            <Award className="h-3.5 w-3.5 text-purple-600" /> Grade Distributions
          </Button>
        </Link>
      </div>

      {/* Executive Student KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Student Body</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-foreground">{analytics.totalStudents}</span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">+14% YoY</span>
          </div>
          <p className="text-xs text-muted-foreground">Cumulative registered learners</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Active In-Class</p>
          <p className="text-3xl font-extrabold text-blue-600">{analytics.activeStudents}</p>
          <p className="text-xs text-muted-foreground">Currently attending morning/evening labs</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Graduation Completion Rate</p>
          <p className="text-3xl font-extrabold text-emerald-600">{analytics.completionRate}%</p>
          <p className="text-xs text-muted-foreground">High completion threshold</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Attrition / Dropout Rate</p>
          <p className="text-3xl font-extrabold text-rose-600">{analytics.dropoutRate}%</p>
          <p className="text-xs text-muted-foreground">Low attrition due to free mentoring</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Monthly Intake &amp; Enrollment Trajectory</CardTitle>
            <CardDescription className="text-xs">
              Admitted candidates across all technological disciplines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={analytics.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Student Population Status Distribution</CardTitle>
            <CardDescription className="text-xs">
              Active learners, certified alumni, and inactive accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-3">
            {analytics.statusDistribution.map((s) => (
              <div key={s.status} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{s.status}</span>
                  <span>{s.count} ({s.percentage}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      s.status === "Active"
                        ? "bg-blue-600"
                        : s.status === "Graduated"
                        ? "bg-emerald-600"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Program Distribution Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Student Enrollment per Course</CardTitle>
          <CardDescription className="text-xs">
            Student volume breakdown across registered curriculum specializations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Course Program</th>
                  <th className="py-3 px-4 font-semibold">Enrolled Students</th>
                  <th className="py-3 px-4 font-semibold">Share of Student Body</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {analytics.studentsByCourse.map((c) => {
                  const share = Math.round((c.value / analytics.totalStudents) * 100);
                  return (
                    <tr key={c.name} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">
                        {c.fullName || c.name}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono font-bold">
                        {c.value} students
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${share}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{share}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-end">
                        <Link href="/admin/analytics/courses">
                          <Button size="sm" variant="ghost" className="text-xs h-7 gap-1">
                            Course Details <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
