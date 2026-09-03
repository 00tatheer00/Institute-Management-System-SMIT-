import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare } from "lucide-react";

export default function AdminAttendancePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Attendance Management"
        description="Daily lecture session attendance marking, biometric synchronization, and leave tracking."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Attendance" },
        ]}
      />

      <Card className="border-dashed">
        <CardHeader className="text-center py-12">
          <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <CardTitle className="text-lg">Academic Attendance Engine</CardTitle>
            <Badge variant="outline">Scheduled for Phase 3</Badge>
          </div>
          <CardDescription className="max-w-md mx-auto">
            The Phase 2 management layer (classes, batches, and student rosters) is established. Daily QR-code attendance marking, trainer grading, and automated absence SMS alerts will activate in Phase 3.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
