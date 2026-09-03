import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBatchById } from "@/lib/services/batch-service";
import { getCourseById } from "@/lib/data/courses";
import { getTrainerById } from "@/lib/data/trainers";
import { getStudentsByBatch } from "@/lib/data/students";
import { classSessions, assignments } from "@/lib/data/misc";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DoorOpen,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
} from "lucide-react";

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  const batch = getBatchById(id);
  if (!batch) notFound();

  const course = getCourseById(batch.courseId);
  const trainer = getTrainerById(batch.trainerId);
  const enrolledStudents = getStudentsByBatch(batch.id);
  const batchClasses = classSessions.filter((c) => c.batchId === batch.id);
  const batchAssignments = assignments.filter((a) => a.batchId === batch.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <PageHeader
        title={`Batch: ${batch.name}`}
        description={`${course?.name || "Program"} · Room ${batch.room}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Batches", href: "/admin/batches" },
          { label: batch.name },
        ]}
        actions={
          <Link href="/admin/batches">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 me-2" /> Back to Batches
            </Button>
          </Link>
        }
      />

      {/* Summary Banner */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold">{batch.name}</h2>
                <StatusBadge status={batch.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                Course: <span className="font-semibold text-foreground">{course?.name}</span> · Instructor:{" "}
                <span className="font-semibold text-foreground">{trainer?.name || "Unassigned"}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xl font-bold">{enrolledStudents.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Enrolled Students</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xl font-bold">{batch.totalSeats}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Total Capacity</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Enrolled Students ({enrolledStudents.length})</TabsTrigger>
          <TabsTrigger value="overview">Schedule & Room Overview</TabsTrigger>
          <TabsTrigger value="classes">Scheduled Classes ({batchClasses.length})</TabsTrigger>
          <TabsTrigger value="assignments">Assignments ({batchAssignments.length})</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Student Name</TableHead>
                    <TableHead>Reg. ID</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No students enrolled in this batch yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    enrolledStudents.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/admin/students/${s.id}`}
                            className="hover:underline text-sm"
                          >
                            {s.name}
                          </Link>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{s.registrationId}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{s.phone}</TableCell>
                        <TableCell className="text-xs font-semibold">{s.attendancePercentage}%</TableCell>
                        <TableCell className="text-xs">{s.gpa}</TableCell>
                        <TableCell>
                          <StatusBadge status={s.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cohort Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days</span>
                  <span className="font-medium">{batch.schedule.days.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slot</span>
                  <span className="font-medium font-mono">
                    {batch.schedule.startTime} – {batch.schedule.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{new Date(batch.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">{new Date(batch.endDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Facility & Campus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Campus</span>
                  <span className="font-medium">{batch.campus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Room</span>
                  <span className="font-medium">{batch.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Seats</span>
                  <span className="font-medium">
                    {batch.totalSeats - enrolledStudents.length} of {batch.totalSeats}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-3">
          {batchClasses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                No individual lecture sessions recorded for this batch.
              </CardContent>
            </Card>
          ) : (
            batchClasses.map((cls) => (
              <Card key={cls.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{cls.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {cls.date} · {cls.startTime} - {cls.endTime} · Room {cls.room}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {cls.isCompleted ? "Completed" : "Scheduled"}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-3">
          {batchAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                No assignments assigned to this batch.
              </CardContent>
            </Card>
          ) : (
            batchAssignments.map((asgn) => (
              <Card key={asgn.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{asgn.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Due: {asgn.dueDate} · Total Marks: {asgn.totalMarks}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Published
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
