"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getStudentTickets, createTicket } from "@/lib/services/support-service";
import type { SupportTicket, SupportCategory, SupportPriority } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LifeBuoy, Plus, MessageSquare, Clock, CheckCircle2,
  AlertCircle, ArrowRight, User, HelpCircle
} from "lucide-react";

export default function StudentSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    getStudentTickets("student-1")
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SupportCategory>("academic");
  const [priority, setPriority] = useState<SupportPriority>("medium");
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket = createTicket({
      studentId: "student-1",
      studentName: "Muhammad Khan",
      studentEmail: "muhammad.khan@student.mhit.edu.pk",
      courseName: "Web Development",
      batchName: "WD-01",
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority,
    });

    setTickets([newTicket, ...tickets]);
    setIsCreateOpen(false);
    setSubject("");
    setDescription("");
    setCreatedSuccess(true);
    setTimeout(() => setCreatedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <LifeBuoy className="h-3.5 w-3.5" />
            Student Helpdesk
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Support Requests & Inquiries</h1>
          <p className="text-sm text-muted-foreground">
            Get assistance regarding classroom attendance, curriculum questions, lab issues, or certificates
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5 text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white font-medium">
                <Plus className="h-4 w-4" /> Open New Ticket
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Submit Support Request</DialogTitle>
              <DialogDescription className="text-xs">
                Provide details below. Faculty and administration respond within 24 operational hours.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <Select
                    value={category}
                    onValueChange={(val: string | null) => {
                      if (val) setCategory(val as SupportCategory);
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic / Coursework</SelectItem>
                      <SelectItem value="attendance">Attendance Record</SelectItem>
                      <SelectItem value="technical">Lab / Portal Technical</SelectItem>
                      <SelectItem value="certificate">Certificate Inquiry</SelectItem>
                      <SelectItem value="admission">Admissions / Transfer</SelectItem>
                      <SelectItem value="general">General Help</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Priority</label>
                  <Select
                    value={priority}
                    onValueChange={(val: string | null) => {
                      if (val) setPriority(val as SupportPriority);
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Subject</label>
                <Input
                  placeholder="Brief summary of issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Description & Specifics</label>
                <textarea
                  placeholder="Explain what happened, relevant dates, or computer lab workstation numbers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[90px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Submit Ticket
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {createdSuccess && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-rose-600" />
          Support ticket opened! An administrator or faculty trainer will review it shortly.
        </div>
      )}

      {/* Tickets Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            My Support Tickets ({tickets.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Track inquiries, view administrator replies, and resolve queries
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ticket #</th>
                  <th className="py-3 px-4 font-semibold">Subject</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Replies</th>
                  <th className="py-3 px-4 font-semibold">Opened</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-foreground">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground max-w-xs truncate">
                      {t.subject}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                        {t.category}
                      </span>
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
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      {t.replies.length}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
                      {t.createdAt}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Link href={`/student/support/${t.id}`}>
                        <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                          <MessageSquare className="h-3 w-3" /> Conversation
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
