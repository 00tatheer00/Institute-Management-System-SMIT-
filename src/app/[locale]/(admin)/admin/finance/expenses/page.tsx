"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getAllExpenses, recordExpense } from "@/lib/services/finance-service";
import type { ExpenseRecord, ExpenseCategory } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Receipt, Plus, ArrowLeft, DollarSign, Filter, CheckCircle2 } from "lucide-react";

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => getAllExpenses().data);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("equipment");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    recordExpense({
      title,
      category,
      amount: Number(amount),
      reference: reference || "EXP-REF-2026",
      description: description || "Routine campus operational disbursement",
    });

    setExpenses(getAllExpenses().data);
    setIsExpenseOpen(false);
    setTitle("");
    setAmount("");
    setReference("");
    setDescription("");
  };

  const filtered = expenses.filter(
    (e: ExpenseRecord) => categoryFilter === "all" || e.category === categoryFilter
  );

  const totalFilteredAmount = filtered.reduce((sum: number, e: ExpenseRecord) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Operating Expenditures Ledger"
          description="Detailed record of hardware procurements, solar UPS maintenance, utilities, and faculty disbursements."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Finance", href: "/admin/finance" },
            { label: "Expenses" },
          ]}
        />

        <div className="flex items-center gap-2">
          <Link href="/admin/finance">
            <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 font-medium">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Funding Summary
            </Button>
          </Link>

          <div>
            <Button
              size="sm"
              onClick={() => setIsExpenseOpen(true)}
              className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <Plus className="h-4 w-4" /> Record New Expense
            </Button>

            <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
              <DialogContent className="sm:max-w-md">
              <form onSubmit={handleCreateExpense}>
                <DialogHeader>
                  <DialogTitle className="text-base font-bold">Record Operating Expense</DialogTitle>
                  <DialogDescription className="text-xs">
                    Log an approved campus expenditure to the institutional accounting register.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3.5 py-4 text-xs">
                  <div className="space-y-1.5">
                    <Label>Expense Title</Label>
                    <Input
                      placeholder="e.g. 50x Core i7 Workstations Upgrade"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={(val) => setCategory(val as ExpenseCategory)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equipment">Lab Equipment</SelectItem>
                          <SelectItem value="utilities">Utilities &amp; Fiber</SelectItem>
                          <SelectItem value="maintenance">Solar &amp; Maintenance</SelectItem>
                          <SelectItem value="events">Hackathons &amp; Events</SelectItem>
                          <SelectItem value="training">Faculty Honorarium</SelectItem>
                          <SelectItem value="software">Software &amp; Cloud</SelectItem>
                          <SelectItem value="operations">Administrative Operations</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Amount (PKR)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 2850000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Invoice / Reference Number</Label>
                    <Input
                      placeholder="e.g. INV-DELL-8831"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Itemized Description</Label>
                    <Input
                      placeholder="e.g. High-spec units with 32GB RAM for Web & AI labs"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsExpenseOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Expense
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>

      {/* Filter & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/20 border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Filter by Category:</span>
          <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "all")}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="equipment">Lab Equipment</SelectItem>
              <SelectItem value="utilities">Utilities &amp; Fiber</SelectItem>
              <SelectItem value="maintenance">Solar &amp; Maintenance</SelectItem>
              <SelectItem value="events">Events &amp; Hackathons</SelectItem>
              <SelectItem value="training">Faculty Honorarium</SelectItem>
              <SelectItem value="software">Software &amp; Cloud</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs font-medium text-muted-foreground">
          Showing <strong>{filtered.length}</strong> disbursements totaling{" "}
          <strong className="text-rose-600 font-bold font-mono">
            PKR {totalFilteredAmount.toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Expense Records Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Disbursement Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Amount (PKR)</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Funding Source</th>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {filtered.map((e: ExpenseRecord) => (
                  <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-foreground">{e.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{e.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-muted font-medium text-muted-foreground">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600">
                      PKR {e.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">
                      {e.date}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {e.fundingSourceName}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {e.reference}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {e.status}
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
