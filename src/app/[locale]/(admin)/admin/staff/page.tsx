"use client";

import React, { useState, useMemo, useCallback } from "react";
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
import { getStaff, createStaff } from "@/lib/services/staff-service";
import type { Staff, StaffRole } from "@/lib/types";
import { UserPlus, UserCog } from "lucide-react";

export default function StaffListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);

  // New Staff Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<StaffRole>("coordinator");
  const [newDepartment, setNewDepartment] = useState("Academic Affairs");
  const [newDesignation, setNewDesignation] = useState("Program Coordinator");

  const result = useMemo(() => {
    return getStaff({
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

  const handleCreateStaff = () => {
    if (!newName || !newEmail) return;
    createStaff({
      name: newName,
      email: newEmail,
      phone: newPhone || "+92-300-0000000",
      role: newRole,
      department: newDepartment,
      designation: newDesignation,
      joinedAt: new Date().toISOString().split("T")[0],
      status: "active",
    });

    setCreateOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
  };

  const columns: ColumnDef<Staff>[] = [
    {
      key: "name",
      header: "Staff Member",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-sm">{row.name}</p>
          <p className="text-[11px] text-muted-foreground">{row.designation}</p>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      sortable: true,
      render: (row) => <span className="text-xs font-medium">{row.department}</span>,
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => (
        <div className="text-xs">
          <p>{row.email}</p>
          <p className="text-muted-foreground text-[11px]">{row.phone}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <span className="capitalize text-xs font-mono px-2 py-0.5 rounded bg-muted">
          {row.role.replace(/-/g, " ")}
        </span>
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
      key: "department",
      label: "All Departments",
      options: [
        { value: "Academic Affairs", label: "Academic Affairs" },
        { value: "Administration", label: "Administration" },
        { value: "IT Department", label: "IT Department" },
        { value: "Finance", label: "Finance" },
        { value: "Library", label: "Library" },
        { value: "Security", label: "Security" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative Staff"
        description="Directory of non-teaching personnel, coordinators, lab technicians, and campus administrators."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Staff" },
        ]}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <UserPlus className="h-4 w-4 me-2" /> Add Staff Member
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Register Staff Member</DialogTitle>
                <DialogDescription>
                  Enter institutional credentials and departmental role.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="sName">Full Name</Label>
                  <Input
                    id="sName"
                    placeholder="Muhammad Bilal"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="sEmail">Email</Label>
                    <Input
                      id="sEmail"
                      type="email"
                      placeholder="bilal@mhit.edu.pk"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sPhone">Phone</Label>
                    <Input
                      id="sPhone"
                      placeholder="+92-300-1234567"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Select value={newRole} onValueChange={(val) => { if (val) setNewRole(val as StaffRole); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coordinator">Coordinator</SelectItem>
                        <SelectItem value="lab-assistant">Lab Assistant</SelectItem>
                        <SelectItem value="office-manager">Office Manager</SelectItem>
                        <SelectItem value="it-support">IT Support</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                        <SelectItem value="librarian">Librarian</SelectItem>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sDept">Department</Label>
                    <Input
                      id="sDept"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sDesig">Designation</Label>
                  <Input
                    id="sDesig"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateStaff} disabled={!newName || !newEmail}>
                  Save Member
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
        searchPlaceholder="Search staff by name, department, or designation..."
        searchValue={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        emptyTitle="No staff members found"
      />
    </div>
  );
}
