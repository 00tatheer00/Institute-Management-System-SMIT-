import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

export default function AdminQuizzesPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Quizzes & Online Assessments"
        description="MCQ quizzes, timed coding challenges, and automated score computations."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Quizzes" },
        ]}
      />

      <Card className="border-dashed">
        <CardHeader className="text-center py-12">
          <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <CardTitle className="text-lg">Assessment & Quiz Engine</CardTitle>
            <Badge variant="outline">Scheduled for Phase 3</Badge>
          </div>
          <CardDescription className="max-w-md mx-auto">
            Online timed examinations and automated question grading will activate in Phase 3.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
