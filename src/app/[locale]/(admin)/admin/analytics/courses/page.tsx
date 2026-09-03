"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getCourseAnalytics } from "@/lib/services/analytics-service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, BookOpen, Users, CheckCircle2, TrendingUp, Layers, CheckSquare, Award } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from "recharts";

export default function AdminCourseAnalyticsPage() {
  const [courses] = useState(() => getCourseAnalytics());

  const chartData = courses.map((c) => ({
    name: c.courseName.length > 12 ? c.courseName.slice(0, 12) + "…" : c.courseName,
    students: c.enrolledStudents,
    fullName: c.courseName,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Standings & Curricular Analytics"
        description="Detailed evaluations across course popularity, average assessment score, graduation rate, and student feedback."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Analytics", href: "/admin/analytics" },
          { label: "Courses" },
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
          <Button size="sm" variant="default" className="text-xs h-8 gap-1.5 font-medium">
            <BookOpen className="h-3.5 w-3.5" /> Course Standings
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

      {/* Course Popularity Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Course Enrollment Capacity &amp; Popularity</CardTitle>
          <CardDescription className="text-xs">
            Volume of enrolled candidates across active technical programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="students" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Course Matrix Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Curriculum Performance Ledger</CardTitle>
          <CardDescription className="text-xs">
            Comprehensive breakdown of academic metrics per discipline
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Discipline</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Enrollment</th>
                  <th className="py-3 px-4 font-semibold">Avg. Attendance</th>
                  <th className="py-3 px-4 font-semibold">Avg. Score</th>
                  <th className="py-3 px-4 font-semibold">Pass Rate</th>
                  <th className="py-3 px-4 font-semibold">Student Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courses.map((c) => (
                  <tr key={c.courseId} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      {c.courseName}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-muted font-medium text-muted-foreground">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono font-bold">
                      {c.enrolledStudents} students
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-foreground">
                      <span className={c.avgAttendance >= 75 ? "text-emerald-600" : "text-amber-600"}>
                        {c.avgAttendance}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold font-mono">
                      {c.avgScore}%
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-emerald-600">
                      {c.passRate}%
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {c.studentSatisfaction} / 5.0
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
