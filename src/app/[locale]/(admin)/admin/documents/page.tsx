"use client";

import { useState, useMemo } from "react";
import {
  getAllDocuments,
  verifyDocument,
  rejectDocument,
} from "@/lib/services/document-service";
import type { StudentDocument, DocumentType, DocumentStatus } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileText, Search, CheckCircle2, XCircle, Clock,
  Eye, ShieldCheck, AlertCircle
} from "lucide-react";

export default function AdminDocumentsPage() {
  const [docList, setDocList] = useState<StudentDocument[]>(() =>
    getAllDocuments({ pageSize: 100 }).data
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [rejectDialogDoc, setRejectDialogDoc] = useState<StudentDocument | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filteredDocs = useMemo(() => {
    return docList.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.studentName.toLowerCase().includes(q);

      const matchesType = selectedType === "all" || d.type === selectedType;
      const matchesStatus = selectedStatus === "all" || d.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [docList, searchQuery, selectedType, selectedStatus]);

  const handleVerify = (id: string) => {
    verifyDocument(id, "Admissions Audit Officer");
    setDocList(
      docList.map((d) => (d.id === id ? { ...d, status: "verified", verifiedBy: "Admissions Audit Officer" } : d))
    );
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectDialogDoc || !rejectReason.trim()) return;

    rejectDocument(rejectDialogDoc.id, rejectReason.trim());
    setDocList(
      docList.map((d) => (d.id === rejectDialogDoc.id ? { ...d, status: "rejected", notes: rejectReason.trim() } : d))
    );

    setRejectDialogDoc(null);
    setRejectReason("");
  };

  const pendingCount = docList.filter((d) => d.status === "pending").length;
  const verifiedCount = docList.filter((d) => d.status === "verified").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Document Verification Roster"
        description="Review submitted identity credentials, attest secondary education marksheets, and process candidate verifications."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Documents" },
        ]}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Documents</p>
          <p className="text-2xl font-bold text-foreground">{docList.length}</p>
          <p className="text-xs text-muted-foreground">Uploaded across all cohorts</p>
        </Card>
        <Card className="p-4 space-y-1 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200">
          <p className="text-xs text-amber-700 dark:text-amber-400 uppercase font-semibold">Pending Audit</p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">Awaiting registrar verification</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Verified Credentials</p>
          <p className="text-2xl font-bold text-emerald-600">{verifiedCount}</p>
          <p className="text-xs text-muted-foreground">Satisfies graduation standards</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student or document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9 text-xs"
              />
            </div>

            <Select
              value={selectedType}
              onValueChange={(val: string | null) => {
                if (val) setSelectedType(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cnic">CNIC / B-Form</SelectItem>
                <SelectItem value="matric">Matriculation (SSC)</SelectItem>
                <SelectItem value="intermediate">Intermediate (HSSC)</SelectItem>
                <SelectItem value="degree">University Degree</SelectItem>
                <SelectItem value="admission-slip">Admission Undertaking</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={(val: string | null) => {
                if (val) setSelectedStatus(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending Audit</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected / Needs Re-upload</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Verification Queue ({filteredDocs.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review uploaded files and certify against NADRA and Board criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Candidate</th>
                  <th className="py-3 px-4 font-semibold">Document Title</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">File Size</th>
                  <th className="py-3 px-4 font-semibold">Uploaded</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-end">Audit Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {doc.studentName}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      {doc.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                      {doc.fileSize}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                      {doc.uploadedAt}
                    </td>
                    <td className="py-3 px-4">
                      {doc.status === "verified" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      ) : doc.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300 px-2.5 py-0.5 rounded-full">
                          <XCircle className="h-3 w-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 px-2"
                          onClick={() => alert(`Opening document reference: ${doc.title}`)}
                          title="View File"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {doc.status !== "verified" && (
                          <Button
                            size="sm"
                            className="text-xs h-7 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleVerify(doc.id)}
                          >
                            Verify
                          </Button>
                        )}
                        {doc.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                            onClick={() => {
                              setRejectDialogDoc(doc);
                              setRejectReason("");
                            }}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reject Reason Dialog */}
      {rejectDialogDoc && (
        <Dialog open={!!rejectDialogDoc} onOpenChange={() => setRejectDialogDoc(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-rose-600">
                Reject Verification Document
              </DialogTitle>
              <DialogDescription className="text-xs">
                Provide clear instructions explaining why the document was rejected so the student can re-upload
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirmReject} className="space-y-4 pt-2">
              <div className="p-3 rounded-lg bg-muted text-xs space-y-1">
                <p><strong>Candidate:</strong> {rejectDialogDoc.studentName}</p>
                <p><strong>Document:</strong> {rejectDialogDoc.title}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Reason for Rejection
                </label>
                <textarea
                  placeholder="e.g. Scanned image is blurred / attested stamp missing / name mismatch..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[80px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectDialogDoc(null)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Confirm Rejection
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
