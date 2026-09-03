import { students } from "@/lib/data/students";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { importHistory } from "@/lib/data/imports";
import type { Student } from "@/lib/types";
import type {
  ImportDataType,
  ImportFieldDefinition,
  ImportColumnMapping,
  ImportValidationError,
  ImportRowStatus,
  ImportPreview,
  ImportRecord,
  DuplicateStrategy,
  PaginatedResult,
  QueryParams,
} from "./types";
import { queryItems } from "./types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

// ============================================================
// FIELD DEFINITIONS PER ENTITY TYPE
// ============================================================

export const ENTITY_FIELD_DEFINITIONS: Record<ImportDataType, ImportFieldDefinition[]> = {
  students: [
    {
      key: "name",
      label: "Full Name",
      required: true,
      type: "string",
      aliases: ["name", "full name", "student name", "student_name", "fullname", "naam"],
    },
    {
      key: "email",
      label: "Email Address",
      required: true,
      type: "email",
      aliases: ["email", "email address", "e-mail", "student_email", "mail"],
    },
    {
      key: "phone",
      label: "Phone Number",
      required: true,
      type: "phone",
      aliases: ["phone", "phone number", "mobile", "mobile number", "contact", "contact number", "cell"],
    },
    {
      key: "courseId",
      label: "Course (Name or ID)",
      required: true,
      type: "string",
      aliases: ["course", "course id", "course_id", "course name", "program", "discipline"],
    },
    {
      key: "batchId",
      label: "Batch (Name or ID)",
      required: true,
      type: "string",
      aliases: ["batch", "batch id", "batch_id", "batch name", "section"],
    },
    {
      key: "registrationId",
      label: "Registration ID",
      required: false,
      type: "string",
      aliases: ["registration id", "reg id", "reg_id", "roll no", "roll number", "student id"],
    },
    {
      key: "cnic",
      label: "CNIC / B-Form",
      required: false,
      type: "string",
      aliases: ["cnic", "nic", "b-form", "bform", "national id", "identity"],
    },
    {
      key: "gender",
      label: "Gender",
      required: false,
      type: "select",
      options: ["male", "female", "other"],
      aliases: ["gender", "sex"],
    },
    {
      key: "city",
      label: "City",
      required: false,
      type: "string",
      aliases: ["city", "location", "town"],
    },
    {
      key: "education",
      label: "Last Qualification",
      required: false,
      type: "string",
      aliases: ["education", "qualification", "degree", "last qualification"],
    },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      required: false,
      type: "date",
      aliases: ["date of birth", "dob", "birth date", "birthdate"],
    },
    {
      key: "status",
      label: "Status",
      required: false,
      type: "select",
      options: ["active", "inactive", "graduated", "dropped", "suspended"],
      aliases: ["status", "student status"],
    },
  ],
  admissions: [
    { key: "studentName", label: "Applicant Name", required: true, type: "string", aliases: ["name", "full name", "applicant name", "student name"] },
    { key: "email", label: "Email", required: true, type: "email", aliases: ["email", "e-mail"] },
    { key: "phone", label: "Phone", required: true, type: "phone", aliases: ["phone", "mobile", "contact"] },
    { key: "courseId", label: "Course", required: true, type: "string", aliases: ["course", "course id", "program"] },
    { key: "cnic", label: "CNIC", required: true, type: "string", aliases: ["cnic", "nic", "b-form"] },
    { key: "gender", label: "Gender", required: false, type: "select", options: ["male", "female"], aliases: ["gender", "sex"] },
    { key: "city", label: "City", required: false, type: "string", aliases: ["city"] },
    { key: "education", label: "Education", required: false, type: "string", aliases: ["education", "qualification"] },
  ],
  batches: [
    { key: "name", label: "Batch Name", required: true, type: "string", aliases: ["batch name", "name", "batch code"] },
    { key: "courseId", label: "Course", required: true, type: "string", aliases: ["course", "course name", "course id"] },
    { key: "trainerId", label: "Trainer", required: true, type: "string", aliases: ["trainer", "trainer name", "instructor"] },
    { key: "startDate", label: "Start Date", required: true, type: "date", aliases: ["start date", "starts"] },
    { key: "endDate", label: "End Date", required: true, type: "date", aliases: ["end date", "ends"] },
    { key: "room", label: "Room / Lab", required: true, type: "string", aliases: ["room", "lab", "classroom"] },
    { key: "totalSeats", label: "Capacity", required: true, type: "number", aliases: ["capacity", "total seats", "seats"] },
  ],
  trainers: [
    { key: "name", label: "Full Name", required: true, type: "string", aliases: ["name", "full name", "trainer name"] },
    { key: "email", label: "Email", required: true, type: "email", aliases: ["email", "e-mail"] },
    { key: "phone", label: "Phone", required: true, type: "phone", aliases: ["phone", "mobile", "contact"] },
    { key: "title", label: "Job Title", required: true, type: "string", aliases: ["title", "designation", "role"] },
    { key: "expertise", label: "Expertise (comma-separated)", required: true, type: "string", aliases: ["expertise", "skills", "technologies"] },
    { key: "experience", label: "Experience", required: false, type: "string", aliases: ["experience"] },
  ],
  attendance: [
    { key: "registrationId", label: "Student Reg ID", required: true, type: "string", aliases: ["reg id", "registration id", "roll no", "student id"] },
    { key: "date", label: "Class Date", required: true, type: "date", aliases: ["date", "class date", "session date"] },
    { key: "status", label: "Status (Present/Absent/Late/Excused)", required: true, type: "select", options: ["present", "absent", "late", "excused"], aliases: ["status", "attendance status"] },
  ],
  courses: [
    { key: "name", label: "Course Name", required: true, type: "string", aliases: ["course name", "name", "title", "program"] },
    { key: "category", label: "Category", required: true, type: "string", aliases: ["category", "discipline", "track"] },
    { key: "level", label: "Level", required: true, type: "string", aliases: ["level", "difficulty"] },
    { key: "duration", label: "Duration", required: true, type: "string", aliases: ["duration", "weeks", "length"] },
    { key: "description", label: "Description", required: false, type: "string", aliases: ["description", "overview", "details"] },
  ],
  results: [
    { key: "registrationId", label: "Student Reg ID", required: true, type: "string", aliases: ["reg id", "registration id", "roll no"] },
    { key: "quizOrAssignment", label: "Quiz or Assignment Name", required: true, type: "string", aliases: ["quiz", "assignment", "title", "assessment"] },
    { key: "obtainedMarks", label: "Obtained Marks", required: true, type: "number", aliases: ["obtained marks", "marks", "score"] },
    { key: "totalMarks", label: "Total Marks", required: true, type: "number", aliases: ["total marks", "max marks", "out of"] },
  ],
};

