"use client";

import React, { useState, useMemo, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type ColumnDef, type FilterDef } from "@/components/shared/data-table";
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
import { getClasses, createClass } from "@/lib/services/class-service";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { trainers } from "@/lib/data/trainers";
import { rooms } from "@/lib/data/rooms";
import type { ClassSession } from "@/lib/types";
import { Plus, Calendar, Clock, AlertTriangle } from "lucide-react";

export default function ClassSchedulingPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  // New Class Session Form State
  const [newTitle, setNewTitle] = useState("");
  const [newBatchId, setNewBatchId] = useState(batches[0]?.id || "");
  const [newTrainerId, setNewTrainerId] = useState(trainers[0]?.id || "");
  const [newRoom, setNewRoom] = useState(rooms[0]?.name || "Lab A");
  const [newDate, setNewDate] = useState("2026-09-04");
  const [newStartTime, setNewStartTime] = useState("11:00");
  const [newEndTime, setNewEndTime] = useState("13:00");
  const [newTopics, setNewTopics] = useState("State Management, Hooks");
  const [newDesc, setNewDesc] = useState("");

  const result = useMemo(() => {
    return getClasses({
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

  const handleScheduleClass = () => {
    if (!newTitle) return;
    setConflictError(null);

    const selectedBatch = batches.find((b) => b.id === newBatchId);
    const courseId = selectedBatch ? selectedBatch.courseId : "course-1";

    const res = createClass({
      batchId: newBatchId,
      courseId,
      trainerId: newTrainerId,
      title: newTitle,
      description: newDesc,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      room: newRoom,
      moduleId: "m-gen",
      topics: newTopics.split(",").map((t) => t.trim()).filter(Boolean),
      isCompleted: false,
    });

    if (res.success) {
      setCreateOpen(false);
      setNewTitle("");
      setConflictError(null);
    } else {
      setConflictError(res.error || "Conflict detected.");
    }
  };

  const columns: ColumnDef<ClassSession>[] = [
    {
      key: "title",
      header: "Session Title & Topics",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-sm">{row.title}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {row.topics.map((t) => (
              <span key={t} className="text-[10px] bg-muted px-1.5 py-0.2 rounded text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      sortable: true,
      render: (row) => (
        <div className="text-xs">
          <p className="font-medium">{row.date}</p>
          <p className="text-muted-foreground text-[11px] font-mono">
            {row.startTime} – {row.endTime}
          </p>
        </div>
      ),
    },
    {
      key: "batchId",
      header: "Batch / Room",
      render: (row) => {
        const batch = batches.find((b) => b.id === row.batchId);
        return (
          <div className="text-xs">
            <span className="font-semibold">{batch?.name || row.batchId}</span>
            <p className="text-muted-foreground text-[11px]">Room {row.room}</p>
          </div>
        );
      },
    },
    {
      key: "trainerId",
      header: "Instructor",
      render: (row) => {
        const trainer = trainers.find((t) => t.id === row.trainerId);
        return <span className="text-xs text-muted-foreground">{trainer?.name || "Faculty"}</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.isCompleted ? "outline" : "default"} className="text-[10px]">
          {row.isCompleted ? "Completed" : "Scheduled"}
        </Badge>
      ),
    },
  ];

  const filters: FilterDef[] = [
    {
      key: "date",
      label: "All Dates",
      options: [
        { value: "2026-09-03", label: "Today (Sep 3)" },
        { value: "2026-09-04", label: "Tomorrow (Sep 4)" },
      ],
    },
    {
      key: "batchId",
      label: "All Batches",
      options: batches.slice(0, 10).map((b) => ({ value: b.id, label: b.name })),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class & Lecture Scheduling"
        description="Schedule academic lecture sessions with automated conflict detection for rooms, instructors, and student cohorts."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Classes" },
        ]}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="h-4 w-4 me-2" /> Schedule Class
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule Lecture Session</DialogTitle>
                <DialogDescription>
                  The engine will check for trainer, room, and cohort timing conflicts.
                </DialogDescription>
              </DialogHeader>

              {conflictError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Scheduling Conflict Detected</p>
                    <p className="mt-0.5">{conflictError}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 py-2 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="cTitle">Lecture Title</Label>
                  <Input
                    id="cTitle"
                    placeholder="e.g. Next.js App Router Architecture"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Cohort Batch</Label>
                    <Select value={newBatchId} onValueChange={(val) => { if (val) setNewBatchId(val); }}>
                      <SelectTrigger>
                        <SelectValue />
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

                  <div className="space-y-1.5">
                    <Label>Trainer</Label>
                    <Select value={newTrainerId} onValueChange={(val) => { if (val) setNewTrainerId(val); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {trainers.map((tr) => (
                          <SelectItem key={tr.id} value={tr.id}>
                            {tr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="cDate">Date</Label>
                    <Input
                      id="cDate"
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cStart">Start Time</Label>
                    <Input
                      id="cStart"
                      type="time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cEnd">End Time</Label>
                    <Input
                      id="cEnd"
                      type="time"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Assigned Room / Lab</Label>
                  <Select value={newRoom} onValueChange={(val) => { if (val) setNewRoom(val); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((r) => (
                        <SelectItem key={r.id} value={r.name}>
                          {r.name} ({r.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cTopics">Covered Topics (comma-separated)</Label>
                  <Input
                    id="cTopics"
                    value={newTopics}
                    onChange={(e) => setNewTopics(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleScheduleClass} disabled={!newTitle}>
                  Schedule Session
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
        searchPlaceholder="Search classes by title or room..."
        searchValue={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        emptyTitle="No scheduled classes found"
      />
    </div>
  );
}
