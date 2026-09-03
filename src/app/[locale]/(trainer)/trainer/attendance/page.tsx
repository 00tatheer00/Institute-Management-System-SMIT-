"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { batches } from "@/lib/data/batches";
import { initialClasses } from "@/lib/data/classes";
import {
  getBatchClassAttendance,
  markClassAttendance,
  type BatchStudentAttendanceRow,
} from "@/lib/services/attendance-service";
import type { AttendanceStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2, XCircle, Clock, AlertCircle, Search,
  Save, Users, Calendar, CheckSquare
} from "lucide-react";

function TrainerAttendanceContent() {
  const searchParams = useSearchParams();
  const initialBatch = searchParams.get("batch") || "batch-1";
  const initialClass = searchParams.get("class") || "class-1";

  const [selectedBatchId, setSelectedBatchId] = useState<string>(initialBatch);
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClass);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Available classes for selected batch
  const batchClasses = useMemo(() => {
    return initialClasses.filter((c) => c.batchId === selectedBatchId);
  }, [selectedBatchId]);

  // Load initial student rows
  const [attendanceRows, setAttendanceRows] = useState<BatchStudentAttendanceRow[]>(() => {
    return getBatchClassAttendance(selectedBatchId, selectedClassId);
  });

  // When batch or class changes, reload
  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    const classesForBatch = initialClasses.filter((c) => c.batchId === batchId);
    const newClassId = classesForBatch.length > 0 ? classesForBatch[0].id : "";
    setSelectedClassId(newClassId);
    setAttendanceRows(getBatchClassAttendance(batchId, newClassId));
    setIsSaved(false);
    setSaveMessage(null);
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setAttendanceRows(getBatchClassAttendance(selectedBatchId, classId));
    setIsSaved(false);
    setSaveMessage(null);
  };

  // Change individual student status
  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setIsSaved(false);
    setAttendanceRows((prev) =>
      prev.map((row) =>
        row.student.id === studentId ? { ...row, currentStatus: status } : row
      )
    );
  };

  // Change individual student remarks
  const updateRemarks = (studentId: string, remarks: string) => {
    setIsSaved(false);
    setAttendanceRows((prev) =>
      prev.map((row) =>
        row.student.id === studentId ? { ...row, remarks } : row
      )
    );
  };

  // Bulk actions
  const markAll = (status: AttendanceStatus) => {
    setIsSaved(false);
    setAttendanceRows((prev) =>
      prev.map((row) => ({ ...row, currentStatus: status }))
    );
  };

  // Save attendance
  const handleSave = () => {
    const recordsToSave = attendanceRows.map((row) => ({
      studentId: row.student.id,
      status: row.currentStatus,
      checkInTime: row.checkInTime || (row.currentStatus === "present" ? "09:00" : undefined),
      remarks: row.remarks,
    }));

    const result = markClassAttendance(
      selectedClassId,
      selectedBatchId,
      "2026-09-03",
      recordsToSave,
      "trainer-1"
    );

    if (result.success) {
      setIsSaved(true);
      setSaveMessage(`Attendance for ${recordsToSave.length} students recorded successfully!`);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  // Filtered rows for search
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return attendanceRows;
    const q = searchQuery.toLowerCase();
    return attendanceRows.filter(
      (r) =>
        r.student.name.toLowerCase().includes(q) ||
        r.student.registrationId.toLowerCase().includes(q)
    );
  }, [attendanceRows, searchQuery]);

  // Real-time counter metrics
  const total = attendanceRows.length;
  const presentCount = attendanceRows.filter((r) => r.currentStatus === "present").length;
  const absentCount = attendanceRows.filter((r) => r.currentStatus === "absent").length;
  const lateCount = attendanceRows.filter((r) => r.currentStatus === "late").length;
  const excusedCount = attendanceRows.filter((r) => r.currentStatus === "excused").length;
  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <CheckSquare className="h-3.5 w-3.5" />
            Classroom Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Record, audit, and submit daily attendance for enrolled students
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold shadow-xs"
          >
            <Save className="h-4 w-4" />
            {isSaved ? "Saved" : "Save Attendance"}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Selector Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            {/* Batch Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Select Cohort Batch
              </label>
              <Select
                value={selectedBatchId}
                onValueChange={(val: string | null) => {
                  if (val) handleBatchChange(val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} ({b.schedule?.startTime} - {b.schedule?.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Class Session Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Select Class Session
              </label>
              <Select
                value={selectedClassId}
                onValueChange={(val: string | null) => {
                  if (val) handleClassChange(val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose class" />
                </SelectTrigger>
                <SelectContent>
                  {batchClasses.length > 0 ? (
                    batchClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.date} • {c.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No sessions found for batch
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Search filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" /> Filter Students
              </label>
              <div className="relative">
                <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by name or roll no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl border bg-card text-center space-y-1">
          <p className="text-xs text-muted-foreground">Enrolled</p>
          <p className="text-xl font-bold">{total}</p>
        </div>
        <div className="p-3 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-center space-y-1">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Present</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{presentCount}</p>
        </div>
        <div className="p-3 rounded-xl border bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-center space-y-1">
          <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">Absent</p>
          <p className="text-xl font-bold text-rose-700 dark:text-rose-400">{absentCount}</p>
        </div>
        <div className="p-3 rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-center space-y-1">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Late</p>
          <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{lateCount}</p>
        </div>
        <div className="p-3 rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40 text-center space-y-1">
          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Excused</p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{excusedCount}</p>
        </div>
        <div className="p-3 rounded-xl border bg-card text-center space-y-1">
          <p className="text-xs text-muted-foreground">Attendance %</p>
          <p className="text-xl font-bold text-emerald-600">{attendanceRate}%</p>
        </div>
      </div>

      {/* Roster & Quick Actions */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
          <div>
            <CardTitle className="text-base font-semibold">Student Roster ({filteredRows.length})</CardTitle>
            <CardDescription className="text-xs">
              Toggle status buttons or batch mark all students
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAll("present")}
              className="text-xs h-8 text-emerald-700 hover:bg-emerald-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5 me-1 text-emerald-600" />
              Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAll("absent")}
              className="text-xs h-8 text-rose-700 hover:bg-rose-50"
            >
              <XCircle className="h-3.5 w-3.5 me-1 text-rose-600" />
              Mark All Absent
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y border-t">
            {filteredRows.map((row, idx) => (
              <div
                key={row.student.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-3"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3 min-w-[240px]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{row.student.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{row.student.registrationId}</span>
                      <span>•</span>
                      <span className={row.student.attendancePercentage < 75 ? "text-amber-600 font-semibold" : ""}>
                        Overall: {row.student.attendancePercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Segmented Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant={row.currentStatus === "present" ? "default" : "outline"}
                    className={
                      row.currentStatus === "present"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                        : "text-xs h-8 hover:text-emerald-600"
                    }
                    onClick={() => updateStatus(row.student.id, "present")}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 me-1" /> Present
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant={row.currentStatus === "absent" ? "default" : "outline"}
                    className={
                      row.currentStatus === "absent"
                        ? "bg-rose-600 hover:bg-rose-700 text-white text-xs h-8"
                        : "text-xs h-8 hover:text-rose-600"
                    }
                    onClick={() => updateStatus(row.student.id, "absent")}
                  >
                    <XCircle className="h-3.5 w-3.5 me-1" /> Absent
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant={row.currentStatus === "late" ? "default" : "outline"}
                    className={
                      row.currentStatus === "late"
                        ? "bg-amber-600 hover:bg-amber-700 text-white text-xs h-8"
                        : "text-xs h-8 hover:text-amber-600"
                    }
                    onClick={() => updateStatus(row.student.id, "late")}
                  >
                    <Clock className="h-3.5 w-3.5 me-1" /> Late
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant={row.currentStatus === "excused" ? "default" : "outline"}
                    className={
                      row.currentStatus === "excused"
                        ? "bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                        : "text-xs h-8 hover:text-blue-600"
                    }
                    onClick={() => updateStatus(row.student.id, "excused")}
                  >
                    <AlertCircle className="h-3.5 w-3.5 me-1" /> Excused
                  </Button>
                </div>

                {/* Remarks Field */}
                <div className="w-full md:w-56">
                  <Input
                    placeholder="Optional note / reason..."
                    value={row.remarks || ""}
                    onChange={(e) => updateRemarks(row.student.id, e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TrainerAttendancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading attendance console...</div>}>
      <TrainerAttendanceContent />
    </Suspense>
  );
}
