"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { getResults } from "@/lib/services/result-service";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3, Award, Search, Download, CheckCircle2,
  Filter, FileSpreadsheet, TrendingUp
} from "lucide-react";

export default function AdminResultsPage() {
  const [results] = useState(() => getResults({ pageSize: 100 }).data);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (r.studentName && r.studentName.toLowerCase().includes(q)) ||
        r.assessmentTitle.toLowerCase().includes(q);

      const matchesCourse = selectedCourse === "all" || r.courseId === selectedCourse;
      const matchesType = selectedType === "all" || r.assessmentType === selectedType;
      const matchesGrade = selectedGrade === "all" || r.grade === selectedGrade;

      return matchesSearch && matchesCourse && matchesType && matchesGrade;
    });
  }, [results, searchQuery, selectedCourse, selectedType, selectedGrade]);

  const total = results.length;
  const passingCount = results.filter((r) => r.grade !== "F").length;
  const passRate = total > 0 ? Math.round((passingCount / total) * 100) : 100;
  const avgPct = total > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / total) : 85;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Results & Academic Ledger"
        description="Master evaluation ledger connecting quizzes, assignments, and examinations with centralized grade thresholds."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Results" },
        ]}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Verified Records</p>
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground">Continuous assessment records</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Institute Pass Rate</p>
          <p className="text-2xl font-bold text-emerald-600">{passRate}%</p>
          <p className="text-xs text-muted-foreground">Above minimum passing criterion</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Average Score</p>
          <p className="text-2xl font-bold text-blue-600">{avgPct}%</p>
          <p className="text-xs text-muted-foreground">Aggregate continuous performance</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Grading Matrix</p>
          <p className="text-2xl font-bold text-purple-600">A+ to F</p>
          <p className="text-xs text-muted-foreground">Standardized GPA 4.0 scale</p>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student or assessment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9 text-xs"
              />
            </div>

            {/* Course Filter */}
            <Select
              value={selectedCourse}
              onValueChange={(val: string | null) => {
                if (val) setSelectedCourse(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Assessment Type Filter */}
            <Select
              value={selectedType}
              onValueChange={(val: string | null) => {
                if (val) setSelectedType(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="quiz">Quizzes</SelectItem>
                <SelectItem value="exam">Mid/Final Exams</SelectItem>
              </SelectContent>
            </Select>

            {/* Grade Filter */}
            <Select
              value={selectedGrade}
              onValueChange={(val: string | null) => {
                if (val) setSelectedGrade(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Letter Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Letter Grades</SelectItem>
                <SelectItem value="A+">Grade A+ (90-100%)</SelectItem>
                <SelectItem value="A">Grade A (80-89%)</SelectItem>
                <SelectItem value="B+">Grade B+ (75-79%)</SelectItem>
                <SelectItem value="B">Grade B (70-74%)</SelectItem>
                <SelectItem value="C">Grade C (60-69%)</SelectItem>
                <SelectItem value="F">Grade F (Fail &lt; 50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Master Results Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Assessment Results Ledger ({filteredResults.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Official academic assessment records synchronized across all departments
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Program</th>
                  <th className="py-3 px-4 font-semibold">Cohort</th>
                  <th className="py-3 px-4 font-semibold">Assessment</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Percentage</th>
                  <th className="py-3 px-4 font-semibold">Grade</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredResults.length > 0 ? (
                  filteredResults.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {row.studentName || "Student"}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {row.courseName}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium">
                        {row.batchName}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {row.assessmentTitle}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                          {row.assessmentType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">
                        {row.obtainedMarks} / {row.totalMarks}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-foreground">
                        {row.percentage}%
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            row.grade === "A+" || row.grade === "A"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : row.grade === "B+" || row.grade === "B"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : row.grade === "C" || row.grade === "D"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {row.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
                        {row.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                      No assessment results found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
