"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type ColumnDef, type FilterDef } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBatches, createBatch } from "@/lib/services/batch-service";
import { courses } from "@/lib/data/courses";
import { trainers } from "@/lib/data/trainers";
import type { Batch, BatchStatus } from "@/lib/types";
import { Plus, Eye, Calendar } from "lucide-react";

export default function BatchesListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);

  // New Batch Form State
  const [newBatchName, setNewBatchName] = useState("");
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || "");
  const [newTrainerId, setNewTrainerId] = useState(trainers[0]?.id || "");
  const [newStartDate, setNewStartDate] = useState("2026-10-01");
  const [newEndDate, setNewEndDate] = useState("2027-02-01");
  const [newRoom, setNewRoom] = useState("Lab A");
  const [newSeats, setNewSeats] = useState(35);

  const result = useMemo(() => {
    return getBatches({
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

  const handleCreateBatch = () => {
    if (!newBatchName) return;
    createBatch({
      name: newBatchName,
      courseId: newCourseId,
      trainerId: newTrainerId,
      startDate: newStartDate,
      endDate: newEndDate,
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "09:00",
        endTime: "11:00",
      },
      room: newRoom,
      campus: "Main Campus",
      totalSeats: newSeats,
      status: "enrolling",
      isActive: true,
    });

    setCreateOpen(false);
    setNewBatchName("");
  };

  const columns: ColumnDef<Batch>[] = [
    {
      key: "name",
      header: "Batch Code",
      sortable: true,
      render: (row) => (
        <Link
          href={`/admin/batches/${row.id}`}
          className="font-medium text-sm hover:underline block truncate"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "courseId",
      header: "Course",
      sortable: true,
      render: (row) => {
        const course = courses.find((c) => c.id === row.courseId);
        return <span className="text-xs font-medium">{course?.name || row.courseId}</span>;
      },
    },
    {
      key: "trainerId",
      header: "Instructor",
      render: (row) => {
        const trainer = trainers.find((t) => t.id === row.trainerId);
        return <span className="text-xs text-muted-foreground">{trainer?.name || "Unassigned"}</span>;
      },
    },
    {
      key: "schedule",
      header: "Schedule & Room",
      render: (row) => (
        <div className="text-xs text-muted-foreground">
          <p>{row.schedule.days.join(", ")}</p>
          <p className="text-[11px]">
            {row.schedule.startTime} - {row.schedule.endTime} · Room {row.room}
          </p>
        </div>
      ),
    },
    {
      key: "seats",
      header: "Capacity",
      render: (row) => (
        <span className="text-xs font-mono">
          {row.enrolledSeats} / {row.totalSeats}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-[40px] text-end",
      render: (row) => (
        <Link href={`/admin/batches/${row.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  const filters: FilterDef[] = [
    {
      key: "status",
      label: "All Statuses",
      options: [
        { value: "enrolling", label: "Enrolling" },
        { value: "in-progress", label: "In Progress" },
        { value: "upcoming", label: "Upcoming" },
        { value: "completed", label: "Completed" },
      ],
    },
    {
      key: "courseId",
      label: "All Courses",
      options: courses.map((c) => ({ value: c.id, label: c.name })),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch Management"
        description="Schedule course sections, track student capacities, and assign lab classrooms."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Batches" },
        ]}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="h-4 w-4 me-2" /> Add Batch
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Academic Batch</DialogTitle>
                <DialogDescription>
                  Configure new classroom cohort with assigned instructor and schedule.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="batchName">Batch Code / Name</Label>
                  <Input
                    id="batchName"
                    placeholder="e.g. WD-06 or AI-04"
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Technology Course</Label>
                  <Select value={newCourseId} onValueChange={(val) => { if (val) setNewCourseId(val); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Lead Trainer</Label>
                  <Select value={newTrainerId} onValueChange={(val) => { if (val) setNewTrainerId(val); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((tr) => (
                        <SelectItem key={tr.id} value={tr.id}>
                          {tr.name} ({tr.title})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="start">Start Date</Label>
                    <Input
                      id="start"
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="end">End Date</Label>
                    <Input
                      id="end"
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="room">Assigned Room / Lab</Label>
                    <Input
                      id="room"
                      placeholder="Lab A"
                      value={newRoom}
                      onChange={(e) => setNewRoom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="seats">Total Capacity (Seats)</Label>
                    <Input
                      id="seats"
                      type="number"
                      value={newSeats}
                      onChange={(e) => setNewSeats(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBatch} disabled={!newBatchName}>
                  Save Batch
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
        searchPlaceholder="Search batches by code or room..."
        searchValue={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        emptyTitle="No batches found"
      />
    </div>
  );
}
