"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import {
  getAllProjects,
  toggleProjectPublish,
  toggleProjectFeatured,
} from "@/lib/services/project-service";
import { courses } from "@/lib/data/courses";
import type { StudentProject } from "@/lib/types";
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
  Rocket, Search, ExternalLink, Code2, Star,
  Eye, CheckCircle2, ShieldCheck, Sparkles
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projectList, setProjectList] = useState<StudentProject[]>(() =>
    getAllProjects({ pageSize: 100 }).data
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredProjects = useMemo(() => {
    return projectList.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.studentName.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));

      const matchesCourse = selectedCourse === "all" || p.courseId === selectedCourse;
      const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [projectList, searchQuery, selectedCourse, selectedStatus]);

  const handleTogglePublish = (id: string, current: boolean) => {
    toggleProjectPublish(id, !current);
    setProjectList(
      projectList.map((p) => (p.id === id ? { ...p, isPublished: !current, status: !current ? "published" : "completed" } : p))
    );
  };

  const handleToggleFeatured = (id: string, current: boolean) => {
    toggleProjectFeatured(id, !current);
    setProjectList(
      projectList.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p))
    );
  };

  const publishedCount = projectList.filter((p) => p.isPublished).length;
  const featuredCount = projectList.filter((p) => p.isFeatured).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Projects & Portfolio Oversight"
        description="Review student capstone projects, manage public showcase approvals, and highlight featured innovations."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Projects" },
        ]}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Projects</p>
          <p className="text-2xl font-bold text-foreground">{projectList.length}</p>
          <p className="text-xs text-muted-foreground">Coursework &amp; capstone submissions</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Public Showcase Live</p>
          <p className="text-2xl font-bold text-emerald-600">{publishedCount}</p>
          <p className="text-xs text-muted-foreground">Visible on public /projects showcase</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Featured on Homepage</p>
          <p className="text-2xl font-bold text-amber-600">{featuredCount}</p>
          <p className="text-xs text-muted-foreground">Top tier student achievements</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, student, or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9 text-xs"
              />
            </div>

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

            <Select
              value={selectedStatus}
              onValueChange={(val: string | null) => {
                if (val) setSelectedStatus(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="idea">Idea / Concept</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Institutional Project Directory ({filteredProjects.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review code repositories, live deployments, and manage showcase visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Project Title</th>
                  <th className="py-3 px-4 font-semibold">Student Creator</th>
                  <th className="py-3 px-4 font-semibold">Program</th>
                  <th className="py-3 px-4 font-semibold">Technologies</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Showcase</th>
                  <th className="py-3 px-4 font-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      {p.title}
                    </td>
                    <td className="py-3 px-4 font-medium text-xs text-foreground">
                      {p.studentName}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {p.courseName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.technologies.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          p.status === "published"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : p.status === "completed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant={p.isPublished ? "default" : "outline"}
                        onClick={() => handleTogglePublish(p.id, !!p.isPublished)}
                        className={`text-[11px] h-7 px-2.5 ${
                          p.isPublished ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                        }`}
                      >
                        {p.isPublished ? "Public" : "Approve"}
                      </Button>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleFeatured(p.id, !!p.isFeatured)}
                          className={`h-7 px-2 ${p.isFeatured ? "text-amber-500" : "text-muted-foreground"}`}
                          title="Toggle Featured"
                        >
                          <Star className={`h-3.5 w-3.5 ${p.isFeatured ? "fill-amber-400" : ""}`} />
                        </Button>
                        {p.githubUrl && (
                          <a href={p.githubUrl} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground">
                              <Code2 className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        )}
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
