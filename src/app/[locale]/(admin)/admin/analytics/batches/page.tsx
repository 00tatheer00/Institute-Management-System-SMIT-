"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getBatchAnalytics } from "@/lib/services/analytics-service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Users, BookOpen, CheckSquare, Award } from "lucide-react";

export default function AdminBatchAnalyticsPage() {
  const [batches] = useState(() => getBatchAnalytics());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch Comparison & Cohort Analytics"
        description="Comparative analysis across active cohorts, examining attendance compliance, assignment submissions, and completion rates."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Analytics", href: "/admin/analytics" },
          { label: "Batches" },
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
          <Button size="sm" variant="default" className="text-xs h-8 gap-1.5 font-medium">
            <Layers className="h-3.5 w-3.5" /> Batch Comparison
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

      {/* Batch Comparison Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Cohort Performance Matrix</CardTitle>
          <CardDescription className="text-xs">
            Normalized side-by-side view across all scheduled student batches
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Batch Code</th>
                  <th className="py-3 px-4 font-semibold">Curriculum</th>
                  <th className="py-3 px-4 font-semibold">Faculty Lead</th>
                  <th className="py-3 px-4 font-semibold">Enrolled</th>
                  <th className="py-3 px-4 font-semibold">Avg. Attendance</th>
                  <th className="py-3 px-4 font-semibold">Assignment Rate</th>
                  <th className="py-3 px-4 font-semibold">Quiz Avg.</th>
                  <th className="py-3 px-4 font-semibold">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {batches.map((b) => (
                  <tr key={b.batchId} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      {b.batchName}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {b.courseName}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium">
                      {b.trainerName}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono font-bold">
                      {b.enrolled}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold">
                      <span className={b.avgAttendance >= 75 ? "text-emerald-600" : "text-amber-600"}>
                        {b.avgAttendance}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      {b.assignmentCompletionRate}%
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      {b.quizAverage}%
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-emerald-600">
                      {b.completionRate}%
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