// ============================================================
// AUTOMATIC COLUMN MAPPING
// ============================================================

export function suggestColumnMappings(
  sourceHeaders: string[],
  dataType: ImportDataType,
  sampleRows: Record<string, unknown>[]
): ImportColumnMapping[] {
  const definitions = ENTITY_FIELD_DEFINITIONS[dataType] || [];

  return sourceHeaders.map((header) => {
    const norm = header.toLowerCase().trim();
    const matchedDef = definitions.find(
      (def) =>
        def.key.toLowerCase() === norm ||
        def.label.toLowerCase() === norm ||
        def.aliases.some((alias) => alias === norm || norm.includes(alias))
    );

    const sampleValues = sampleRows
      .map((r) => String(r[header] ?? ""))
      .filter(Boolean)
      .slice(0, 3);

    return {
      sourceColumn: header,
      targetField: matchedDef ? matchedDef.key : "__ignore__",
      isMatched: !!matchedDef,
      isRequired: matchedDef ? matchedDef.required : false,
      sampleValues,
    };
  });
}

// ============================================================
// DATASET VALIDATION
// ============================================================

export function validateDataset(
  rows: Record<string, string>[],
  mappings: ImportColumnMapping[],
  dataType: ImportDataType
): ImportPreview {
  const definitions = ENTITY_FIELD_DEFINITIONS[dataType] || [];
  const fieldMap = new Map(mappings.map((m) => [m.targetField, m.sourceColumn]));

  const rowStatuses: ImportRowStatus[] = [];
  let validCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;

  // Track in-file duplicates
  const seenEmails = new Set<string>();
  const seenRegIds = new Set<string>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // header is row 1
    const errors: ImportValidationError[] = [];
    let isDuplicate = false;

    // Check each defined field
    definitions.forEach((def) => {
      const sourceCol = fieldMap.get(def.key);
      const rawValue = sourceCol ? (row[sourceCol] || "").toString().trim() : "";

      // Required check
      if (def.required && !rawValue) {
        errors.push({
          row: rowNumber,
          column: sourceCol || def.label,
          field: def.key,
          value: rawValue,
          error: `${def.label} is required and cannot be empty`,
          severity: "error",
        });
      }

      // Email format check
      if (def.type === "email" && rawValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(rawValue)) {
          errors.push({
            row: rowNumber,
            column: sourceCol || def.label,
            field: def.key,
            value: rawValue,
            error: `Invalid email address format`,
            severity: "error",
          });
        }
      }

      // Specific checks for Students
      if (dataType === "students") {
        if (def.key === "courseId" && rawValue) {
          const courseMatch = courses.find(
            (c) => c.id.toLowerCase() === rawValue.toLowerCase() || c.name.toLowerCase().includes(rawValue.toLowerCase())
          );
          if (!courseMatch) {
            errors.push({
              row: rowNumber,
              column: sourceCol || def.label,
              field: def.key,
              value: rawValue,
              error: `Course "${rawValue}" not found in institute catalog`,
              severity: "error",
            });
          }
        }

        if (def.key === "batchId" && rawValue) {
          const batchMatch = batches.find(
            (b) => b.id.toLowerCase() === rawValue.toLowerCase() || b.name.toLowerCase() === rawValue.toLowerCase()
          );
          if (!batchMatch) {
            errors.push({
              row: rowNumber,
              column: sourceCol || def.label,
              field: def.key,
              value: rawValue,
              error: `Batch "${rawValue}" does not exist`,
              severity: "warning",
            });
          }
        }

        // Duplicate checks
        if (def.key === "email" && rawValue) {
          const normEmail = rawValue.toLowerCase();
          const existing = students.some((s) => s.email.toLowerCase() === normEmail);
          if (existing || seenEmails.has(normEmail)) {
            isDuplicate = true;
            errors.push({
              row: rowNumber,
              column: sourceCol || def.label,
              field: def.key,
              value: rawValue,
              error: `Duplicate email address found`,
              severity: "warning",
            });
          }
          seenEmails.add(normEmail);
        }

        if (def.key === "registrationId" && rawValue) {
          const normReg = rawValue.toUpperCase();
          const existing = students.some((s) => s.registrationId.toUpperCase() === normReg);
          if (existing || seenRegIds.has(normReg)) {
            isDuplicate = true;
            errors.push({
              row: rowNumber,
              column: sourceCol || def.label,
              field: def.key,
              value: rawValue,
              error: `Duplicate Registration ID found`,
              severity: "warning",
            });
          }
          seenRegIds.add(normReg);
        }
      }
    });

    const hasErrors = errors.some((e) => e.severity === "error");
    const status = hasErrors ? "error" : isDuplicate ? "duplicate" : "valid";

    if (hasErrors) errorCount++;
    else if (isDuplicate) duplicateCount++;
    else validCount++;

    rowStatuses.push({
      row: rowNumber,
      data: row,
      status,
      errors,
    });
  });

  return {
    totalRows: rows.length,
    validRows: validCount,
    errorRows: errorCount,
    duplicateRows: duplicateCount,
    rows: rowStatuses,
    columns: mappings,
  };
}

