import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getImportById } from "@/lib/services/import-service";
import {
  FileSpreadsheet,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Layers,
} from "lucide-react";

export default async function ImportDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  const record = getImportById(id);
  if (!record) notFound();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={`Import: ${record.fileName}`}
        description={`Audit record for ${record.dataType} bulk upload.`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Imports", href: "/admin/imports" },
          { label: record.id },
        ]}
        actions={
          <Link href="/admin/imports">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 me-2" /> Back to History
            </Button>
          </Link>
        }
      />

      {/* Summary Banner */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg">{record.fileName}</h2>
                  <StatusBadge status={record.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ID: <code className="bg-muted px-1.5 py-0.5 rounded">{record.id}</code> · Size:{" "}
                  {(record.fileSize / 1024).toFixed(1)} KB · Entity:{" "}
                  <span className="capitalize font-semibold text-foreground">{record.dataType}</span>
                </p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 sm:text-end">
              <p className="flex items-center gap-1.5 sm:justify-end">
                <User className="h-3.5 w-3.5" /> {record.importedBy}
              </p>
              <p className="flex items-center gap-1.5 sm:justify-end">
                <Clock className="h-3.5 w-3.5" /> {new Date(record.importedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Numerical Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{record.totalRows}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Rows in File</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-200">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-emerald-800">{record.importedRows}</p>
            <p className="text-xs text-emerald-700 mt-0.5">Successfully Inserted</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-200">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-amber-800">{record.skippedRows}</p>
            <p className="text-xs text-amber-700 mt-0.5">Skipped Duplicates</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-200">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-800">{record.failedRows}</p>
            <p className="text-xs text-red-700 mt-0.5">Rejected / Failed Rows</p>
          </CardContent>
        </Card>
      </div>

      {/* Row-Level Error Audit Log */}
      {record.errorReport && record.errorReport.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Row-Level Error Audit ({record.errorReport.length})
            </CardTitle>
            <CardDescription>
              Detailed explanation of rows that failed schema validation or referential integrity constraints
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">Row #</TableHead>
                  <TableHead>Column / Field</TableHead>
                  <TableHead>Cell Value</TableHead>
                  <TableHead>Rejection Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.errorReport.map((err, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs font-semibold">#{err.row}</TableCell>
                    <TableCell className="text-xs font-medium">{err.column || err.field}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {err.value ? `"${err.value}"` : <em>&lt;empty&gt;</em>}
                    </TableCell>
                    <TableCell className="text-xs text-destructive font-medium">{err.error}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mb-2" />
            <p className="font-semibold text-foreground">Zero Validation Errors</p>
            <p className="text-xs mt-1">
              Every row in this spreadsheet passed all validation checks and duplicate constraints.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
