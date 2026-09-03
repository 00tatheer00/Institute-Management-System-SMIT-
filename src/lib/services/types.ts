// ============================================================
// SERVICE LAYER TYPES — Supabase-ready pagination & query
// ============================================================

/**
 * Standard paginated result — mirrors what Supabase `.range()` returns.
 * Every service method that returns a list uses this shape.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Standard query parameters for list endpoints.
 * Maps directly to Supabase query builder methods:
 *   - search → `.ilike()` / `.textSearch()`
 *   - sortBy/sortOrder → `.order()`
 *   - page/pageSize → `.range()`
 *   - filters → `.eq()` / `.in()` / `.gte()` etc.
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string | string[] | undefined>;
}

/**
 * Result of a mutation (create/update/delete).
 * The `data` field contains the created/updated entity on success.
 */
export interface MutationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Aggregate stats returned by dashboard/analytics services.
 */
export interface AggregateStats {
  label: string;
  value: number;
  previousValue?: number;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

/**
 * Chart data point for Recharts.
 */
export interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

// ============================================================
// IMPORT TYPES
// ============================================================

export type ImportDataType =
  | "students"
  | "admissions"
  | "batches"
  | "trainers"
  | "courses"
  | "attendance"
  | "results";

export type ImportStatus =
  | "pending"
  | "validating"
  | "validated"
  | "importing"
  | "completed"
  | "failed"
  | "cancelled";

export type DuplicateStrategy =
  | "skip"
  | "update"
  | "insert";

export interface ImportColumnMapping {
  sourceColumn: string;
  targetField: string;
  isMatched: boolean;
  isRequired: boolean;
  sampleValues: string[];
}

export interface ImportValidationError {
  row: number;
  column: string;
  field: string;
  value: string;
  error: string;
  severity: "error" | "warning";
}

export interface ImportRowStatus {
  row: number;
  data: Record<string, string>;
  status: "valid" | "error" | "duplicate" | "skipped";
  errors: ImportValidationError[];
}

export interface ImportPreview {
  totalRows: number;
  validRows: number;
  errorRows: number;
  duplicateRows: number;
  rows: ImportRowStatus[];
  columns: ImportColumnMapping[];
}

export interface ImportRecord {
  id: string;
  fileName: string;
  fileSize: number;
  dataType: ImportDataType;
  totalRows: number;
  importedRows: number;
  failedRows: number;
  duplicateRows: number;
  skippedRows: number;
  status: ImportStatus;
  duplicateStrategy: DuplicateStrategy;
  importedBy: string;
  importedAt: string;
  completedAt?: string;
  errorReport?: ImportValidationError[];
}

export interface ImportFieldDefinition {
  key: string;
  label: string;
  required: boolean;
  type: "string" | "email" | "phone" | "date" | "number" | "select";
  aliases: string[]; // common alternative column names
  options?: string[]; // for select type
  validate?: (value: string) => string | null; // returns error message or null
}

// ============================================================
// PAGINATION HELPERS
// ============================================================

export function paginate<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 20
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export function applySearch<T>(
  items: T[],
  search: string | undefined,
  fields: (keyof T)[]
): T[] {
  if (!search?.trim()) return items;
  const q = search.toLowerCase().trim();
  return items.filter((item) =>
    fields.some((field) => {
      const val = item[field];
      return typeof val === "string" && val.toLowerCase().includes(q);
    })
  );
}

export function applySort<T>(
  items: T[],
  sortBy: string | undefined,
  sortOrder: "asc" | "desc" = "asc"
): T[] {
  if (!sortBy) return items;
  return [...items].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortBy];
    const bVal = (b as Record<string, unknown>)[sortBy];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp =
      typeof aVal === "string"
        ? aVal.localeCompare(bVal as string)
        : (aVal as number) - (bVal as number);
    return sortOrder === "desc" ? -cmp : cmp;
  });
}

export function applyFilters<T>(
  items: T[],
  filters: Record<string, string | string[] | undefined> | undefined
): T[] {
  if (!filters) return items;
  return items.filter((item) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
        return true;
      }
      const itemVal = (item as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        return value.includes(String(itemVal));
      }
      return String(itemVal) === value;
    })
  );
}

/**
 * Apply full query pipeline: filter → search → sort → paginate.
 * This mirrors the Supabase query chain.
 */
export function queryItems<T>(
  items: T[],
  params: QueryParams,
  searchFields: (keyof T)[]
): PaginatedResult<T> {
  let result = applyFilters(items, params.filters);
  result = applySearch(result, params.search, searchFields);
  result = applySort(result, params.sortBy, params.sortOrder);
  return paginate(result, params.page, params.pageSize);
}
