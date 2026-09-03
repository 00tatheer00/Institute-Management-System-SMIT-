"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type ColumnDef, type FilterDef } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { getImportHistory } from "@/lib/services/import-service";
import type { ImportRecord } from "@/lib/services/types";
import { Upload, Eye, FileSpreadsheet } from "lucide-react";

export default function ImportHistoryPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("importedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const result = useMemo(() => {
    return getImportHistory({
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

  const columns: ColumnDef<ImportRecord>[] = [
    {
      key: "fileName",
      header: "File Details",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <Link
              href={`/admin/imports/${row.id}`}
              className="font-medium text-sm hover:underline truncate block"
            >
              {row.fileName}
            </Link>
            <p className="text-[11px] text-muted-foreground">
              ID: {row.id} · {(row.fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "dataType",
      header: "Entity",
      sortable: true,
      render: (row) => (
        <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-muted">
          {row.dataType}
        </span>
      ),
    },
    {
      key: "totalRows",
      header: "Row Stats",
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="font-medium">{row.importedRows} / {row.totalRows} imported</p>
          {(row.failedRows > 0 || row.skippedRows > 0) && (
            <p className="text-[10px] text-muted-foreground">
              {row.skippedRows > 0 && `${row.skippedRows} skipped `}
              {row.failedRows > 0 && `• ${row.failedRows} failed`}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "importedBy",
      header: "Imported By",
      render: (row) => (
        <span className="text-xs text-muted-foreground">{row.importedBy}</span>
      ),
    },
    {
      key: "importedAt",
      header: "Date",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.importedAt).toLocaleDateString()}
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
        <Link href={`/admin/imports/${row.id}`}>
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
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
      ],
    },
    {
      key: "dataType",
      label: "All Entities",
      options: [
        { value: "students", label: "Students" },
        { value: "admissions", label: "Admissions" },
        { value: "trainers", label: "Trainers" },
        { value: "attendance", label: "Attendance" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Audit History"
        description="Historical log of all bulk spreadsheet uploads, error reports, and processed datasets."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Imports" },
        ]}
        actions={
          <Link href="/admin/import">
            <Button size="sm">
              <Upload className="h-4 w-4 me-2" /> New Bulk Import
            </Button>
          </Link>
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
        searchPlaceholder="Search imports by file or user..."
        searchValue={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        emptyTitle="No import records found"
      />
    </div>
  );
}
