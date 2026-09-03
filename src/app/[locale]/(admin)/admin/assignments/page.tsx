import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function AdminAssignmentsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Assignments & Coursework"
        description="Oversee homework prompts, student code repository submissions, and trainer evaluations."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Assignments" },
        ]}
      />

      <Card className="border-dashed">
        <CardHeader className="text-center py-12">
          <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <FileText className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <CardTitle className="text-lg">Assignments Engine</CardTitle>
            <Badge variant="outline">Scheduled for Phase 3</Badge>
          </div>
          <CardDescription className="max-w-md mx-auto">
            Assignment submissions and rubric-based grading belong to the Phase 3 Academic Engine.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
