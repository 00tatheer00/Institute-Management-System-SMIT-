"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";

// ============================================================
// Types
// ============================================================

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  render: (row: T) => React.ReactNode;
}

export interface FilterDef {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearch?: (query: string) => void;
  onSort?: (key: string, order: "asc" | "desc") => void;
  onFilterChange?: (key: string, value: string) => void;
  filters?: FilterDef[];
  activeFilters?: Record<string, string>;
  searchPlaceholder?: string;
  searchValue?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isLoading?: boolean;
  // Selection
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  getRowId?: (row: T) => string;
  // Bulk actions
  bulkActions?: React.ReactNode;
  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  // Actions
  actions?: React.ReactNode;
  className?: string;
}

// ============================================================
// Component
// ============================================================

export function DataTable<T>({
  columns,
  data,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  onFilterChange,
  filters,
  activeFilters,
  searchPlaceholder = "Search...",
  searchValue = "",
  sortBy,
  sortOrder = "asc",
  isLoading,
  selectable,
  selectedIds = new Set(),
  onSelectionChange,
  getRowId,
  bulkActions,
  emptyTitle = "No results found",
  emptyDescription,
  emptyIcon,
  actions,
  className,
}: DataTableProps<T>) {
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    onSearch?.(val);
  };

  const handleSort = (key: string) => {
    if (!onSort) return;
    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    onSort(key, newOrder);
  };

  const allSelected = data.length > 0 && getRowId && data.every((row) => selectedIds.has(getRowId(row)));
  const someSelected = data.length > 0 && getRowId && data.some((row) => selectedIds.has(getRowId(row))) && !allSelected;

  const handleSelectAll = () => {
    if (!onSelectionChange || !getRowId) return;
    if (allSelected) {
      const next = new Set(selectedIds);
      data.forEach((row) => next.delete(getRowId(row)));
      onSelectionChange(next);
    } else {
      const next = new Set(selectedIds);
      data.forEach((row) => next.add(getRowId(row)));
      onSelectionChange(next);
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          {onSearch && (
            <div className="relative max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="ps-9 h-9"
              />
            </div>
          )}

          {/* Filters */}
          {filters && filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Select
                  key={filter.key}
                  value={activeFilters?.[filter.key] || ""}
                  onValueChange={(val) => onFilterChange?.(filter.key, !val || val === "__all__" ? "" : val)}
                >
                  <SelectTrigger className="h-9 w-auto min-w-[130px] text-sm">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{filter.label}</SelectItem>
                    {filter.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && bulkActions}
          {actions}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {selectable && (
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      col.sortable && "cursor-pointer select-none",
                      col.headerClassName
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        sortBy === col.key
                          ? sortOrder === "asc"
                            ? <ArrowUp className="h-3.5 w-3.5 text-foreground" />
                            : <ArrowDown className="h-3.5 w-3.5 text-foreground" />
                          : <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize > 5 ? 5 : pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {selectable && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
                    {columns.map((col) => (
                      <TableCell key={col.key}><Skeleton className="h-4 w-24" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      icon={emptyIcon}
                      className="py-12"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => {
                  const rowId = getRowId?.(row) || String(rowIndex);
                  const isSelected = selectedIds.has(rowId);
                  return (
                    <TableRow
                      key={rowId}
                      className={cn(isSelected && "bg-primary/5")}
                    >
                      {selectable && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleSelectRow(rowId)}
                          />
                        </TableCell>
                      )}
                      {columns.map((col) => (
                        <TableCell key={col.key} className={col.className}>
                          {col.render(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {total > 0 ? `${start}–${end} of ${total}` : "0 results"}
            {selectedIds.size > 0 && ` (${selectedIds.size} selected)`}
          </p>
          <div className="flex items-center gap-2">
            {onPageSizeChange && (
              <Select
                value={String(pageSize)}
                onValueChange={(val) => onPageSizeChange(Number(val))}
              >
                <SelectTrigger className="h-8 w-[70px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onPageChange(1)}>
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-sm px-2 text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}>
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
