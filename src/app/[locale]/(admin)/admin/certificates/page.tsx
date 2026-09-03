import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { certificates } from "@/lib/data/misc";
import { Award } from "lucide-react";

export default function AdminCertificatesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Certificates Management"
        description="Issued graduate credentials and online verification credentials."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Certificates" },
        ]}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-brand" /> Issued Digital Certificates ({certificates.length})
          </CardTitle>
          <CardDescription>
            Certificates verifiable through the public verification portal
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Certificate ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-mono text-xs font-semibold">{cert.certificateId}</TableCell>
                  <TableCell className="font-medium text-sm">{cert.studentName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{cert.courseName}</TableCell>
                  <TableCell className="text-xs">{cert.batchName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{cert.issueDate}</TableCell>
                  <TableCell className="text-xs font-bold">{cert.grade}</TableCell>
                  <TableCell>
                    <StatusBadge status={cert.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
