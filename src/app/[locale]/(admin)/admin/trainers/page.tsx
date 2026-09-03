"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { getTrainers, createTrainer } from "@/lib/services/trainer-service";
import { courses } from "@/lib/data/courses";
import type { Trainer } from "@/lib/types";
import { Plus, Eye, Star } from "lucide-react";

export default function TrainersListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [createOpen, setCreateOpen] = useState(false);

  // New Trainer Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newTitle, setNewTitle] = useState("Instructor");
  const [newBio, setNewBio] = useState("");
  const [newExpertise, setNewExpertise] = useState("React, Node.js");
  const [newEducation, setNewEducation] = useState("BS Computer Science");

  const result = useMemo(() => {
    return getTrainers({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
    });
  }, [page, pageSize, search, sortBy, sortOrder]);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleSort = useCallback((key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  }, []);

  const handleCreateTrainer = () => {
    if (!newName || !newEmail) return;
    createTrainer({
      name: newName,
      email: newEmail,
      phone: newPhone || "+92-300-0000000",
      avatar: `/images/trainers/trainer-1.jpg`,
      title: newTitle,
      bio: newBio,
      expertise: newExpertise.split(",").map((s) => s.trim()).filter(Boolean),
      courseIds: ["course-1"],
      experience: "5+ years teaching",
      education: newEducation,
      certifications: ["Professional Trainer"],
      socialLinks: {},
      isActive: true,
      joinedAt: new Date().toISOString().split("T")[0],
    });

    setCreateOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewBio("");
  };

  const columns: ColumnDef<Trainer>[] = [
    {
      key: "name",
      header: "Trainer Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
              {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/admin/trainers/${row.id}`}
              className="font-medium text-sm hover:underline block truncate"
            >
              {row.name}
            </Link>
            <p className="text-[11px] text-muted-foreground">{row.title}</p>
          </div>
        </div>
      ),
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
      key: "expertise",
      header: "Expertise",
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[220px]">
          {row.expertise.slice(0, 3).map((e) => (
            <Badge key={e} variant="secondary" className="text-[10px]">
              {e}
            </Badge>
          ))}
          {row.expertise.length > 3 && (
            <Badge variant="outline" className="text-[10px]">
              +{row.expertise.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {row.rating}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.isActive ? "active" : "inactive"} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-[40px] text-end",
      render: (row) => (
        <Link href={`/admin/trainers/${row.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainer Faculty Directory"
        description="Manage institute educators, specializations, ratings, and course assignments."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Trainers" },
        ]}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="h-4 w-4 me-2" /> Add Trainer
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Instructor</DialogTitle>
                <DialogDescription>
                  Add a faculty member profile and technological expertise.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="tName">Full Name</Label>
                  <Input
                    id="tName"
                    placeholder="Engr. Farhan Shah"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="tEmail">Email</Label>
                    <Input
                      id="tEmail"
                      type="email"
                      placeholder="trainer@mhit.edu.pk"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tPhone">Phone</Label>
                    <Input
                      id="tPhone"
                      placeholder="+92-300-1234567"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tTitle">Job Title / Designation</Label>
                  <Input
                    id="tTitle"
                    placeholder="Lead Full-Stack Instructor"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tSkills">Expertise (comma-separated)</Label>
                  <Input
                    id="tSkills"
                    placeholder="React, Next.js, Node.js, TypeScript"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tEdu">Education</Label>
                  <Input
                    id="tEdu"
                    placeholder="BS Computer Science"
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tBio">Bio</Label>
                  <Textarea
                    id="tBio"
                    placeholder="Instructor background and teaching philosophy..."
                    rows={2}
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTrainer} disabled={!newName || !newEmail}>
                  Save Instructor
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
        searchPlaceholder="Search trainers by name or title..."
        searchValue={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        emptyTitle="No trainers found"
      />
    </div>
  );
}
