"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DataTable, type ColumnDef, type FilterDef } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStudents } from "@/lib/services/student-service";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import type { Student } from "@/lib/types";
import { UserPlus, Upload, MoreHorizontal, Eye, Pencil, Trash2, Download } from "lucide-react";

export default function StudentListPage() {
  const t = useTranslations("admin.students");

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Query
  const result = useMemo(() => {
    return getStudents({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      filters: activeFilters,
    });
  }, [page, pageSize, search, sortBy, sortOrder, activeFilters]);

  // Handlers
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

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  // Column definitions
  const columns: ColumnDef<Student>[] = useMemo(() => [
    {
      key: "name",
      header: t("name"),
      sortable: true,
      render: (row) => (
        <Link href={`/admin/students/${row.id}`} className="flex items-center gap-2.5 hover:underline">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
              {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{row.name}</p>
            <p className="text-[11px] text-muted-foreground">{row.registrationId}</p>
          </div>
        </Link>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (row) => <span className="text-sm text-muted-foreground">{row.phone}</span>,
    },
    {
      key: "courseId",
      header: t("course"),
      sortable: true,
      render: (row) => {
        const course = courses.find((c) => c.id === row.courseId);
        return <span className="text-sm">{course?.name || row.courseId}</span>;
      },
    },
    {
      key: "batchId",
      header: t("batch"),
      render: (row) => {
        const batch = batches.find((b) => b.id === row.batchId);
        return <span className="text-sm text-muted-foreground">{batch?.name || row.batchId}</span>;
      },
    },
    {
      key: "attendancePercentage",
      header: t("attendance"),
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <Progress value={row.attendancePercentage} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground w-8">{row.attendancePercentage}%</span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("status"),
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-[40px]",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/admin/students/${row.id}`} className="flex items-center w-full"><Eye className="h-4 w-4 me-2" /> View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem><Pencil className="h-4 w-4 me-2" /> Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 me-2" /> Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [t]);

  // Filter definitions
  const filters: FilterDef[] = useMemo(() => [
    {
      key: "status",
      label: "All Statuses",
      options: [
        { value: "active", label: "Active" },
        { value: "graduated", label: "Graduated" },
        { value: "dropped", label: "Dropped" },
        { value: "suspended", label: "Suspended" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "courseId",
      label: "All Courses",
      options: courses.filter((c) => c.isActive).map((c) => ({ value: c.id, label: c.name })),
    },
  ], []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: t("title") },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/import">
              <Button variant="outline" size="sm"><Upload className="h-4 w-4 me-2" /> Import</Button>
            </Link>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 me-2" /> Export</Button>
            <Link href="/admin/students/new">
              <Button size="sm"><UserPlus className="h-4 w-4 me-2" /> {t("addStudent")}</Button>
            </Link>
          </div>
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
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        onSort={handleSort}
        onFilterChange={handleFilterChange}
        filters={filters}
        activeFilters={activeFilters}
        searchPlaceholder={t("searchPlaceholder")}
        searchValue={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        getRowId={(row) => row.id}
        emptyTitle="No students found"
        emptyDescription="Try adjusting your search or filters."
        bulkActions={
          <Button variant="outline" size="sm" className="text-destructive">
            Archive ({selectedIds.size})
          </Button>
        }
      />
    </div>
  );
}
