import type { StudentDocument, DocumentType, DocumentStatus } from "@/lib/types";
import { initialDocuments } from "@/lib/data/documents";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

const documentStore: StudentDocument[] = [...initialDocuments];

const docSearchFields: (keyof StudentDocument)[] = [
  "title",
  "studentName",
  "courseName",
  "type",
  "status",
];

export function getAllDocuments(params: QueryParams = {}): PaginatedResult<StudentDocument> {
  return queryItems(documentStore, { pageSize: 15, ...params }, docSearchFields);
}

export function getStudentDocuments(studentId: string): StudentDocument[] {
  return documentStore.filter((d) => d.studentId === studentId);
}

export function getDocumentById(id: string): StudentDocument | undefined {
  return documentStore.find((d) => d.id === id);
}

export function uploadDocument(data: {
  studentId: string;
  studentName: string;
  courseName?: string;
  batchName?: string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  fileSize?: string;
}): StudentDocument {
  const newDoc: StudentDocument = {
    id: `doc-${Date.now()}`,
    studentId: data.studentId,
    studentName: data.studentName,
    courseName: data.courseName || "Web Development",
    batchName: data.batchName || "WD-01",
    title: data.title,
    type: data.type,
    fileUrl: data.fileUrl,
    fileSize: data.fileSize || "1.5 MB",
    status: "pending",
    uploadedAt: new Date().toISOString().split("T")[0],
    notes: "Awaiting administrative review.",
  };

  documentStore.unshift(newDoc);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("student_documents")
      .insert({
        id: newDoc.id,
        student_id: newDoc.studentId,
        document_type: newDoc.type as any,
        file_name: newDoc.title,
        file_url: newDoc.fileUrl,
        status: "pending",
        uploaded_at: new Date().toISOString(),
      } as any)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase document upload sync error:", error);
      });
  }

  return newDoc;
}

export function verifyDocument(
  id: string,
  verifiedBy = "Admissions Registrar",
  notes?: string
): boolean {
  const doc = documentStore.find((d) => d.id === id);
  if (!doc) return false;

  doc.status = "verified";
  doc.verifiedBy = verifiedBy;
  doc.verifiedAt = new Date().toISOString().split("T")[0];
  if (notes) doc.notes = notes;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("student_documents")
      .update({
        status: "verified",
        verified_at: new Date().toISOString(),
      } as any)
      .eq("id", id)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase document verify error:", error);
      });
  }

  return true;
}

export function rejectDocument(id: string, reason: string): boolean {
  const doc = documentStore.find((d) => d.id === id);
  if (!doc) return false;

  doc.status = "rejected";
  doc.notes = reason;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("student_documents")
      .update({
        status: "rejected",
        rejection_reason: reason,
      } as any)
      .eq("id", id)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase document reject error:", error);
      });
  }

  return true;
}
