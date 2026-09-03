"use client";

import React, { useState, use } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getApplicationById,
  updateApplicationStatus,
  convertToStudent,
} from "@/lib/services/admission-service";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import type { ApplicationStatus } from "@/lib/types";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function AdmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [application, setApplication] = useState(() =>
    getApplicationById(resolvedParams.id)
  );

  const [notes, setNotes] = useState(application?.notes || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [enrollError, setEnrollError] = useState<string | null>(null);

  if (!application) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="font-semibold text-lg">Application Not Found</p>
        <Link href="/admin/admissions">
          <Button variant="outline">Back to Admissions</Button>
        </Link>
      </div>
    );
  }

  const course = courses.find((c) => c.id === application.courseId);
  const availableBatches = batches.filter((b) => b.courseId === application.courseId);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    const res = updateApplicationStatus(application.id, newStatus, notes);
    if (res.success && res.data) {
      setApplication({ ...res.data });
    }
    setIsUpdating(false);
  };

  const handleConfirmEnrollment = () => {
    if (!selectedBatchId) {
      setEnrollError("Please select an active cohort batch.");
      return;
    }

    setIsUpdating(true);
    setEnrollError(null);

    const res = convertToStudent(application.id, selectedBatchId);
    if (res.success && res.data) {
      setEnrollDialogOpen(false);
      // Redirect to newly created student's profile
      router.push(`/admin/students/${res.data.id}`);
    } else {
      setEnrollError(res.error || "Failed to convert application to student record.");
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <PageHeader
        title={`Application: ${application.studentName}`}
        description={`Submitted ${new Date(application.submittedAt).toLocaleDateString()} · ID: ${application.applicationId}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Admissions", href: "/admin/admissions" },
          { label: application.applicationId },
        ]}
        actions={
          <Link href="/admin/admissions">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 me-2" /> Back to Queue
            </Button>
          </Link>
        }
      />

      {/* Header Banner */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold">{application.studentName}</h2>
                <StatusBadge status={application.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                Target Program: <span className="font-semibold text-foreground">{course?.name}</span> · CNIC:{" "}
                {application.cnic}
              </p>
            </div>

            {/* Status Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {application.status !== "under-review" && application.status !== "approved" && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange("under-review")}
                >
                  <Clock className="h-3.5 w-3.5 me-1.5" /> Under Review
                </Button>
              )}

              {application.status !== "waitlisted" && application.status !== "approved" && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange("waitlisted")}
                >
                  Waitlist
                </Button>
              )}

              {application.status !== "rejected" && (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange("rejected")}
                >
                  <XCircle className="h-3.5 w-3.5 me-1.5" /> Reject
                </Button>
              )}

              {application.status !== "approved" && (
                <Button
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => {
                    setSelectedBatchId(application.preferredBatchId || availableBatches[0]?.id || "");
                    setEnrollDialogOpen(true);
                  }}
                  className="bg-brand hover:bg-brand/90 text-white font-medium"
                >
                  <UserPlus className="h-3.5 w-3.5 me-1.5" /> Approve & Convert to Student
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Details Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Candidate Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applicant Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Full Name</span>
              <span className="font-medium">{application.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender</span>
              <span className="font-medium capitalize">{application.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date of Birth</span>
              <span className="font-medium">{application.dateOfBirth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CNIC / B-Form</span>
              <span className="font-medium font-mono">{application.cnic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">City</span>
              <span className="font-medium">{application.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Education</span>
              <span className="font-medium">{application.education}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact & Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{application.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{application.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium text-end max-w-[200px] truncate">{application.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preferred Batch</span>
              <span className="font-medium">{application.preferredBatchId || "Any Available Batch"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submitted At</span>
              <span className="font-medium">{new Date(application.submittedAt).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Statement of Motivation */}
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Statement of Purpose / Motivation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted/40 border text-sm italic text-muted-foreground leading-relaxed">
              "{application.motivation}"
            </div>
          </CardContent>
        </Card>

        {/* Review Notes */}
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Internal Administrative Review Notes</CardTitle>
            <CardDescription>Notes are saved to the audit log for committee transparency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Add review notes, interview feedback, or verification remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdating}
                onClick={() => handleStatusChange(application.status)}
              >
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Convert to Student Dialog */}
      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll Candidate as Active Student</DialogTitle>
            <DialogDescription>
              This will officially generate a permanent student registration record for{" "}
              <strong>{application.studentName}</strong> and mark this application as approved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {enrollError && (
              <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{enrollError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Course</label>
              <p className="text-sm font-medium">{course?.name}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Assign Cohort Batch</label>
              <Select value={selectedBatchId} onValueChange={(val) => { if (val) setSelectedBatchId(val); }}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select active batch" />
                </SelectTrigger>
                <SelectContent>
                  {availableBatches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} — Room {b.room} ({b.enrolledSeats}/{b.totalSeats} seats)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={isUpdating || !selectedBatchId}
              onClick={handleConfirmEnrollment}
              className="bg-brand hover:bg-brand/90 text-white"
            >
              {isUpdating ? "Enrolling..." : "Confirm & Generate Student Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
