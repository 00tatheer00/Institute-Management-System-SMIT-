"use client";

import React, { useState, use } from "react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCourseById,
  addCurriculumModule,
  deleteCurriculumModule,
  reorderCurriculumModules,
} from "@/lib/services/course-service";
import { getBatchesByCourse } from "@/lib/data/batches";
import { getTrainersByCourse } from "@/lib/data/trainers";
import type { CurriculumModule } from "@/lib/types";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const resolvedParams = use(params);
  const [course, setCourse] = useState(() => getCourseById(resolvedParams.id));

  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDuration, setModuleDuration] = useState("2 Weeks");
  const [moduleDesc, setModuleDesc] = useState("");
  const [moduleTopics, setModuleTopics] = useState("");

  if (!course) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="font-semibold text-lg">Course Not Found</p>
        <Link href="/admin/courses">
          <Button variant="outline">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const courseBatches = getBatchesByCourse(course.id);
  const courseTrainers = getTrainersByCourse(course.id);

  const handleAddModule = () => {
    if (!moduleTitle) return;
    const res = addCurriculumModule(course.id, {
      title: moduleTitle,
      description: moduleDesc,
      duration: moduleDuration,
      topics: moduleTopics.split(",").map((t) => t.trim()).filter(Boolean),
      order: course.curriculum.length + 1,
    });

    if (res.success) {
      setCourse({ ...course, curriculum: [...course.curriculum] });
      setModuleModalOpen(false);
      setModuleTitle("");
      setModuleDesc("");
      setModuleTopics("");
    }
  };

  const handleDeleteModule = (moduleId: string) => {
    const res = deleteCurriculumModule(course.id, moduleId);
    if (res.success) {
      setCourse({
        ...course,
        curriculum: course.curriculum.filter((m) => m.id !== moduleId),
      });
    }
  };

  const handleMoveModule = (index: number, direction: "up" | "down") => {
    const newCurriculum = [...course.curriculum];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newCurriculum.length) return;

    const temp = newCurriculum[index];
    newCurriculum[index] = newCurriculum[targetIdx];
    newCurriculum[targetIdx] = temp;

    const res = reorderCurriculumModules(
      course.id,
      newCurriculum.map((m) => m.id)
    );
    if (res.success) {
      setCourse({ ...course, curriculum: newCurriculum });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <PageHeader
        title={course.name}
        description={`${course.duration} · ${course.level} · ${course.category.replace(/-/g, " ")}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Courses", href: "/admin/courses" },
          { label: course.name },
        ]}
        actions={
          <Link href="/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 me-2" /> Back to Courses
            </Button>
          </Link>
        }
      />

      <Tabs defaultValue="curriculum" className="space-y-4">
        <TabsList>
          <TabsTrigger value="curriculum">Curriculum & Syllabus ({course.curriculum.length})</TabsTrigger>
          <TabsTrigger value="overview">Course Overview</TabsTrigger>
          <TabsTrigger value="batches">Batches ({courseBatches.length})</TabsTrigger>
          <TabsTrigger value="trainers">Instructors ({courseTrainers.length})</TabsTrigger>
        </TabsList>

        {/* ================= CURRICULUM MANAGEMENT ================= */}
        <TabsContent value="curriculum" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Curriculum Syllabus Modules</h3>
              <p className="text-xs text-muted-foreground">
                Define the pedagogical sequence, technical topics, and time allotments.
              </p>
            </div>
            <Button size="sm" onClick={() => setModuleModalOpen(true)}>
              <Plus className="h-4 w-4 me-2" /> Add Module
            </Button>
          </div>

          <div className="space-y-3">
            {course.curriculum.map((module, idx) => (
              <Card key={module.id} className="transition-all hover:border-brand/40">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm">{module.title}</h4>
                        <Badge variant="outline" className="text-[10px] flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {module.duration}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                      {module.topics && module.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {module.topics.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={idx === 0}
                      onClick={() => handleMoveModule(idx, "up")}
                      title="Move Module Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={idx === course.curriculum.length - 1}
                      onClick={() => handleMoveModule(idx, "down")}
                      title="Move Module Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteModule(module.id)}
                      title="Delete Module"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ================= OVERVIEW TAB ================= */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About the Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>{course.description}</p>
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <h4 className="font-semibold text-xs text-muted-foreground uppercase">Key Skills Taught</h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {course.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-muted-foreground uppercase">Prerequisites</h4>
                  <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1">
                    {course.prerequisites.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= BATCHES TAB ================= */}
        <TabsContent value="batches" className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {courseBatches.map((batch) => (
              <Card key={batch.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <Link
                      href={`/admin/batches/${batch.id}`}
                      className="font-semibold text-sm hover:underline"
                    >
                      {batch.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Room {batch.room} · {batch.schedule.days.join(", ")}
                    </p>
                  </div>
                  <div className="text-end">
                    <StatusBadge status={batch.status} />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {batch.enrolledSeats}/{batch.totalSeats} seats
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ================= TRAINERS TAB ================= */}
        <TabsContent value="trainers" className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {courseTrainers.map((tr) => (
              <Card key={tr.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <Link
                      href={`/admin/trainers/${tr.id}`}
                      className="font-semibold text-sm hover:underline"
                    >
                      {tr.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{tr.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{tr.experience}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ★ {tr.rating}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Module Modal Dialog */}
      <Dialog open={moduleModalOpen} onOpenChange={setModuleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Curriculum Module</DialogTitle>
            <DialogDescription>
              Define the title, expected learning duration, and list of topics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="modTitle">Module Title</Label>
              <Input
                id="modTitle"
                placeholder="e.g. Asynchronous JavaScript & Promises"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modDuration">Estimated Duration</Label>
              <Input
                id="modDuration"
                placeholder="e.g. 2 Weeks (6 Lectures)"
                value={moduleDuration}
                onChange={(e) => setModuleDuration(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modTopics">Topics (comma-separated)</Label>
              <Input
                id="modTopics"
                placeholder="Event Loop, Callbacks, Promises, async/await, Fetch API"
                value={moduleTopics}
                onChange={(e) => setModuleTopics(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modDesc">Summary Description</Label>
              <Textarea
                id="modDesc"
                placeholder="Brief pedagogical overview..."
                rows={2}
                value={moduleDesc}
                onChange={(e) => setModuleDesc(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModuleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddModule} disabled={!moduleTitle}>
              Save Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
