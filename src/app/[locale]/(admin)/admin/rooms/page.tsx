"use client";

import React, { useState, useMemo, useCallback } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRooms, createRoom } from "@/lib/services/room-service";
import type { Room, RoomType } from "@/lib/types";
import { Plus, DoorOpen } from "lucide-react";

export default function RoomsListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);

  // New Room Form State
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<RoomType>("computer-lab");
  const [newCapacity, setNewCapacity] = useState(30);
  const [newFloor, setNewFloor] = useState("Ground Floor");
  const [newBuilding, setNewBuilding] = useState("Main Campus");
  const [newEquipment, setNewEquipment] = useState("30 PCs, Projector, AC");

  const result = useMemo(() => {
    return getRooms({
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

  const handleCreateRoom = () => {
    if (!newName) return;
    createRoom({
      name: newName,
      type: newType,
      capacity: newCapacity,
      floor: newFloor,
      building: newBuilding,
      equipment: newEquipment.split(",").map((e) => e.trim()).filter(Boolean),
      hasProjector: true,
      hasAC: true,
      hasWhiteboard: true,
      isAvailable: true,
      status: "available",
    });

    setCreateOpen(false);
    setNewName("");
  };

  const columns: ColumnDef<Room>[] = [
    {
      key: "name",
      header: "Room / Lab Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <DoorOpen className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-sm">{row.name}</p>
            <p className="text-[11px] text-muted-foreground capitalize">
              {row.type.replace(/-/g, " ")} · {row.floor}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      sortable: true,
      render: (row) => <span className="text-xs font-mono font-medium">{row.capacity} Seats</span>,
    },
    {
      key: "equipment",
      header: "Installed Equipment",
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[280px]">
          {row.equipment.map((eq) => (
            <Badge key={eq} variant="outline" className="text-[10px]">
              {eq}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const filters: FilterDef[] = [
    {
      key: "status",
      label: "All Statuses",
      options: [
        { value: "available", label: "Available" },
        { value: "occupied", label: "Occupied" },
        { value: "maintenance", label: "Maintenance" },
      ],
    },
    {
      key: "type",
      label: "All Room Types",
      options: [
        { value: "computer-lab", label: "Computer Lab" },
        { value: "classroom", label: "Classroom" },
        { value: "training-lab", label: "Training Lab" },
        { value: "auditorium", label: "Auditorium" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facilities & Room Management"
        description="Oversee campus physical resources, high-performance computer laboratories, and lecture rooms."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Rooms" },
        ]}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="h-4 w-4 me-2" /> Add Room / Lab
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configure Campus Facility</DialogTitle>
                <DialogDescription>
                  Register a physical room, workstation capacity, and installed technology.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="rName">Room / Lab Name</Label>
                  <Input
                    id="rName"
                    placeholder="e.g. Lab E (High Perf GPU Lab)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Facility Type</Label>
                    <Select value={newType} onValueChange={(val) => { if (val) setNewType(val as RoomType); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-lab">Computer Lab</SelectItem>
                        <SelectItem value="classroom">Classroom</SelectItem>
                        <SelectItem value="training-lab">Training Lab</SelectItem>
                        <SelectItem value="meeting-room">Meeting Room</SelectItem>
                        <SelectItem value="auditorium">Auditorium</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rCap">Workstation Capacity</Label>
                    <Input
                      id="rCap"
                      type="number"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="rFloor">Floor Location</Label>
                    <Input
                      id="rFloor"
                      value={newFloor}
                      onChange={(e) => setNewFloor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rBuild">Campus Building</Label>
                    <Input
                      id="rBuild"
                      value={newBuilding}
                      onChange={(e) => setNewBuilding(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rEq">Equipment (comma-separated)</Label>
                  <Input
                    id="rEq"
                    placeholder="35 PCs, Projector, AC, UPS, Smart Board"
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRoom} disabled={!newName}>
                  Save Facility
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
        searchPlaceholder="Search rooms or equipment..."
        searchValue={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        emptyTitle="No rooms found"
      />
    </div>
  );
}
