"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  getFinancialSummary,
  getAllGrants,
  recordFundingGrant,
} from "@/lib/services/finance-service";
import type { FundingGrant, FundingStatus } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  DollarSign, ArrowUpRight, ArrowDownRight, Wallet,
  Plus, Receipt, FileText, CheckCircle2, ShieldAlert
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

export default function AdminFinancePage() {
  const [summary, setSummary] = useState(() => getFinancialSummary());
  const [grants, setGrants] = useState<FundingGrant[]>(() => getAllGrants().data);
  const [isGrantOpen, setIsGrantOpen] = useState(false);

  // Form State
  const [sourceName, setSourceName] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState<FundingStatus>("received");

  const handleCreateGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName || !amount) return;

    recordFundingGrant({
      sourceId: `src-${Date.now()}`,
      sourceName,
      amount: Number(amount),
      purpose: purpose || "General Educational Endowment",
      reference: reference || "GRT-REF-2026",
      status,
    });

    setSummary(getFinancialSummary());
    setGrants(getAllGrants().data);
    setIsGrantOpen(false);
    setSourceName("");
    setAmount("");
    setPurpose("");
    setReference("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Institutional Finance &amp; Grants Management"
          description="Track philanthropic endowments, government subsidies, and operating budget disbursements."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Finance" },
          ]}
        />

        <div className="flex items-center gap-2">
          <Link href="/admin/finance/expenses">
            <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 font-medium">
              <Receipt className="h-3.5 w-3.5 text-blue-600" /> Operating Expenses
            </Button>
          </Link>

          <div>
            <Button
              size="sm"
              onClick={() => setIsGrantOpen(true)}
              className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <Plus className="h-4 w-4" /> Record Funding Grant
            </Button>

            <Dialog open={isGrantOpen} onOpenChange={setIsGrantOpen}>
              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleCreateGrant}>
                <DialogHeader>
                  <DialogTitle className="text-base font-bold">Record Institutional Grant</DialogTitle>
                  <DialogDescription className="text-xs">
                    Log an approved endowment or technological subsidy to the central ledger.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3.5 py-4 text-xs">
                  <div className="space-y-1.5">
                    <Label>Funding Source Organization</Label>
                    <Input
                      placeholder="e.g. Saylani Welfare International Trust (SMIT)"
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Amount (PKR)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 5000000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Reference Code</Label>
                      <Input
                        placeholder="e.g. SMIT-OPS-2026"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Grant Purpose &amp; Allocation</Label>
                    <Input
                      placeholder="e.g. Full laboratory equipment & tuition subsidies"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsGrantOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Grant
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>

      {/* Demonstration Data Disclaimer */}
      <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300">
        <ShieldAlert className="h-4 w-4 shrink-0 text-blue-600" />
        <span>
          <strong>Operational Notice:</strong> Financial figures shown represent simulated budgetary endowments for campus operational planning.
        </span>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1 bg-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-semibold">
            <span>Total Endowments &amp; Grants</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">
            PKR {(summary.totalFunding / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            PKR {summary.totalFunding.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 space-y-1 bg-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-semibold">
            <span>Operating Expenditures</span>
            <ArrowDownRight className="h-4 w-4 text-rose-600" />
          </div>
          <p className="text-3xl font-extrabold text-rose-600">
            PKR {(summary.totalExpenses / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            PKR {summary.totalExpenses.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 space-y-1 bg-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-semibold">
            <span>Operating Reserve Balance</span>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">
            PKR {(summary.remainingBalance / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs text-emerald-700/80 dark:text-emerald-400">
            Healthy institutional liquidity
          </p>
        </Card>
      </div>

      {/* Visual Monthly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Monthly Expense Disbursements</CardTitle>
            <CardDescription className="text-xs">
              Direct disbursements for laboratory hardware, fiber bandwidth, and campus maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={summary.monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: any) => `PKR ${Number(val).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Expenditure by Operational Category</CardTitle>
            <CardDescription className="text-xs">
              Budget allocation across campus facilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {summary.expensesByCategory.map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{c.label}</span>
                  <span className="font-mono">PKR {c.amount.toLocaleString()} ({c.percentage}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Funding Grants Ledger */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-semibold">Endowments &amp; Grants Roster</CardTitle>
          <CardDescription className="text-xs">
            Approved allocations from sponsoring foundations and technological partners
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Grant #</th>
                  <th className="py-3 px-4 font-semibold">Source Organization</th>
                  <th className="py-3 px-4 font-semibold">Amount (PKR)</th>
                  <th className="py-3 px-4 font-semibold">Received Date</th>
                  <th className="py-3 px-4 font-semibold">Purpose</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono text-xs">
                {grants.map((g: FundingGrant) => (
                  <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      {g.grantNumber}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-foreground">
                      {g.sourceName}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600">
                      PKR {g.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-sans">
                      {g.receivedDate}
                    </td>
                    <td className="py-3 px-4 font-sans text-muted-foreground max-w-xs truncate">
                      {g.purpose}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        g.status === "received"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
