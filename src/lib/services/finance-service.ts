import type {
  FundingGrant,
  ExpenseRecord,
  FinancialSummary,
  ExpenseCategory,
  FundingStatus,
} from "@/lib/types";
import { initialGrants, initialExpenses, initialFundingSources } from "@/lib/data/finance";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";

const grantStore: FundingGrant[] = [...initialGrants];
const expenseStore: ExpenseRecord[] = [...initialExpenses];

const grantSearchFields: (keyof FundingGrant)[] = [
  "grantNumber",
  "sourceName",
  "purpose",
  "reference",
];

const expenseSearchFields: (keyof ExpenseRecord)[] = [
  "title",
  "category",
  "fundingSourceName",
  "reference",
  "description",
];

export function getFinancialSummary(): FinancialSummary {
  const totalFunding = grantStore
    .filter((g) => g.status === "received" || g.status === "partially-received")
    .reduce((sum, g) => sum + g.amount, 0);

  const totalExpenses = expenseStore.reduce((sum, e) => sum + e.amount, 0);
  const remainingBalance = totalFunding - totalExpenses;

  // Monthly breakdown
  const monthlyExpenses = [
    { month: "Jan 2026", amount: 2850000 },
    { month: "Feb 2026", amount: 2890000 },
    { month: "Mar 2026", amount: 220000 },
  ];

  // Category breakdown
  const categoryLabels: Record<ExpenseCategory, string> = {
    equipment: "Lab Hardware & Workstations",
    utilities: "Electricity & Fiber Internet",
    maintenance: "Solar & Infrastructure",
    events: "Hackathons & Seminars",
    training: "Faculty Honorarium",
    operations: "Administrative Operations",
    software: "Cloud Sandboxes & Licenses",
    other: "Miscellaneous",
  };

  const catTotals: Record<string, number> = {};
  for (const exp of expenseStore) {
    catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
  }

  const expensesByCategory = Object.entries(catTotals).map(([cat, amount]) => ({
    category: cat as ExpenseCategory,
    label: categoryLabels[cat as ExpenseCategory] || cat,
    amount,
    percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
  }));

  return {
    totalFunding,
    totalExpenses,
    remainingBalance,
    monthlyExpenses,
    expensesByCategory,
  };
}

export function getAllGrants(params: QueryParams = {}): PaginatedResult<FundingGrant> {
  return queryItems(grantStore, { pageSize: 15, ...params }, grantSearchFields);
}

export function getAllExpenses(params: QueryParams = {}): PaginatedResult<ExpenseRecord> {
  return queryItems(expenseStore, { pageSize: 15, ...params }, expenseSearchFields);
}

export function recordFundingGrant(data: {
  sourceId: string;
  sourceName: string;
  amount: number;
  purpose: string;
  reference: string;
  status: FundingStatus;
  notes?: string;
}): FundingGrant {
  const count = grantStore.length + 1;
  const grantNumber = `GRT-2026-${String(count).padStart(3, "0")}`;

  const newGrant: FundingGrant = {
    id: `grant-${Date.now()}`,
    grantNumber,
    sourceId: data.sourceId,
    sourceName: data.sourceName,
    amount: data.amount,
    receivedDate: new Date().toISOString().split("T")[0],
    purpose: data.purpose,
    reference: data.reference,
    status: data.status,
    notes: data.notes,
  };

  grantStore.unshift(newGrant);
  return newGrant;
}

export function recordExpense(data: {
  title: string;
  category: ExpenseCategory;
  amount: number;
  fundingSourceId?: string;
  fundingSourceName?: string;
  reference: string;
  description: string;
  recordedBy?: string;
}): ExpenseRecord {
  const newExp: ExpenseRecord = {
    id: `exp-${Date.now()}`,
    title: data.title,
    category: data.category,
    amount: data.amount,
    date: new Date().toISOString().split("T")[0],
    fundingSourceId: data.fundingSourceId,
    fundingSourceName: data.fundingSourceName || "General Endowment",
    reference: data.reference,
    description: data.description,
    status: "approved",
    recordedBy: data.recordedBy || "Administrative Office",
  };

  expenseStore.unshift(newExp);
  return newExp;
}
