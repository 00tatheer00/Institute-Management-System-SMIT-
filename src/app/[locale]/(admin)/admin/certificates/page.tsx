"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import {
  getCertificates,
  issueCertificate,
  checkCertificateEligibility,
} from "@/lib/services/certificate-service";
import { students } from "@/lib/data/students";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import type { Certificate } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Award, Plus, Search, CheckCircle2, QrCode,
  ExternalLink, Printer, ShieldCheck, AlertCircle
} from "lucide-react";

export default function AdminCertificatesPage() {
  const [certList, setCertList] = useState<Certificate[]>(() =>
    getCertificates({ pageSize: 100 }).data
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("student-1");
  const [issueGrade, setIssueGrade] = useState("A");
  const [viewCert, setViewCert] = useState<Certificate | null>(null);

  // Live check of selected student's eligibility
  const candidateEligibility = useMemo(() => {
    return checkCertificateEligibility(selectedStudentId);
  }, [selectedStudentId]);

  const filteredCerts = useMemo(() => {
    return certList.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.certificateId.toLowerCase().includes(q) ||
        c.studentName.toLowerCase().includes(q);
      const matchesCourse = selectedCourse === "all" || c.courseId === selectedCourse;
      return matchesSearch && matchesCourse;
    });
  }, [certList, searchQuery, selectedCourse]);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st) return;

    const crs = courses.find((c) => c.id === st.courseId);
    const btc = batches.find((b) => b.id === st.batchId);

    const issued = issueCertificate({
      studentId: st.id,
      studentName: st.name,
      courseId: st.courseId,
      courseName: crs?.name || "Web Development",
      batchId: st.batchId,
      batchName: btc?.name || "WD-01",
      grade: issueGrade,
    });

    setCertList([issued, ...certList]);
    setIsIssueOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Digital Certificates & Credentials"
          description="Manage graduation credentials, verify authenticity, and issue official certified awards."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Certificates" },
          ]}
        />

        <Dialog open={isIssueOpen} onOpenChange={setIsIssueOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5 text-xs h-9 bg-amber-600 hover:bg-amber-700 text-white font-medium self-start sm:self-auto">
                <Plus className="h-4 w-4" /> Issue Certificate
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Issue Graduation Certificate</DialogTitle>
              <DialogDescription className="text-xs">
                Select an enrolled candidate to verify criteria and generate a certified credential
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleIssueSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Select Graduate Candidate
                </label>
                <Select
                  value={selectedStudentId}
                  onValueChange={(val: string | null) => {
                    if (val) setSelectedStudentId(val);
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.slice(0, 15).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.registrationId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Eligibility Check Live Badge */}
              <div className="p-3 rounded-lg border bg-muted/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Academic Eligibility Status:</span>
                  {candidateEligibility.isEligible ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Criteria Satisfied
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Incomplete Requirements
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground grid grid-cols-2 gap-1 pt-1 border-t">
                  <span>Attendance: <strong>{candidateEligibility.attendanceRate}%</strong> (Req: 75%)</span>
                  <span>Tasks: <strong>{candidateEligibility.assignmentCompletionRate}%</strong> (Req: 80%)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Awarded Letter Grade
                </label>
                <Select
                  value={issueGrade}
                  onValueChange={(val: string | null) => {
                    if (val) setIssueGrade(val);
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">Grade A+ (Distinction 90-100%)</SelectItem>
                    <SelectItem value="A">Grade A (Excellent 80-89%)</SelectItem>
                    <SelectItem value="B+">Grade B+ (Very Good 75-79%)</SelectItem>
                    <SelectItem value="B">Grade B (Good 70-74%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsIssueOpen(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Issue Digital Credential
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Issued Credentials</p>
          <p className="text-2xl font-bold text-foreground">{certList.length}</p>
          <p className="text-xs text-muted-foreground">Certified alumni records</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Verification System</p>
          <p className="text-2xl font-bold text-emerald-600">Active</p>
          <p className="text-xs text-muted-foreground">Public validation portal ready</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Avg Distinction Rate</p>
          <p className="text-2xl font-bold text-blue-600">92%</p>
          <p className="text-xs text-muted-foreground">Grade A &amp; A+ achievements</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search certificate ID or student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9 text-xs"
              />
            </div>

            <Select
              value={selectedCourse}
              onValueChange={(val: string | null) => {
                if (val) setSelectedCourse(val);
              }}
            >
              <SelectTrigger className="w-full sm:w-60 h-9 text-xs">
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Issued Credentials Ledger ({filteredCerts.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Tamper-evident verification records verifiable online
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Certificate ID</th>
                  <th className="py-3 px-4 font-semibold">Graduate Name</th>
                  <th className="py-3 px-4 font-semibold">Program</th>
                  <th className="py-3 px-4 font-semibold">Cohort</th>
                  <th className="py-3 px-4 font-semibold">Issue Date</th>
                  <th className="py-3 px-4 font-semibold">Grade</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-xs text-amber-700 dark:text-amber-400">
                      {cert.certificateId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {cert.studentName}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {cert.courseName}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium">
                      {cert.batchName}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                      {cert.issueDate}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-xs text-emerald-600">
                        Grade {cert.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 gap-1"
                          onClick={() => setViewCert(cert)}
                        >
                          <Award className="h-3 w-3" /> Preview
                        </Button>
                        <Link
                          href={`/verify-certificate?id=${cert.certificateId}`}
                          target="_blank"
                        >
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Digital Certificate Preview Modal */}
      {viewCert && (
        <Dialog open={!!viewCert} onOpenChange={() => setViewCert(null)}>
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-2 border-amber-300">
            <div className="p-8 bg-gradient-to-br from-amber-50/60 via-background to-amber-50/40 text-center space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold tracking-widest uppercase">
                  Official Verification Record
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-foreground pt-2">
                  MOHSIN AND HUMA IT CENTER × SMIT
                </h2>
                <p className="text-xs text-muted-foreground">
                  Center for Technology Excellence & Free Professional Training
                </p>
              </div>

              <div className="space-y-2 py-2">
                <p className="text-xs text-muted-foreground italic">This is to officially certify that</p>
                <h3 className="text-2xl font-black text-foreground underline decoration-amber-400 decoration-2 underline-offset-8">
                  {viewCert.studentName}
                </h3>
                <p className="text-xs text-muted-foreground pt-1">
                  has completed the academic curriculum requirements in
                </p>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                  {viewCert.courseName}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-card border text-xs">
                <div className="text-start space-y-1">
                  <p><span className="text-muted-foreground">Certificate ID:</span> <strong className="font-mono">{viewCert.certificateId}</strong></p>
                  <p><span className="text-muted-foreground">Grade Awarded:</span> <strong className="text-emerald-600 font-bold">{viewCert.grade}</strong></p>
                  <p><span className="text-muted-foreground">Date of Issue:</span> <strong>{viewCert.issueDate}</strong></p>
                </div>
                <div className="flex items-center gap-3 border-s sm:ps-4">
                  <div className="h-14 w-14 rounded-lg border bg-muted flex items-center justify-center">
                    <QrCode className="h-10 w-10 text-foreground" />
                  </div>
                  <div className="text-start text-[10px] text-muted-foreground max-w-[130px]">
                    Scannable verification badge
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" className="text-xs h-8 gap-1" onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5" /> Print
                </Button>
                <Button size="sm" className="text-xs h-8" onClick={() => setViewCert(null)}>
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
