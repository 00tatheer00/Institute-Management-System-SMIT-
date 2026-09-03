"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { runDataHealthDiagnostics } from "@/lib/services/data-health-service";
import type { DataHealthCheck, DataHealthSummary } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2,
  RefreshCw, Upload, Download, Database, Layers, ArrowRight
} from "lucide-react";

export default function AdminDataManagementPage() {
  const [diagnostics, setDiagnostics] = useState(() => runDataHealthDiagnostics());
  const [isScanning, setIsScanning] = useState(false);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setDiagnostics(runDataHealthDiagnostics());
      setIsScanning(false);
    }, 600);
  };

  const { summary, checks } = diagnostics;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Data Management &amp; Relational Health Scanner"
          description="Automated diagnostics for database integrity, orphaned foreign keys, unassigned rooms, and duplicate registration IDs."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Data Management" },
          ]}
        />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRescan}
            disabled={isScanning}
            className="text-xs h-9 gap-1.5 font-medium"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
            Run Integrity Scan
          </Button>

          <Link href="/admin/import">
            <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 font-medium">
              <Upload className="h-3.5 w-3.5 text-blue-600" /> Excel Import Hub
            </Button>
          </Link>
        </div>
      </div>

      {/* Diagnostics Health Summary Banner */}
      <Card className={`border ${
        summary.overallStatus === "healthy"
          ? "border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20"
          : summary.overallStatus === "attention-needed"
          ? "border-amber-200 bg-amber-50/40 dark:bg-amber-950/20"
          : "border-rose-200 bg-rose-50/40 dark:bg-rose-950/20"
      }`}>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {summary.overallStatus === "healthy" ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0 mt-0.5" />
              ) : summary.overallStatus === "attention-needed" ? (
                <AlertTriangle className="h-8 w-8 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-8 w-8 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    Relational Health Status:{" "}
                    <span className="uppercase font-extrabold">{summary.overallStatus.replace("-", " ")}</span>
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Executed <strong>{summary.checksRun}</strong> relational constraint checks across students, batches, rooms, and courses.
                </p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  Last automated scan executed: {summary.lastScannedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center sm:text-end">
              <div>
                <p className="text-2xl font-black text-foreground">{summary.totalIssues}</p>
                <p className="text-[11px] text-muted-foreground uppercase font-semibold">Total Issues</p>
              </div>
              <div className="border-s ps-4">
                <p className="text-2xl font-black text-rose-600">{summary.criticalIssues}</p>
                <p className="text-[11px] text-muted-foreground uppercase font-semibold">Critical</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostics Check Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Automated Integrity Checkpoints
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checks.map((c) => (
            <Card key={c.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    c.affectedCount === 0
                      ? "bg-emerald-100 text-emerald-800"
                      : c.severity === "critical"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {c.affectedCount === 0 ? "PASSED" : `${c.affectedCount} ISSUES`}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                    {c.category}
                  </span>
                </div>
                <CardTitle className="text-sm font-bold pt-1">{c.name}</CardTitle>
                <CardDescription className="text-xs">{c.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-2">
                {c.affectedCount === 0 ? (
                  <div className="p-2.5 rounded-lg bg-muted/20 text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Constraint verified. Zero anomalies identified.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 text-xs space-y-1">
                      {c.issues.slice(0, 2).map((iss) => (
                        <div key={iss.id}>
                          <p className="font-bold text-rose-900 dark:text-rose-200">{iss.title}</p>
                          <p className="text-[11px] text-muted-foreground">{iss.description}</p>
                          <p className="text-[10px] text-blue-600 font-semibold">{iss.remediationNote}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Migration Readiness Blueprint */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-600" />
            Supabase PostgreSQL Migration Readiness
          </CardTitle>
          <CardDescription className="text-xs">
            Architecture checklist for transitioning relational mock datasets into production PostgreSQL tables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <p className="font-bold text-foreground">UUID &amp; Relational IDs</p>
              <p className="text-muted-foreground text-[11px]">
                All student, course, and batch entities use consistent relational identifiers compatible with PostgreSQL primary keys.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <p className="font-bold text-foreground">Asynchronous Service Layer</p>
              <p className="text-muted-foreground text-[11px]">
                All 18 domain services adhere to async signatures, allowing instant replacement with `@supabase/supabase-js` clients.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <p className="font-bold text-foreground">Storage Buckets Defined</p>
              <p className="text-muted-foreground text-[11px]">
                Logical bucket partitions (`student-documents`, `project-files`, `certificates`, `gallery`) are already standardized.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
