"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getAttendanceAnalytics } from "@/lib/services/analytics-service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Users, BookOpen, Layers, Award, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

export default function AdminAttendanceAnalyticsPage() {
  const [attendance] = useState(() => getAttendanceAnalytics());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Trends & Compliance Audit"
        description="Institutional presence monitoring, weekly compliance trajectories, and proactive tracking of at-risk candidates below 75%."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Analytics", href: "/admin/analytics" },
          { label: "Attendance" },
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
          <Button size="sm" variant="default" className="text-xs h-8 gap-1.5 font-medium">
            <CheckSquare className="h-3.5 w-3.5" /> Attendance Trends
          </Button>
        </Link>
        <Link href="/admin/analytics/performance">
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 font-medium">
            <Award className="h-3.5 w-3.5 text-purple-600" /> Grade Distributions
          </Button>
        </Link>
      </div>

      {/* Overall Attendance Metric Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Campus Overall Attendance</p>
          <p className="text-3xl font-extrabold text-foreground">{attendance.overallAttendanceRate}%</p>
          <p className="text-xs text-emerald-600 font-semibold">Above 75% minimum institutional policy</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Students At Risk (&lt; 75%)</p>
          <p className="text-3xl font-extrabold text-amber-600">{attendance.lowAttendanceStudents.length}</p>
          <p className="text-xs text-muted-foreground">Require counselor or guardian intervention</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Policy Benchmark</p>
          <p className="text-3xl font-extrabold text-blue-600">75.0%</p>
          <p className="text-xs text-muted-foreground">Mandatory requirement for certificate issuance</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Trajectory */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Attendance Trend</CardTitle>
            <CardDescription className="text-xs">
              Weekly physical presence rate in laboratory sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={attendance.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: "#16a34a" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance by Course */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Attendance Rate by Course</CardTitle>
            <CardDescription className="text-xs">
              Discipline-wise laboratory presence percentage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={attendance.attendanceByCourse}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Attendance Roster */}
      <Card className="border-amber-200 dark:border-amber-900/60">
        <CardHeader className="pb-3 bg-amber-50/40 dark:bg-amber-950/20 border-b">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-base font-semibold text-amber-900 dark:text-amber-200">
              Low Attendance Action Roster (&lt; 75%)
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-amber-700/80 dark:text-amber-400">
            Learners whose certificate eligibility is currently locked due to non-compliance with the 75% attendance rule
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Course</th>
                  <th className="py-3 px-4 font-semibold">Batch</th>
                  <th className="py-3 px-4 font-semibold">Attendance Rate</th>
                  <th className="py-3 px-4 font-semibold">Estimated Classes Missed</th>
                  <th className="py-3 px-4 font-semibold">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {attendance.lowAttendanceStudents.map((s) => (
                  <tr key={s.studentId} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      {s.studentName}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {s.courseName}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {s.batchName}
                    </td>
                    <td className="py-3 px-4 text-xs font-bold text-rose-600 font-mono">
                      {s.attendanceRate}%
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      {s.classesMissed} missed
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        Ineligible for Certificate
                      </span>
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
