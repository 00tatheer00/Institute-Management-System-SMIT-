import { setRequestLocale } from "next-intl/server";
import { getStudentAttendanceSummary } from "@/lib/services/attendance-service";
import { initialClasses } from "@/lib/data/classes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  CheckSquare, CheckCircle2, XCircle, Clock,
  AlertCircle, Calendar, ShieldCheck, AlertTriangle
} from "lucide-react";

export default async function StudentAttendancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Student 1 (Muhammad Khan)
  const attendance = getStudentAttendanceSummary("student-1");
  const isEligibleForCertificate = attendance.percentage >= 75;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
          <CheckSquare className="h-3.5 w-3.5" />
          Academic Record
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Record & History</h1>
        <p className="text-sm text-muted-foreground">
          Track your classroom presence, punctuality, and eligibility for official certification
        </p>
      </div>

      {/* Policy Banner */}
      <Card
        className={
          isEligibleForCertificate
            ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/10"
            : "border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/10"
        }
      >
        <CardContent className="p-4 flex items-start gap-3">
          {isEligibleForCertificate ? (
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-sm">
            <h4 className="font-semibold text-foreground">
              {isEligibleForCertificate
                ? "Attendance Criterion Satisfied (75% Minimum)"
                : "Attendance Attention Required (< 75%)"}
            </h4>
            <p className="text-xs text-muted-foreground">
              Mohsin and Huma IT Center × SMIT mandates that enrolled students maintain at least 75% attendance throughout the semester to qualify for end-of-term certification and project defense.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl border bg-card text-center space-y-1">
          <p className="text-xs text-muted-foreground">Recorded Classes</p>
          <p className="text-2xl font-bold">{attendance.totalClasses}</p>
        </div>
        <div className="p-4 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-center space-y-1">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Attended</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{attendance.attendedClasses}</p>
        </div>
        <div className="p-4 rounded-xl border bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-center space-y-1">
          <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">Absent</p>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-400">{attendance.absentClasses}</p>
        </div>
        <div className="p-4 rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-center space-y-1">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Late Arrivals</p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{attendance.lateClasses}</p>
        </div>
        <div className="p-4 rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40 text-center space-y-1">
          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Excused Leaves</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{attendance.excusedClasses}</p>
        </div>
        <div className="p-4 rounded-xl border bg-card text-center space-y-1">
          <p className="text-xs text-muted-foreground">Attendance Standing</p>
          <p className="text-2xl font-bold text-emerald-600">{attendance.percentage}%</p>
        </div>
      </div>

      {/* Attendance History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Attendance Log & Lecture History</CardTitle>
          <CardDescription className="text-xs">
            Chronological audit of lecture sessions and recorded check-in times
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y border-t">
            {attendance.history.length > 0 ? (
              attendance.history.map((record) => {
                const session = initialClasses.find((c) => c.id === record.classId);

                return (
                  <div
                    key={record.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {session?.title || "Lecture Session"}
                        </span>
                        <StatusBadge status={record.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {record.date}
                        </span>
                        {record.checkInTime && (
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="h-3 w-3" /> Checked-in: {record.checkInTime}
                          </span>
                        )}
                        {session?.room && <span>Room: {session.room}</span>}
                      </div>
                    </div>

                    {record.remarks && (
                      <div className="text-xs text-muted-foreground italic bg-muted/40 px-3 py-1.5 rounded-md max-w-sm">
                        &quot;{record.remarks}&quot;
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No recorded attendance logs yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
