"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { batches } from "@/lib/data/batches";
import {
  getBatchResults,
  getBatchGradeMetrics,
  getResults,
} from "@/lib/services/result-service";
import type { UnifiedResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Award, Search, TrendingUp, Users, CheckCircle2,
  FileSpreadsheet, Filter
} from "lucide-react";

function TrainerResultsContent() {
  const searchParams = useSearchParams();
  const initialBatch = searchParams.get("batch") || "batch-1";

  const [selectedBatchId, setSelectedBatchId] = useState(initialBatch);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const results = useMemo(() => {
    return getBatchResults(selectedBatchId);
  }, [selectedBatchId]);

  const metrics = useMemo(() => {
    return getBatchGradeMetrics(selectedBatchId);
  }, [selectedBatchId]);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (r.studentName && r.studentName.toLowerCase().includes(q)) ||
        r.assessmentTitle.toLowerCase().includes(q);

      const matchesType = selectedType === "all" || r.assessmentType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [results, searchQuery, selectedType]);

  const currentBatch = batches.find((b) => b.id === selectedBatchId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Award className="h-3.5 w-3.5" />
            Academic Performance
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Cohort Gradebook & Results</h1>
          <p className="text-sm text-muted-foreground">
            Review continuous assessment records, pass rates, and evaluation ledgers
          </p>
        </div>

        {/* Batch Selector */}
        <div className="w-full sm:w-64">
          <Select
            value={selectedBatchId}
            onValueChange={(val: string | null) => {
              if (val) setSelectedBatchId(val);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Cohort" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <p className="text-xs text-muted-foreground">Pass Rate</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.passRate}%
          </p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-muted-foreground">Average Score</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {metrics.avgPercentage}%
          </p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-muted-foreground">Highest Mark</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {metrics.highestScore}%
          </p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-muted-foreground">Lowest Mark</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {metrics.lowestScore}%
          </p>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student or assessment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={selectedType}
                onValueChange={(val: string | null) => {
                  if (val) setSelectedType(val);
                }}
              >
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="All Assessments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                  <SelectItem value="quiz">Quizzes</SelectItem>
                  <SelectItem value="exam">Mid/Final Exams</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gradebook Ledger Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {currentBatch?.name || selectedBatchId} — Results Ledger ({filteredResults.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Official assessment records synchronized from quiz submissions and graded assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
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
                      <td className="py-3 px-4 font-semibold">
                        {row.studentName || "Student"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{row.assessmentTitle}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-muted">
                          {row.assessmentType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {row.obtainedMarks} / {row.totalMarks}
                      </td>
                      <td className="py-3 px-4 font-bold">
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
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {row.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                      No results found for this batch.
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

export default function TrainerResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading cohort results...</div>}>
      <TrainerResultsContent />
    </Suspense>
  );
}
