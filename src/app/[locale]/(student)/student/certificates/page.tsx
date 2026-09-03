"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  getStudentCertificates,
  checkCertificateEligibility,
} from "@/lib/services/certificate-service";
import type { Certificate } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Award, CheckCircle2, XCircle, QrCode, ExternalLink,
  Printer, Download, ShieldCheck, Calendar, BookOpen, User
} from "lucide-react";

export default function StudentCertificatesPage() {
  const [certificates] = useState<Certificate[]>(() =>
    getStudentCertificates("student-113").length > 0
      ? getStudentCertificates("student-113")
      : [
          {
            id: "cert-demo",
            certificateId: "MH-WD-2026-00124",
            studentId: "student-1",
            studentName: "Muhammad Khan",
            courseId: "course-1",
            courseName: "Web Development",
            batchId: "batch-1",
            batchName: "WD-01 (Morning)",
            issueDate: "2026-05-20",
            grade: "A",
            status: "issued",
          },
        ]
  );

  const [eligibility] = useState(() => checkCertificateEligibility("student-1"));
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          <Award className="h-3.5 w-3.5" />
          Academic Credentials
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Certificates & Graduation Standing</h1>
        <p className="text-sm text-muted-foreground">
          View official verified institute certificates and track real-time graduation eligibility
        </p>
      </div>

      {/* Real-time Certificate Eligibility Gauge Card */}
      <Card className="border-amber-200 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/30 to-background dark:from-amber-950/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-600" /> Certificate Eligibility Evaluation
              </CardTitle>
              <CardDescription className="text-xs">
                Criteria established by the Academic Council for official credential issuance
              </CardDescription>
            </div>
            {eligibility.isEligible ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" /> Eligible for Graduation
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                In Progress
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Criteria 1: Attendance */}
            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">Attendance</span>
                {eligibility.isAttendanceMet ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-amber-600" />
                )}
              </div>
              <p className="text-xl font-bold text-foreground">
                {eligibility.attendanceRate}%
              </p>
              <p className="text-[11px] text-muted-foreground">
                Min required: {eligibility.attendanceRequired}%
              </p>
            </div>

            {/* Criteria 2: Coursework Completion */}
            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">Assignments</span>
                {eligibility.isAssignmentMet ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-amber-600" />
                )}
              </div>
              <p className="text-xl font-bold text-foreground">
                {eligibility.assignmentCompletionRate}%
              </p>
              <p className="text-[11px] text-muted-foreground">
                Min required: {eligibility.assignmentRequired}%
              </p>
            </div>

            {/* Criteria 3: Quizzes & Passing GPA */}
            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">Academic Grade</span>
                {eligibility.isQuizzesMet ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-amber-600" />
                )}
              </div>
              <p className="text-xl font-bold text-emerald-600">
                Grade {eligibility.grade} ({eligibility.gpa.toFixed(1)} GPA)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Passing standard: GPA &gt; 2.0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earned Certificates Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold">Issued Certificates</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-amber-200 dark:border-amber-900/50 hover:border-amber-400 transition-colors">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono">
                        {cert.certificateId}
                      </span>
                      <h4 className="text-base font-bold text-foreground">
                        {cert.courseName}
                      </h4>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Grade {cert.grade}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-y py-2.5">
                  <div>
                    <span className="block text-[10px] uppercase">Issued Date:</span>
                    <strong className="text-foreground">{cert.issueDate}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase">Cohort:</span>
                    <strong className="text-foreground">{cert.batchName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1 text-xs h-8 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <Award className="h-3.5 w-3.5" /> View Certificate
                  </Button>
                  <Link
                    href={`/verify-certificate?id=${cert.certificateId}`}
                    target="_blank"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" /> Verify Link
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Digital Certificate Preview Modal */}
      {selectedCert && (
        <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-2 border-amber-300">
            <div className="p-8 bg-gradient-to-br from-amber-50/60 via-background to-amber-50/40 text-center space-y-6">
              {/* Certificate Header Branding */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold tracking-widest uppercase">
                  Certificate of Professional Achievement
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-foreground pt-2">
                  MOHSIN AND HUMA IT CENTER × SMIT
                </h2>
                <p className="text-xs text-muted-foreground">
                  Center for Technology Excellence & Free Professional Training
                </p>
              </div>

              {/* Recipient */}
              <div className="space-y-2 py-2">
                <p className="text-xs text-muted-foreground italic">This is to officially certify that</p>
                <h3 className="text-2xl font-black text-foreground underline decoration-amber-400 decoration-2 underline-offset-8">
                  {selectedCert.studentName}
                </h3>
                <p className="text-xs text-muted-foreground pt-1">
                  has successfully satisfied all rigorous curriculum milestones, laboratory assignments, and examination standards in
                </p>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                  {selectedCert.courseName}
                </p>
              </div>

              {/* Certificate Metadata & QR */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-card border text-xs">
                <div className="text-start space-y-1">
                  <p><span className="text-muted-foreground">Credential ID:</span> <strong className="font-mono">{selectedCert.certificateId}</strong></p>
                  <p><span className="text-muted-foreground">Performance Grade:</span> <strong className="text-emerald-600 font-bold">{selectedCert.grade}</strong></p>
                  <p><span className="text-muted-foreground">Date of Issue:</span> <strong>{selectedCert.issueDate}</strong></p>
                </div>

                <div className="flex items-center gap-3 border-s sm:ps-4">
                  <div className="h-14 w-14 rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                    <QrCode className="h-10 w-10 text-foreground" />
                  </div>
                  <div className="text-start text-[10px] text-muted-foreground max-w-[140px]">
                    Scan QR to authenticate via public portal
                  </div>
                </div>
              </div>

              {/* Signatures & Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t">
                <div className="text-start text-[11px] text-muted-foreground">
                  <p className="font-bold text-foreground">Office of the Academic Director</p>
                  <p>Mohsin and Huma IT Center</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 gap-1.5"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-3.5 w-3.5" /> Print / PDF
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs h-8 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => setSelectedCert(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
