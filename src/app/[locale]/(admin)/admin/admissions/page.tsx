"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type ColumnDef, type FilterDef } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { getApplications } from "@/lib/services/admission-service";
import { courses } from "@/lib/data/courses";
import type { Application } from "@/lib/types";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdmissionsListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("submittedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const result = useMemo(() => {
    return getApplications({
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

  const columns: ColumnDef<Application>[] = [
    {
      key: "studentName",
      header: "Applicant",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            href={`/admin/admissions/${row.id}`}
            className="font-medium text-sm hover:underline block truncate"
          >
            {row.studentName}
          </Link>
          <p className="text-[11px] text-muted-foreground font-mono">{row.applicationId}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Contact",
      render: (row) => (
        <div className="text-xs">
          <p>{row.phone}</p>
          <p className="text-muted-foreground text-[11px] truncate max-w-[140px]">{row.email}</p>
        </div>
      ),
    },
    {
      key: "courseId",
      header: "Applied Course",
      sortable: true,
      render: (row) => {
        const course = courses.find((c) => c.id === row.courseId);
        return <span className="text-xs font-medium">{course?.name || row.courseId}</span>;
      },
    },
    {
      key: "city",
      header: "City / Education",
      render: (row) => (
        <div className="text-xs text-muted-foreground">
          <p>{row.city}</p>
          <p className="text-[10px]">{row.education}</p>
        </div>
      ),
    },
    {
      key: "submittedAt",
      header: "Applied Date",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.submittedAt).toLocaleDateString()}
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
        <Link href={`/admin/admissions/${row.id}`}>
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
        { value: "pending", label: "Pending" },
        { value: "under-review", label: "Under Review" },
        { value: "approved", label: "Approved" },
        { value: "waitlisted", label: "Waitlisted" },
        { value: "rejected", label: "Rejected" },
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
        title="Admissions Queue"
        description="Review inbound candidate applications, perform vetting, and approve for student enrollment."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Admissions" },
        ]}
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
        searchPlaceholder="Search applicant name, phone, CNIC..."
        searchValue={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        emptyTitle="No applications found"
      />
    </div>
  );
}
