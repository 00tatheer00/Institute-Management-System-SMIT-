"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { getAllTickets, updateTicketStatus } from "@/lib/services/support-service";
import type { SupportTicket, SupportCategory, SupportStatus } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LifeBuoy, Search, MessageSquare, CheckCircle2,
  Clock, AlertCircle, Eye, User
} from "lucide-react";

export default function AdminSupportPage() {
  const [ticketList, setTicketList] = useState<SupportTicket[]>(() =>
    getAllTickets({ pageSize: 100 }).data
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredTickets = useMemo(() => {
    return ticketList.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.studentName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [ticketList, searchQuery, selectedCategory, selectedStatus]);

  const openCount = ticketList.filter((t) => t.status === "open").length;
  const inProgressCount = ticketList.filter((t) => t.status === "in-progress").length;
  const resolvedCount = ticketList.filter((t) => t.status === "resolved").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Support & Inquiries Helpdesk"
        description="Review student issues regarding lab workstations, attendance adjustments, syllabus inquiries, and certification requests."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Support" },
        ]}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1 bg-rose-50/40 dark:bg-rose-950/20 border-rose-200">
          <p className="text-xs text-rose-700 dark:text-rose-400 uppercase font-semibold">New Open Tickets</p>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-400">{openCount}</p>
          <p className="text-xs text-muted-foreground">Awaiting staff response</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
          <p className="text-xs text-muted-foreground">Assigned to faculty / IT staff</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Resolved Cases</p>
          <p className="text-2xl font-bold text-emerald-600">{resolvedCount}</p>
          <p className="text-xs text-muted-foreground">Satisfactorily concluded</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ticket #, student, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9 text-xs"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(val: string | null) => {
                if (val) setSelectedCategory(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="attendance">Attendance Discrepancy</SelectItem>
                <SelectItem value="technical">Lab Hardware / IT</SelectItem>
                <SelectItem value="certificate">Certificate Inquiry</SelectItem>
                <SelectItem value="admission">Admissions</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={(val: string | null) => {
                if (val) setSelectedStatus(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open (Urgent)</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Institutional Support Queue ({filteredTickets.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Assigned student requests and audit trails
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ticket #</th>
                  <th className="py-3 px-4 font-semibold">Student</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Subject</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Opened</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-xs text-rose-600">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {t.studentName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground max-w-xs truncate">
                      {t.subject}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          t.priority === "urgent" || t.priority === "high"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          t.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : t.status === "in-progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                      {t.createdAt}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Link href={`/admin/support/${t.id}`}>
                        <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                          <MessageSquare className="h-3 w-3" /> Manage
                        </Button>
                      </Link>
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
