"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { getStudentAssignments } from "@/lib/services/assignment-service";
import { getStudentSubmission } from "@/lib/services/submission-service";
import type { Assignment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  FileText, Calendar, Clock, Award, CheckCircle2,
  AlertCircle, ArrowRight, Search
} from "lucide-react";

export default function StudentAssignmentsPage() {
  const studentId = "student-1"; // Muhammad Khan
  const batchId = "batch-1";

  const assignments = useMemo(() => {
    return getStudentAssignments(batchId);
  }, [batchId]);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);

      const sub = getStudentSubmission(a.id, studentId);
      const isGraded = sub?.status === "graded";
      const isSubmitted = sub && (sub.status === "submitted" || sub.status === "late");
      const isPending = !sub || sub.status === "not-submitted";

      if (activeTab === "graded") return matchesSearch && isGraded;
      if (activeTab === "submitted") return matchesSearch && isSubmitted;
      if (activeTab === "pending") return matchesSearch && isPending;
      return matchesSearch;
    });
  }, [assignments, searchQuery, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <FileText className="h-3.5 w-3.5" />
            Coursework & Practice
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments & Projects</h1>
          <p className="text-sm text-muted-foreground">
            Complete practical assignments, submit your code, and receive expert faculty feedback
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <Button
                size="sm"
                variant={activeTab === "all" ? "default" : "outline"}
                onClick={() => setActiveTab("all")}
                className="text-xs h-8"
              >
                All ({assignments.length})
              </Button>
              <Button
                size="sm"
                variant={activeTab === "pending" ? "default" : "outline"}
                onClick={() => setActiveTab("pending")}
                className="text-xs h-8"
              >
                Pending Submission
              </Button>
              <Button
                size="sm"
                variant={activeTab === "submitted" ? "default" : "outline"}
                onClick={() => setActiveTab("submitted")}
                className="text-xs h-8"
              >
                Submitted
              </Button>
              <Button
                size="sm"
                variant={activeTab === "graded" ? "default" : "outline"}
                onClick={() => setActiveTab("graded")}
                className="text-xs h-8"
              >
                Graded
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Stack */}
      <div className="space-y-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => {
            const sub = getStudentSubmission(assignment.id, studentId);
            const isGraded = sub?.status === "graded";
            const isSubmitted = sub && (sub.status === "submitted" || sub.status === "late");

            return (
              <Card key={assignment.id} className="hover:border-primary/40 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">
                          {assignment.title}
                        </h3>
                        {sub ? (
                          <StatusBadge status={sub.status} />
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                            Not Submitted
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {assignment.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Calendar className="h-3.5 w-3.5 text-blue-600" />
                          Due Date: {assignment.dueDate}
                        </span>
                        <span>Total Score: {assignment.totalMarks} Marks</span>
                        <span>Mode: {assignment.submissionType?.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Right action & grade pill */}
                    <div className="flex items-center gap-4 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                      {isGraded && (
                        <div className="text-end">
                          <span className="text-xl font-extrabold text-emerald-600">
                            {sub.obtainedMarks}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            /{assignment.totalMarks} pts
                          </span>
                        </div>
                      )}

                      <Link href={`/student/assignments/${assignment.id}`}>
                        <Button
                          size="sm"
                          className={
                            isGraded
                              ? "text-xs h-8"
                              : "bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-semibold"
                          }
                          variant={isGraded ? "outline" : "default"}
                        >
                          {isGraded ? "View Feedback" : isSubmitted ? "View Submission" : "Submit Assignment"}
                          <ArrowRight className="h-3.5 w-3.5 ms-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No assignments found matching this filter.
          </Card>
        )}
      </div>
    </div>
  );
}