// ============================================================
// IMPORT EXECUTION
// ============================================================

export async function executeImport(
  fileName: string,
  fileSize: number,
  dataType: ImportDataType,
  preview: ImportPreview,
  strategy: DuplicateStrategy
): Promise<ImportRecord> {
  const definitions = ENTITY_FIELD_DEFINITIONS[dataType] || [];
  const fieldMap = new Map(preview.columns.map((m) => [m.targetField, m.sourceColumn]));

  let importedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const errorReport: ImportValidationError[] = [];

  for (const rowStatus of preview.rows) {
    if (rowStatus.status === "error") {
      failedCount++;
      errorReport.push(...rowStatus.errors);
      continue;
    }

    if (rowStatus.status === "duplicate") {
      if (strategy === "skip") {
        skippedCount++;
        continue;
      }
    }

    // Process valid student import
    if (dataType === "students") {
      try {
        const getVal = (key: string) => {
          const col = fieldMap.get(key);
          return col ? (rowStatus.data[col] || "").toString().trim() : "";
        };

        const courseVal = getVal("courseId");
        const courseMatch = courses.find(
          (c) => c.id.toLowerCase() === courseVal.toLowerCase() || c.name.toLowerCase().includes(courseVal.toLowerCase())
        );

        const batchVal = getVal("batchId");
        const batchMatch = batches.find(
          (b) => b.id.toLowerCase() === batchVal.toLowerCase() || b.name.toLowerCase() === batchVal.toLowerCase()
        );

        const existingIndex = students.findIndex(
          (s) => s.email.toLowerCase() === getVal("email").toLowerCase() ||
                 (getVal("registrationId") && s.registrationId.toUpperCase() === getVal("registrationId").toUpperCase())
        );

        if (existingIndex >= 0 && strategy === "update") {
          // Update existing
          students[existingIndex] = {
            ...students[existingIndex],
            name: getVal("name") || students[existingIndex].name,
            phone: getVal("phone") || students[existingIndex].phone,
            city: getVal("city") || students[existingIndex].city,
            education: getVal("education") || students[existingIndex].education,
          };
          importedCount++;
        } else {
          // Insert new
          const courseId = courseMatch ? courseMatch.id : "course-1";
          const batchId = batchMatch ? batchMatch.id : "batch-3";
          const coursePrefix = courseId.replace("course-", "C");
          const regId = getVal("registrationId") || `MH-${coursePrefix}-2026-${String(students.length + 1).padStart(4, "0")}`;

          const newStudent: Student = {
            id: `student-${students.length + 1}`,
            registrationId: regId,
            name: getVal("name"),
            email: getVal("email"),
            phone: getVal("phone"),
            avatar: `/images/students/student-${(students.length % 10) + 1}.jpg`,
            gender: (getVal("gender") as Student["gender"]) || "male",
            dateOfBirth: getVal("dateOfBirth") || "2002-01-01",
            cnic: getVal("cnic") || "35201-XXXXXXX-X",
            address: "Imported Record Address",
            city: getVal("city") || "Karachi",
            education: getVal("education") || "Intermediate",
            courseId,
            batchId,
            status: "active",
            enrolledAt: new Date().toISOString().split("T")[0],
            attendancePercentage: 85,
            gpa: 3.5,
            completedAssignments: 5,
            totalAssignments: 20,
          };

          students.unshift(newStudent);
          importedCount++;
        }
      } catch (err: unknown) {
        failedCount++;
        errorReport.push({
          row: rowStatus.row,
          column: "general",
          field: "general",
          value: "",
          error: err instanceof Error ? err.message : "Failed to import row",
          severity: "error",
        });
      }
    }
  }

  const record: ImportRecord = {
    id: `import-${importHistory.length + 1}`,
    fileName,
    fileSize,
    dataType,
    totalRows: preview.totalRows,
    importedRows: importedCount,
    failedRows: failedCount,
    duplicateRows: preview.duplicateRows,
    skippedRows: skippedCount,
    status: failedCount > 0 && importedCount === 0 ? "failed" : "completed",
    duplicateStrategy: strategy,
    importedBy: "Admin User",
    importedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    errorReport: errorReport.length > 0 ? errorReport : undefined,
  };

  importHistory.unshift(record);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("import_jobs")
      .insert({
        id: record.id,
        file_name: record.fileName,
        file_size: record.fileSize,
        data_type: record.dataType,
        total_rows: record.totalRows,
        imported_rows: record.importedRows,
        failed_rows: record.failedRows,
        status: record.status as any,
        imported_by: record.importedBy,
      } as any)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase import_jobs insert error:", error);
      });
  }

  return record;
}

// ============================================================
// IMPORT HISTORY QUERIES
// ============================================================

export function getImportHistory(params: QueryParams = {}): PaginatedResult<ImportRecord> {
  return queryItems(importHistory, { pageSize: 10, ...params }, ["fileName", "dataType", "importedBy", "status"]);
}

export function getImportById(id: string): ImportRecord | undefined {
  return importHistory.find((i) => i.id === id);
}
