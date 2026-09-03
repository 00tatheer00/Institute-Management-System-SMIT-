import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { batches } from "@/lib/data/batches";
import { courses } from "@/lib/data/courses";
import { initialClasses } from "@/lib/data/classes";
import {
  getBatchAttendanceSummary,
  getLowAttendanceStudents,
} from "@/lib/services/attendance-service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  CheckSquare, Users, AlertTriangle, ShieldCheck,
  Calendar, ArrowRight, Clock, MapPin
} from "lucide-react";

export default async function AdminAttendancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const lowAttendanceList = getLowAttendanceStudents(75);
  const batchSummaries = batches.slice(0, 6).map((b) => getBatchAttendanceSummary(b.id));

  // Compute institute-wide average
  const totalStudents = batchSummaries.reduce((sum, b) => sum + b.totalStudents, 0);
  const avgRate = batchSummaries.length > 0
    ? Math.round(batchSummaries.reduce((sum, b) => sum + b.averageAttendanceRate, 0) / batchSummaries.length)
    : 85;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Classroom Operations"
        description="Monitor institute-wide attendance health, evaluate cohort rates, and take early retention actions for at-risk students."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Attendance" },
        ]}
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Institute Average</p>
          <p className="text-2xl font-bold text-emerald-600">{avgRate}%</p>
          <p className="text-xs text-muted-foreground">Across all active cohorts</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Active Cohorts</p>
          <p className="text-2xl font-bold text-foreground">{batches.length}</p>
          <p className="text-xs text-muted-foreground">Classroom sessions tracked daily</p>
        </Card>

        <Card className="p-4 space-y-1 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40">
          <p className="text-xs text-amber-700 dark:text-amber-400 uppercase font-semibold">
            Attendance Alerts
          </p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
            {lowAttendanceList.length}
          </p>
          <p className="text-xs text-muted-foreground">Students below 75% policy threshold</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Today&apos;s Lectures</p>
          <p className="text-2xl font-bold text-blue-600">{initialClasses.length}</p>
          <p className="text-xs text-muted-foreground">Synchronized with faculty rosters</p>
        </Card>
      </div>

      {/* Low Attendance Intervention Ledger */}
      <Card className="border-amber-200 dark:border-amber-900/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <CardTitle className="text-base font-bold">
              Attendance Intervention Roster (Below 75% Criterion)
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Students flagged by the Academic Engine who require faculty follow-up before midterm exams
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Roll No</th>
                  <th className="py-3 px-4 font-semibold">Program</th>
                  <th className="py-3 px-4 font-semibold">Cohort</th>
                  <th className="py-3 px-4 font-semibold">Attended / Total</th>
                  <th className="py-3 px-4 font-semibold">Attendance %</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {lowAttendanceList.map((alert) => (
                  <tr key={alert.student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {alert.student.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      {alert.student.registrationId}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {alert.courseName}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium">
                      {alert.batchName}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      {alert.classesAttended} / {alert.totalClasses}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-destructive">
                      {alert.attendancePercentage}%
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          alert.severity === "critical"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Link href={`/admin/students/${alert.student.id}`}>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Student Profile
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cohort Attendance Standing Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Cohort Performance Breakdown</CardTitle>
          <CardDescription className="text-xs">
            Class attendance rates aggregated across current semester batches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batchSummaries.map((summary) => (
              <div
                key={summary.batchId}
                className="p-4 rounded-xl border bg-card hover:bg-muted/20 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground truncate max-w-[180px]">
                    {summary.batchName}
                  </h4>
                  <span className="text-sm font-extrabold text-emerald-600">
                    {summary.averageAttendanceRate}%
                  </span>
                </div>

                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${summary.averageAttendanceRate}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t">
                  <span>Enrolled: {summary.totalStudents} students</span>
                  <span>Sessions: {summary.totalSessionsRecorded} logged</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
