"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type ColumnDef, type FilterDef } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCourses, createCourse } from "@/lib/services/course-service";
import type { Course, CourseCategory, CourseLevel } from "@/lib/types";
import { BookOpen, Plus, Eye, Layers, Users } from "lucide-react";

export default function CourseListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);

  // New Course Form State
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<CourseCategory>("web-development");
  const [newLevel, setNewLevel] = useState<CourseLevel>("beginner");
  const [newDuration, setNewDuration] = useState("16 Weeks");
  const [newDesc, setNewDesc] = useState("");

  const result = useMemo(() => {
    return getCourses({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      filters: activeFilters,
    });
  }, [page, pageSize, search, sortBy, sortOrder, activeFilters]);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleSort = useCallback((key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
    setPage(1);
  }, []);

  const handleCreateCourse = () => {
    if (!newName) return;
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    createCourse({
      name: newName,
      slug,
      shortDescription: newDesc.slice(0, 100),
      description: newDesc,
      category: newCategory,
      level: newLevel,
      duration: newDuration,
      durationWeeks: parseInt(newDuration) || 16,
      totalClasses: 48,
      image: "/images/courses/web-dev.jpg",
      icon: "Code",
      skills: ["Core Competency", "Practical Projects"],
      learningOutcomes: ["Master industry standards", "Build capstone portfolio project"],
      prerequisites: ["Basic Computer Literacy"],
      curriculum: [
        {
          id: `${slug}-m1`,
          title: "Orientation & Fundamentals",
          description: "Foundational concepts and development environment setup.",
          duration: "2 Weeks",
          topics: ["Introduction", "Setup", "Core Theory"],
          order: 1,
        },
      ],
      faqs: [],
      isFeatured: false,
      isActive: true,
    });

    setCreateOpen(false);
    setNewName("");
    setNewDesc("");
  };

  const columns: ColumnDef<Course>[] = [
    {
      key: "name",
      header: "Program / Course",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            href={`/admin/courses/${row.id}`}
            className="font-medium text-sm hover:underline block truncate"
          >
            {row.name}
          </Link>
          <p className="text-[11px] text-muted-foreground capitalize">
            {row.category.replace(/-/g, " ")} · {row.level}
          </p>
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (row) => <span className="text-xs text-muted-foreground">{row.duration}</span>,
    },
    {
      key: "curriculum",
      header: "Curriculum",
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted">
          {row.curriculum.length} Modules
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.isActive ? "active" : "inactive"} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-[40px] text-end",
      render: (row) => (
        <Link href={`/admin/courses/${row.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  const filters: FilterDef[] = [
    {
      key: "level",
      label: "All Levels",
      options: [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        description="Oversee technology training curricula, program syllabi, and active offerings."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Courses" },
        ]}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="h-4 w-4 me-2" /> Add Course
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Technology Course</DialogTitle>
                <DialogDescription>
                  Define a new educational program syllabus and curriculum structure.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    placeholder="e.g. Cloud Native DevOps"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      value={newCategory}
                      onValueChange={(val) => {
                        if (val) setNewCategory(val as CourseCategory);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-development">Web Development</SelectItem>
                        <SelectItem value="app-development">App Development</SelectItem>
                        <SelectItem value="artificial-intelligence">AI & Data Science</SelectItem>
                        <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                        <SelectItem value="graphic-design">Graphic Design</SelectItem>
                        <SelectItem value="cyber-security">Cyber Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Level</Label>
                    <Select
                      value={newLevel}
                      onValueChange={(val) => {
                        if (val) setNewLevel(val as CourseLevel);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="16 Weeks (4 Months)"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="desc">Overview Description</Label>
                  <Textarea
                    id="desc"
                    placeholder="Brief description of the course scope and tech stack..."
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse} disabled={!newName}>
                  Create Course
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={result.data}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        totalPages={result.totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearch={handleSearch}
        onSort={handleSort}
        onFilterChange={handleFilterChange}
        filters={filters}
        activeFilters={activeFilters}
        searchPlaceholder="Search courses..."
        searchValue={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        emptyTitle="No courses found"
      />
    </div>
  );
}
