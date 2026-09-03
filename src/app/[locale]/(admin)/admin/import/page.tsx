"use client";

import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  suggestColumnMappings,
  validateDataset,
  executeImport,
  ENTITY_FIELD_DEFINITIONS,
} from "@/lib/services/import-service";
import type {
  ImportDataType,
  ImportColumnMapping,
  ImportPreview,
  ImportRecord,
  DuplicateStrategy,
} from "@/lib/services/types";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  RefreshCw,
  Eye,
  FileCheck,
  Users,
  ClipboardList,
  Layers,
  GraduationCap,
  CalendarCheck,
  Award,
  HelpCircle,
} from "lucide-react";

type WizardStep = "type" | "upload" | "mapping" | "preview" | "progress" | "result";

export default function BulkImportPage() {
  const [step, setStep] = useState<WizardStep>("type");
  const [dataType, setDataType] = useState<ImportDataType>("students");
  const [file, setFile] = useState<File | null>(null);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ImportColumnMapping[]>([]);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [duplicateStrategy, setDuplicateStrategy] = useState<DuplicateStrategy>("skip");
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importResult, setImportResult] = useState<ImportRecord | null>(null);
  const [previewFilter, setPreviewFilter] = useState<"all" | "valid" | "error" | "duplicate">("all");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Download Sample Template
  const downloadSampleTemplate = () => {
    const definitions = ENTITY_FIELD_DEFINITIONS[dataType] || [];
    const sampleHeaders = definitions.map((d) => d.label);

    let sampleRow: Record<string, string> = {};
    if (dataType === "students") {
      sampleRow = {
        "Full Name": "Muhammad Ali Khan",
        "Email Address": "ali.khan@example.com",
        "Phone Number": "+92-300-1234567",
        "Course (Name or ID)": "Web Development",
        "Batch (Name or ID)": "WD-03",
        "Registration ID": "MH-WD-2026-0501",
        "CNIC / B-Form": "42101-1234567-1",
        Gender: "male",
        City: "Karachi",
        "Last Qualification": "Intermediate",
        "Date of Birth": "2002-05-15",
        Status: "active",
      };
    } else {
      definitions.forEach((d) => {
        sampleRow[d.label] = `Sample ${d.label}`;
      });
    }

    const ws = XLSX.utils.json_to_sheet([sampleRow], { header: sampleHeaders });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${dataType}_import_template.xlsx`);
  };

  // Process File Upload via XLSX
  const processUploadedFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON rows
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, {
          defval: "",
        });

        if (jsonData.length === 0) {
          alert("The uploaded spreadsheet appears to be empty.");
          return;
        }

        const detectedHeaders = Object.keys(jsonData[0] || {});
        setHeaders(detectedHeaders);
        setRawRows(jsonData);

        // Generate intelligent initial column mappings
        const autoMappings = suggestColumnMappings(detectedHeaders, dataType, jsonData);
        setMappings(autoMappings);

        // Move to mapping step
        setStep("mapping");
      } catch (err) {
        console.error("Error parsing spreadsheet:", err);
        alert("Failed to parse file. Please verify it is a valid .xlsx, .xls, or .csv document.");
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  // Run validation and enter Preview
  const handleProceedToPreview = () => {
    const validationResult = validateDataset(rawRows, mappings, dataType);
    setPreview(validationResult);
    setStep("preview");
  };

  // Execute Import Simulation
  const handleStartImport = async () => {
    if (!preview || !file) return;

    setStep("progress");
    setImportProgress(10);

    // Simulate batch chunks
    const progressInterval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 20;
      });
    }, 400);

    try {
      const result = await executeImport(
        file.name,
        file.size,
        dataType,
        preview,
        duplicateStrategy
      );

      clearInterval(progressInterval);
      setImportProgress(100);

      setTimeout(() => {
        setImportResult(result);
        setStep("result");
      }, 500);
    } catch (err) {
      console.error("Import failed:", err);
      alert("An unexpected error occurred during import execution.");
      setStep("preview");
    }
  };

  // Reset wizard
  const handleReset = () => {
    setFile(null);
    setRawRows([]);
    setHeaders([]);
    setMappings([]);
    setPreview(null);
    setImportProgress(0);
    setImportResult(null);
    setStep("type");
  };

  // Export Error Report
  const downloadErrorReport = () => {
    if (!importResult?.errorReport) return;
    const ws = XLSX.utils.json_to_sheet(importResult.errorReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Errors");
    XLSX.writeFile(wb, `import_errors_${importResult.id}.xlsx`);
  };

  const fieldDefs = ENTITY_FIELD_DEFINITIONS[dataType] || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <PageHeader
        title="Institute Bulk Data Importer"
        description="High-throughput batch import engine supporting Excel (.xlsx) and CSV datasets for scale (1,000–2,000+ records)."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Bulk Import" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/imports">
              <Button variant="outline" size="sm">
                View Past Import History
              </Button>
            </Link>
          </div>
        }
      />

      {/* Wizard Step Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-medium border-b pb-4">
        {[
          { id: "type", label: "1. Data Type" },
          { id: "upload", label: "2. Upload File" },
          { id: "mapping", label: "3. Map Columns" },
          { id: "preview", label: "4. Validate & Preview" },
          { id: "result", label: "5. Completion" },
        ].map((s) => {
          const isCurrent = step === s.id || (step === "progress" && s.id === "preview");
          return (
            <div
              key={s.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isCurrent
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* STEP 1: SELECT DATA TYPE                                     */}
      {/* ============================================================ */}
      {step === "type" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Select Target Institute Entity</h3>
            <p className="text-sm text-muted-foreground">
              Choose the entity schema you are importing from your spreadsheet.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "students" as const,
                title: "Students Cohort",
                desc: "Full student demographic, registration, course enrollment, and contact records.",
                icon: <GraduationCap className="h-6 w-6 text-brand" />,
                badge: "Full Scale (1,000–2,000+)",
                supported: true,
              },
              {
                id: "admissions" as const,
                title: "Admission Applications",
                desc: "Inbound public admission forms to be reviewed and approved.",
                icon: <ClipboardList className="h-6 w-6 text-brand" />,
                badge: "Phase 2 Supported",
                supported: true,
              },
              {
                id: "batches" as const,
                title: "Academic Batches",
                desc: "Classroom sections, scheduled cohorts, capacities, and room assignments.",
                icon: <Layers className="h-6 w-6 text-brand" />,
                badge: "Phase 2 Supported",
                supported: true,
              },
              {
                id: "trainers" as const,
                title: "Trainers & Instructors",
                desc: "Faculty profiles, specializations, contact details, and qualifications.",
                icon: <Users className="h-6 w-6 text-brand" />,
                badge: "Phase 2 Supported",
                supported: true,
              },
              {
                id: "attendance" as const,
                title: "Attendance Logs",
                desc: "Daily session student attendance logs and excused records.",
                icon: <CalendarCheck className="h-6 w-6 text-brand" />,
                badge: "Phase 3 Ready",
                supported: true,
              },
              {
                id: "results" as const,
                title: "Assessment Results",
                desc: "Quiz scores, assignments marks, and final course exam grades.",
                icon: <Award className="h-6 w-6 text-brand" />,
                badge: "Phase 3 Ready",
                supported: true,
              },
            ].map((card) => (
              <Card
                key={card.id}
                onClick={() => card.supported && setDataType(card.id)}
                className={`cursor-pointer transition-all border-2 ${
                  dataType === card.id
                    ? "border-brand bg-brand/5 shadow-md"
                    : "border-border hover:border-brand/40"
                }`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-background border">{card.icon}</div>
                    <Badge variant="outline" className="text-[10px]">
                      {card.badge}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">{card.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep("upload")} className="px-6">
              Next: Upload File <ArrowRight className="h-4 w-4 ms-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 2: FILE UPLOAD                                          */}
      {/* ============================================================ */}
      {step === "upload" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold capitalize">Upload {dataType} Spreadsheet</h3>
              <p className="text-sm text-muted-foreground">
                Drop your Excel (.xlsx, .xls) or comma-separated (.csv) file below.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadSampleTemplate}>
              <Download className="h-4 w-4 me-2" /> Download Sample {dataType} Template (.xlsx)
            </Button>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragOver ? "border-brand bg-brand/10" : "border-border hover:border-brand/50 bg-muted/20"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <div className="h-16 w-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-base">Drag and drop your spreadsheet here</h4>
            <p className="text-xs text-muted-foreground mt-1">or click to browse from your device</p>
            <div className="flex items-center gap-2 mt-4 text-[11px] text-muted-foreground bg-background px-3 py-1.5 rounded-full border">
              <span>Supported: .xlsx, .xls, .csv</span>
              <span>•</span>
              <span>Max file size: 15MB</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setStep("type")}>
              <ArrowLeft className="h-4 w-4 me-2" /> Back
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3 & 4: COLUMN DETECTION & MAPPING                       */}
      {/* ============================================================ */}
      {step === "mapping" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-semibold">Map Spreadsheet Columns to System Fields</h3>
              <p className="text-sm text-muted-foreground">
                Detected <strong>{headers.length} columns</strong> and <strong>{rawRows.length} rows</strong> in{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{file?.name}</code>.
              </p>
            </div>
            <Badge variant="secondary">Entity: {dataType.toUpperCase()}</Badge>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[30%]">Spreadsheet Header</TableHead>
                    <TableHead className="w-[30%]">Sample Data (First Rows)</TableHead>
                    <TableHead className="w-[30%]">Maps to System Field</TableHead>
                    <TableHead className="w-[10%] text-end">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((mapping, idx) => {
                    return (
                      <TableRow key={mapping.sourceColumn}>
                        <TableCell className="font-medium text-sm">
                          {mapping.sourceColumn}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {mapping.sampleValues.length > 0
                            ? mapping.sampleValues.join(", ")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={mapping.targetField}
                            onValueChange={(val) => {
                              if (!val) return;
                              const updated = [...mappings];
                              updated[idx].targetField = val;
                              updated[idx].isMatched = val !== "__ignore__";
                              setMappings(updated);
                            }}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__ignore__">
                                <em>-- Ignore this column --</em>
                              </SelectItem>
                              {fieldDefs.map((def) => (
                                <SelectItem key={def.key} value={def.key}>
                                  {def.label} {def.required && "*"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-end">
                          {mapping.targetField !== "__ignore__" ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                              Matched
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Ignored
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setStep("upload")}>
              <ArrowLeft className="h-4 w-4 me-2" /> Upload Different File
            </Button>
            <Button onClick={handleProceedToPreview}>
              Validate & Preview Records ({rawRows.length}) <ArrowRight className="h-4 w-4 ms-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 5 & 6: PREVIEW & DUPLICATE STRATEGY                     */}
      {/* ============================================================ */}
      {step === "preview" && preview && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold">Pre-Import Validation & Preview</h3>
              <p className="text-sm text-muted-foreground">
                All records have been parsed and checked against existing academy databases.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                Total: {preview.totalRows}
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Valid: {preview.validRows}
              </Badge>
              {preview.duplicateRows > 0 && (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                  Duplicates: {preview.duplicateRows}
                </Badge>
              )}
              {preview.errorRows > 0 && (
                <Badge className="bg-red-50 text-red-700 border-red-200">
                  Errors: {preview.errorRows}
                </Badge>
              )}
            </div>
          </div>

          {/* Duplicate Strategy Option */}
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Duplicate Handling Strategy
                </p>
                <p className="text-xs text-amber-800">
                  Detected {preview.duplicateRows} rows matching existing registration IDs or emails in the database.
                </p>
              </div>
              <Select
                value={duplicateStrategy}
                onValueChange={(val) => {
                  if (val) setDuplicateStrategy(val as DuplicateStrategy);
                }}
              >
                <SelectTrigger className="w-[200px] h-9 bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">Skip duplicates (Safe)</SelectItem>
                  <SelectItem value="update">Update existing records</SelectItem>
                  <SelectItem value="insert">Import as new records</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Filter Tabs */}
          <Tabs
            value={previewFilter}
            onValueChange={(val) => setPreviewFilter(val as typeof previewFilter)}
            className="space-y-3"
          >
            <TabsList>
              <TabsTrigger value="all">All Records ({preview.totalRows})</TabsTrigger>
              <TabsTrigger value="valid">Valid ({preview.validRows})</TabsTrigger>
              <TabsTrigger value="duplicate">Duplicates ({preview.duplicateRows})</TabsTrigger>
              <TabsTrigger value="error">Errors ({preview.errorRows})</TabsTrigger>
            </TabsList>

            <Card>
              <CardContent className="p-0">
                <div className="max-h-[420px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 sticky top-0">
                        <TableHead className="w-[60px]">Row</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Primary Identifier</TableHead>
                        <TableHead>Target Course / Batch</TableHead>
                        <TableHead>Validation Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.rows
                        .filter((r) => {
                          if (previewFilter === "all") return true;
                          if (previewFilter === "valid") return r.status === "valid";
                          if (previewFilter === "duplicate") return r.status === "duplicate";
                          if (previewFilter === "error") return r.status === "error";
                          return true;
                        })
                        .slice(0, 100) // Render up to 100 rows for high responsiveness
                        .map((row) => (
                          <TableRow key={row.row}>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              #{row.row}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={row.status} />
                            </TableCell>
                            <TableCell className="text-xs">
                              <p className="font-medium">
                                {row.data["Full Name"] || row.data["name"] || row.data["Student Name"] || "—"}
                              </p>
                              <p className="text-muted-foreground text-[10px]">
                                {row.data["Email Address"] || row.data["email"] || row.data["Phone Number"] || ""}
                              </p>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {row.data["Course"] || row.data["course"] || row.data["Course (Name or ID)"] || "—"} ·{" "}
                              {row.data["Batch"] || row.data["batch"] || row.data["Batch (Name or ID)"] || "—"}
                            </TableCell>
                            <TableCell className="text-xs">
                              {row.errors.length > 0 ? (
                                <ul className="space-y-0.5">
                                  {row.errors.map((e, idx) => (
                                    <li
                                      key={idx}
                                      className={`text-[11px] ${
                                        e.severity === "error" ? "text-destructive font-medium" : "text-amber-700"
                                      }`}
                                    >
                                      • {e.error}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-emerald-700 text-[11px] flex items-center gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> All fields verified
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </Tabs>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setStep("mapping")}>
              <ArrowLeft className="h-4 w-4 me-2" /> Back to Mapping
            </Button>
            <Button
              onClick={handleStartImport}
              disabled={preview.validRows === 0 && preview.duplicateRows === 0}
              className="bg-brand hover:bg-brand/90 text-white min-w-[200px]"
            >
              Commit Import ({preview.validRows + (duplicateStrategy !== "skip" ? preview.duplicateRows : 0)} Records)
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 7: PROGRESS SIMULATION                                  */}
      {/* ============================================================ */}
      {step === "progress" && (
        <Card className="py-16 text-center max-w-lg mx-auto">
          <CardContent className="space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-brand/10 text-brand flex items-center justify-center animate-spin">
              <RefreshCw className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Importing Records to Database</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Processing spreadsheet in batches. Preparing Supabase PostgreSQL table insertion...
              </p>
            </div>
            <div className="space-y-2">
              <Progress value={importProgress} className="h-3" />
              <p className="text-xs font-mono text-muted-foreground">{importProgress}% Completed</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================================ */}
      {/* STEP 8: COMPLETION RESULT                                    */}
      {/* ============================================================ */}
      {step === "result" && importResult && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <Card className="border-emerald-200 bg-emerald-50/20">
            <CardHeader className="text-center pb-2">
              <div className="h-14 w-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-emerald-950">
                Bulk Import Completed Successfully
              </CardTitle>
              <CardDescription>
                Import ID: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{importResult.id}</code> ·{" "}
                {new Date(importResult.importedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-lg bg-background border">
                  <p className="text-2xl font-bold">{importResult.totalRows}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Rows</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <p className="text-2xl font-bold">{importResult.importedRows}</p>
                  <p className="text-xs mt-0.5">Successfully Imported</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                  <p className="text-2xl font-bold">{importResult.skippedRows}</p>
                  <p className="text-xs mt-0.5">Skipped Duplicates</p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900">
                  <p className="text-2xl font-bold">{importResult.failedRows}</p>
                  <p className="text-xs mt-0.5">Failed Errors</p>
                </div>
              </div>

              {/* Error Details if any */}
              {importResult.errorReport && importResult.errorReport.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-destructive flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Row-Level Rejection Report ({importResult.errorReport.length})
                    </p>
                    <Button variant="outline" size="sm" onClick={downloadErrorReport} className="h-7 text-xs">
                      <Download className="h-3.5 w-3.5 me-1.5" /> Download Errors (.xlsx)
                    </Button>
                  </div>
                  <div className="max-h-48 overflow-auto border rounded-lg p-2 bg-background text-xs space-y-1">
                    {importResult.errorReport.map((err, idx) => (
                      <p key={idx} className="text-destructive font-mono text-[11px]">
                        Row {err.row} [{err.column}]: {err.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t p-4 bg-muted/20">
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 me-2" /> Import Another File
              </Button>
              <div className="flex items-center gap-2">
                <Link href="/admin/imports">
                  <Button variant="outline">
                    View Import History
                  </Button>
                </Link>
                <Link href="/admin/students">
                  <Button className="bg-brand hover:bg-brand/90 text-white">
                    View Enrolled Students <ArrowRight className="h-4 w-4 ms-2" />
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
