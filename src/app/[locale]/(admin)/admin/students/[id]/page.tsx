import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getStudentById } from "@/lib/services/student-service";
import { getCourseById } from "@/lib/data/courses";
import { getBatchById } from "@/lib/data/batches";
import { getTrainerById } from "@/lib/data/trainers";
import { assignments, quizzes } from "@/lib/data/misc";
import { Pencil, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Award, FileText } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const student = getStudentById(id);
  if (!student) return { title: "Student Not Found" };
  const t = await getTranslations({ locale, namespace: "admin.students" });
  return { title: `${student.name} — ${t("profile")}` };
}

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.students");

  const student = getStudentById(id);
  if (!student) notFound();

  const course = getCourseById(student.courseId);
  const batch = getBatchById(student.batchId);
  const trainer = batch ? getTrainerById(batch.trainerId) : undefined;
  const studentAssignments = assignments.filter((a) => a.batchId === student.batchId);
  const studentQuizzes = quizzes.filter((q) => q.batchId === student.batchId);

  const initials = student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("profile")}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: t("title"), href: "/admin/students" },
          { label: student.name },
        ]}
        actions={
          <Button size="sm"><Pencil className="h-4 w-4 me-2" /> Edit</Button>
        }
      />

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold">{student.name}</h2>
                <StatusBadge status={student.status} />
              </div>
              <p className="text-sm text-muted-foreground">{student.registrationId}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {student.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {student.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {student.city}</span>
              </div>
            </div>
            <div className="flex gap-3 text-center">
              <div className="px-4 py-2 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{student.attendancePercentage}%</p>
                <p className="text-[10px] text-muted-foreground">Attendance</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{student.gpa}</p>
                <p className="text-[10px] text-muted-foreground">GPA</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{student.completedAssignments}/{student.totalAssignments}</p>
                <p className="text-[10px] text-muted-foreground">Assignments</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="academic">{t("tabs.academic")}</TabsTrigger>
          <TabsTrigger value="attendance">{t("tabs.attendance")}</TabsTrigger>
          <TabsTrigger value="assignments">{t("tabs.assignments")}</TabsTrigger>
          <TabsTrigger value="results">{t("tabs.results")}</TabsTrigger>
          <TabsTrigger value="documents">{t("tabs.documents")}</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Full Name" value={student.name} />
                <InfoRow label="Date of Birth" value={new Date(student.dateOfBirth).toLocaleDateString()} />
                <InfoRow label="Gender" value={student.gender} />
                <InfoRow label="CNIC" value={student.cnic} />
                <InfoRow label="Education" value={student.education} />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Email" value={student.email} />
                <InfoRow label="Phone" value={student.phone} />
                <InfoRow label="Address" value={student.address} />
                <InfoRow label="City" value={student.city} />
              </CardContent>
            </Card>

            {/* Registration */}
            <Card>
              <CardHeader><CardTitle className="text-base">Registration</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Registration ID" value={student.registrationId} />
                <InfoRow label="Enrolled Date" value={new Date(student.enrolledAt).toLocaleDateString()} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={student.status} />
                </div>
              </CardContent>
            </Card>

            {/* Course & Batch */}
            <Card>
              <CardHeader><CardTitle className="text-base">Course & Batch</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Course" value={course?.name || "—"} icon={<BookOpen className="h-3.5 w-3.5" />} />
                <InfoRow label="Batch" value={batch?.name || "—"} icon={<GraduationCap className="h-3.5 w-3.5" />} />
                {batch && (
                  <>
                    <InfoRow label="Schedule" value={`${batch.schedule.days.join(", ")} · ${batch.schedule.startTime} – ${batch.schedule.endTime}`} icon={<Calendar className="h-3.5 w-3.5" />} />
                    {trainer && <InfoRow label="Trainer" value={trainer.name} />}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Academic */}
        <TabsContent value="academic" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{student.gpa}</p><p className="text-xs text-muted-foreground mt-1">Current GPA</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{student.completedAssignments}/{student.totalAssignments}</p><p className="text-xs text-muted-foreground mt-1">Assignments</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{student.attendancePercentage}%</p><p className="text-xs text-muted-foreground mt-1">Attendance</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{studentQuizzes.filter((q) => q.status === "completed").length}/{studentQuizzes.length}</p><p className="text-xs text-muted-foreground mt-1">Quizzes</p></CardContent></Card>
          </div>

          {course && (
            <Card>
              <CardHeader><CardTitle className="text-base">Curriculum Progress</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {course.curriculum.map((mod, i) => (
                  <div key={mod.id} className="flex items-center gap-3">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i < 3 ? "bg-emerald-100 text-emerald-700" : i < 5 ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{mod.title}</p>
                      <p className="text-[11px] text-muted-foreground">{mod.duration}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {i < 3 ? "Completed" : i < 5 ? "In Progress" : "Upcoming"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{student.attendancePercentage}%</p><p className="text-xs text-muted-foreground mt-1">Overall Attendance</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{Math.round(student.attendancePercentage * 0.4)}</p><p className="text-xs text-muted-foreground mt-1">Classes Attended</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">{Math.round((100 - student.attendancePercentage) * 0.4)}</p><p className="text-xs text-muted-foreground mt-1">Classes Missed</p></CardContent></Card>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Attendance Rate</span><span className="font-medium">{student.attendancePercentage}%</span></div>
                <Progress value={student.attendancePercentage} className="h-3" />
                {student.attendancePercentage < 75 && (
                  <p className="text-xs text-destructive mt-2 flex items-center gap-1">⚠️ Below minimum required attendance (75%)</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Assignments ({studentAssignments.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {studentAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No assignments yet</p>
              ) : (
                studentAssignments.map((asgn) => (
                  <div key={asgn.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{asgn.title}</p>
                        <p className="text-xs text-muted-foreground">Due: {new Date(asgn.dueDate).toLocaleDateString()} · {asgn.totalMarks} marks</p>
                      </div>
                    </div>
                    <StatusBadge status={new Date(asgn.dueDate) > new Date() ? "pending" : "submitted"} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Quiz Results</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {studentQuizzes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No results yet</p>
              ) : (
                studentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{quiz.title}</p>
                      <p className="text-xs text-muted-foreground">{quiz.totalMarks} marks · {quiz.totalQuestions} questions</p>
                    </div>
                    <StatusBadge status={quiz.status === "completed" ? "pass" : quiz.status} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {["CNIC Copy", "Education Certificate", "Profile Photo", "Application Form"].map((doc) => (
                  <div key={doc} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Placeholder</Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">Document uploads will be enabled with Supabase Storage integration.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="font-medium text-end">{value}</span>
    </div>
  );
}
