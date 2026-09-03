import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Download, FileSpreadsheet, Users, GraduationCap, Calendar } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Institutional Analytics & Reports"
        description="Comprehensive demographic breakdowns, completion statistics, and Excel data exports."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Reports" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Student Enrollment Register",
            desc: "Full roster of enrolled students with attendance rates, contact details, and CNIC.",
            icon: <Users className="h-5 w-5 text-brand" />,
            filename: "student_roster_2026.xlsx",
          },
          {
            title: "Course Completion & Graduation",
            desc: "Alumni report with graduation status, final GPA metrics, and certificates issued.",
            icon: <GraduationCap className="h-5 w-5 text-brand" />,
            filename: "graduates_report_2026.xlsx",
          },
          {
            title: "Faculty & Batch Workload",
            desc: "Instructor teaching hours, batch counts, classroom capacity, and room allocations.",
            icon: <Calendar className="h-5 w-5 text-brand" />,
            filename: "faculty_workload_2026.xlsx",
          },
          {
            title: "Admissions Inflow Analytics",
            desc: "Application volume by technology discipline, city demographic, and approval rates.",
            icon: <PieChart className="h-5 w-5 text-brand" />,
            filename: "admissions_analytics_2026.xlsx",
          },
        ].map((rep, idx) => (
          <Card key={idx} className="flex flex-col justify-between">
            <CardHeader>
              <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-2">{rep.icon}</div>
              <CardTitle className="text-base">{rep.title}</CardTitle>
              <CardDescription className="text-xs">{rep.desc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Download className="h-3.5 w-3.5 me-2" /> Export Excel ({rep.filename})
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
