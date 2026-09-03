"use client";

import { useState, useMemo } from "react";
import { getStudentProjects, createProject, toggleProjectPublish } from "@/lib/services/project-service";
import type { StudentProject, ProjectStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Rocket, Plus, GitBranch, ExternalLink, Globe,
  CheckCircle2, Clock, Sparkles, Layers, Award
} from "lucide-react";

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<StudentProject[]>(() =>
    getStudentProjects("student-1")
  );

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isNewOpen, setIsNewOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Full-Stack Web App");
  const [techInput, setTechInput] = useState("React, Next.js, Tailwind CSS");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [moduleName, setModuleName] = useState("Module 5 — React 19 & Next.js 15");
  const [status, setStatus] = useState<ProjectStatus>("in-progress");

  const filteredProjects = useMemo(() => {
    if (filterStatus === "all") return projects;
    return projects.filter((p) => p.status === filterStatus);
  }, [projects, filterStatus]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const techs = techInput.split(",").map((t) => t.trim()).filter(Boolean);

    const created = createProject({
      title: title.trim(),
      description: description.trim(),
      studentId: "student-1",
      studentName: "Muhammad Khan",
      courseId: "course-1",
      courseName: "Web Development",
      batchId: "batch-1",
      technologies: techs,
      category,
      githubUrl: githubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      moduleName,
      status,
    });

    setProjects([created, ...projects]);
    setIsNewOpen(false);
    setTitle("");
    setDescription("");
    setGithubUrl("");
    setLiveUrl("");
  };

  const handleTogglePublish = (projId: string, current: boolean) => {
    toggleProjectPublish(projId, !current);
    setProjects(
      projects.map((p) => (p.id === projId ? { ...p, isPublished: !current } : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Rocket className="h-3.5 w-3.5" />
            Portfolio & Innovation
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Projects</h1>
          <p className="text-sm text-muted-foreground">
            Showcase your practical coursework, capstone applications, and live deployments
          </p>
        </div>

        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5 text-xs h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                <Plus className="h-4 w-4" /> Add New Project
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Register Academic Project</DialogTitle>
              <DialogDescription className="text-xs">
                Record your application details to feature in your curriculum portfolio
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateProject} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Project Title</label>
                <Input
                  placeholder="e.g. AI-Powered Healthcare Appointment System"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Description & Key Features</label>
                <textarea
                  placeholder="Summarize the core technical challenges solved, state architecture, and APIs integrated..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[70px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Development Status</label>
                  <Select
                    value={status}
                    onValueChange={(val: string | null) => {
                      if (val) setStatus(val as ProjectStatus);
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea / Concept</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Technologies Used (comma separated)
                </label>
                <Input
                  placeholder="e.g. Next.js 15, TypeScript, Tailwind CSS, PostgreSQL"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">GitHub Repo URL</label>
                  <Input
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Live Demo Link</label>
                  <Input
                    placeholder="https://my-app.vercel.app"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewOpen(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
          className="text-xs h-8"
        >
          All Projects ({projects.length})
        </Button>
        <Button
          size="sm"
          variant={filterStatus === "published" ? "default" : "outline"}
          onClick={() => setFilterStatus("published")}
          className="text-xs h-8"
        >
          Showcase Published
        </Button>
        <Button
          size="sm"
          variant={filterStatus === "in-progress" ? "default" : "outline"}
          onClick={() => setFilterStatus("in-progress")}
          className="text-xs h-8"
        >
          In Progress
        </Button>
        <Button
          size="sm"
          variant={filterStatus === "idea" ? "default" : "outline"}
          onClick={() => setFilterStatus("idea")}
          className="text-xs h-8"
        >
          Concepts
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => (
          <Card key={p.id} className="flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-900 transition-colors">
            <CardHeader className="p-4 pb-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {p.category}
                </span>

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
              </div>

              <CardTitle className="text-base font-bold line-clamp-1 leading-snug">
                {p.title}
              </CardTitle>

              <CardDescription className="text-xs line-clamp-2">
                {p.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-2 space-y-3">
              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1">
                {p.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Module & Date Info */}
              <div className="text-[11px] text-muted-foreground border-t pt-2 space-y-0.5">
                {p.moduleName && <p className="truncate font-medium">{p.moduleName}</p>}
                <p>Updated: {p.completedAt}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1">
                      <GitBranch className="h-3 w-3" /> Code
                    </Button>
                  </a>
                )}
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1">
                      <ExternalLink className="h-3 w-3" /> Demo
                    </Button>
                  </a>
                )}
              </div>

              {/* Showcase Publishing Toggle */}
              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Public Showcase:</span>
                <Button
                  size="sm"
                  variant={p.isPublished ? "default" : "outline"}
                  onClick={() => handleTogglePublish(p.id, !!p.isPublished)}
                  className={`text-[10px] h-6 px-2 font-medium ${
                    p.isPublished ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                  }`}
                >
                  {p.isPublished ? "Published" : "Draft (Make Public)"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
