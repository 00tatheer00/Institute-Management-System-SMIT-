import type { StudentDocument, DocumentType, DocumentStatus } from "@/lib/types";
import { initialDocuments } from "@/lib/data/documents";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";

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
  return true;
}

export function rejectDocument(id: string, reason: string): boolean {
  const doc = documentStore.find((d) => d.id === id);
  if (!doc) return false;

  doc.status = "rejected";
  doc.notes = reason;
  return true;
}
