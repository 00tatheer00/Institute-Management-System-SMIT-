"use client";

import { useState } from "react";
import { getStudentDocuments, uploadDocument } from "@/lib/services/document-service";
import type { StudentDocument, DocumentType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText, Upload, CheckCircle2, Clock, XCircle,
  Download, Eye, AlertCircle, ShieldCheck
} from "lucide-react";

const typeLabelMap: Record<DocumentType, string> = {
  cnic: "CNIC / B-Form",
  "b-form": "B-Form / Birth Certificate",
  matric: "Matriculation (SSC)",
  intermediate: "Intermediate (HSSC)",
  degree: "University Degree / BS",
  "admission-slip": "Admission Confirmation Slip",
  certificate: "Prior Technical Certificate",
  other: "Other Supporting Document",
};

export default function StudentDocumentsPage() {
  const [documents, setDocuments] = useState<StudentDocument[]>(() =>
    getStudentDocuments("student-1")
  );

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState<DocumentType>("matric");
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc = uploadDocument({
      studentId: "student-1",
      studentName: "Muhammad Khan",
      title: docTitle.trim(),
      type: docType,
      fileUrl: "/mock-docs/sample-upload.pdf",
      fileSize: "1.8 MB",
    });

    setDocuments([newDoc, ...documents]);
    setDocTitle("");
    setFileName("");
    setIsUploadOpen(false);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">
            <FileText className="h-3.5 w-3.5" />
            Verification Vault
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Institutional Documents</h1>
          <p className="text-sm text-muted-foreground">
            Academic credentials, CNIC verification files, and admission undertakings
          </p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5 text-xs h-9 bg-teal-600 hover:bg-teal-700 text-white font-medium">
                <Upload className="h-4 w-4" /> Upload Document
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Upload Verification Document</DialogTitle>
              <DialogDescription className="text-xs">
                Submit an official PDF or high-resolution scan for administrative verification
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Document Category
                </label>
                <Select
                  value={docType}
                  onValueChange={(val: string | null) => {
                    if (val) setDocType(val as DocumentType);
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cnic">CNIC / B-Form</SelectItem>
                    <SelectItem value="matric">Matriculation (SSC)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (HSSC)</SelectItem>
                    <SelectItem value="degree">University Degree / BS</SelectItem>
                    <SelectItem value="admission-slip">Admission Undertaking</SelectItem>
                    <SelectItem value="certificate">Technical Certificate</SelectItem>
                    <SelectItem value="other">Other Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Document Title
                </label>
                <Input
                  placeholder="e.g. Higher Secondary Certificate Marksheet"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  File Attachment (PDF / JPG / PNG)
                </label>
                <Input
                  type="file"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  className="h-9 text-xs"
                  required
                />
                <p className="text-[10px] text-muted-foreground">
                  Max file size: 10MB. Prepared for Supabase Storage bucket: <code>student-documents</code>
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUploadOpen(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Submit for Verification
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-teal-600" />
          Document uploaded successfully! It has been submitted to the registrar review queue.
        </div>
      )}

      {/* Overview Notice */}
      <Card className="border-teal-200 dark:border-teal-900/40 bg-teal-50/20 dark:bg-teal-950/10">
        <CardContent className="p-4 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0" />
          <div className="text-xs text-muted-foreground">
            <strong className="text-foreground">Official Verification Notice:</strong> All admitted candidates are required to keep their attested educational certificates and identity proof up to date for course graduation and government certification eligibility.
          </div>
        </CardContent>
      </Card>

      {/* Documents Ledger Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Uploaded Credentials ({documents.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review status, review auditor notes, and access stored file references
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Document Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">File Size</th>
                  <th className="py-3 px-4 font-semibold">Uploaded</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Auditor Notes</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {doc.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                        {typeLabelMap[doc.type] || doc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                      {doc.fileSize || "1.5 MB"}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                      {doc.uploadedAt}
                    </td>
                    <td className="py-3 px-4">
                      {doc.status === "verified" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      ) : doc.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-0.5 rounded-full">
                          <XCircle className="h-3 w-3" /> Action Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
                          <Clock className="h-3 w-3" /> Under Review
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                      {doc.notes || (doc.status === "verified" ? `Verified by ${doc.verifiedBy}` : "—")}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 gap-1"
                        onClick={() => alert(`Opening document reference: ${doc.title}`)}
                      >
                        <Eye className="h-3 w-3" /> View
                      </Button>
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
