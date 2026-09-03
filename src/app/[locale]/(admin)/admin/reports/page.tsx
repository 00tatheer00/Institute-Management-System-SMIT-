"use client";

import { useState } from "react";
import {
  availableReports,
  generateReportData,
  exportReportToExcel,
  exportReportToCsv,
  type ReportDefinition,
} from "@/lib/services/report-service";
import { courses } from "@/lib/data/courses";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileSpreadsheet, Download, Filter, Table, CheckCircle2,
  FileText, ArrowRight, Sparkles
} from "lucide-react";

export default function AdminReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string>("student-performance");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const filteredCatalog = availableReports.filter(
    (r) => selectedCategory === "all" || r.category === selectedCategory
  );

  const activeReport = availableReports.find((r) => r.id === selectedReportId) || availableReports[0];
  const reportData = generateReportData(selectedReportId, { courseId: courseFilter });

  const handleExportExcel = () => {
    exportReportToExcel(selectedReportId, { courseId: courseFilter });
  };

  const handleExportCsv = () => {
    exportReportToCsv(selectedReportId, { courseId: courseFilter });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Reporting & Data Export Center"
        description="Generate official records, performance dossiers, and demographic datasets. Choose Report → Select Filters → Preview → Export."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Reports" },
        ]}
      />

      {/* Step 1 & 2: Choose Report & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Report Selector Catalog */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Step 1: Choose Report
              </CardTitle>
              <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
                <SelectTrigger className="w-[120px] h-7 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="admissions">Admissions</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription className="text-xs">
              Select one of the {filteredCatalog.length} available reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5 p-3 pt-0 max-h-[420px] overflow-y-auto">
            {filteredCatalog.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs space-y-1 ${
                  selectedReportId === rep.id
                    ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm"
                    : "hover:bg-muted/40 border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{rep.title}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-semibold">
                    {rep.category}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {rep.description}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Right: Step 2 Filters & Export Actions */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Step 2: Configuration &amp; Export
            </CardTitle>
            <CardDescription className="text-xs">
              Active Selection: <strong className="text-foreground">{activeReport.title}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/20 border">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Program Scope</label>
                <Select value={courseFilter} onValueChange={(val) => setCourseFilter(val || "all")}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Technological Disciplines</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Output Format</label>
                <div className="flex items-center gap-2 pt-0.5">
                  <Button
                    size="sm"
                    onClick={handleExportExcel}
                    className="flex-1 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    <Download className="h-3.5 w-3.5 me-1.5" /> Download Excel (.xlsx)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportCsv}
                    className="flex-1 text-xs h-8 font-medium"
                  >
                    <FileText className="h-3.5 w-3.5 me-1.5" /> CSV (.csv)
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats on Selected Report */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Previewing <strong>{reportData.totalRecords}</strong> matching records</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Live data populated from service layer
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step 3: Live Table Preview */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Step 3: Tabular Preview
              </CardTitle>
              <CardDescription className="text-xs">
                Showing live preview before downloading spreadsheet file
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportExcel}
              className="text-xs h-8 gap-1.5"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600" /> Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/70 text-muted-foreground uppercase font-bold sticky top-0 border-b">
                <tr>
                  {reportData.columns.map((col) => (
                    <th key={col} className="py-2.5 px-4 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y font-mono">
                {reportData.rows.length === 0 ? (
                  <tr>
                    <td colSpan={reportData.columns.length} className="py-8 text-center text-muted-foreground font-sans">
                      No matching records found for the selected scope.
                    </td>
                  </tr>
                ) : (
                  reportData.rows.slice(0, 50).map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      {reportData.columns.map((col) => (
                        <td key={col} className="py-2 px-4 whitespace-nowrap text-foreground">
                          {row[col] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
