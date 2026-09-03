"use client";

import { useState, use } from "react";
import { Link } from "@/i18n/navigation";
import { getTicketById, addTicketReply, updateTicketStatus } from "@/lib/services/support-service";
import type { SupportTicket, SupportStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LifeBuoy, ArrowLeft, Send, MessageSquare,
  CheckCircle2, Clock, User, ShieldCheck
} from "lucide-react";

export default function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

  const [ticket, setTicket] = useState<SupportTicket | undefined>(() =>
    getTicketById(ticketId)
  );

  const [adminReply, setAdminReply] = useState("");
  const [currentStatus, setCurrentStatus] = useState<SupportStatus>(
    ticket?.status || "open"
  );
  const [statusUpdated, setStatusUpdated] = useState(false);

  if (!ticket) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Ticket Not Found</h2>
        <Link href="/admin/support">
          <Button size="sm" variant="outline">← Back to Helpdesk</Button>
        </Link>
      </div>
    );
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReply.trim()) return;

    const reply = addTicketReply({
      ticketId: ticket.id,
      authorId: "admin-1",
      authorName: "Academic Support Officer",
      authorRole: "admin",
      message: adminReply.trim(),
    });

    if (reply) {
      setTicket({
        ...ticket,
        replies: [...ticket.replies, reply],
        status: "in-progress",
      });
      setCurrentStatus("in-progress");
      setAdminReply("");
    }
  };

  const handleStatusChange = (newStatus: SupportStatus) => {
    setCurrentStatus(newStatus);
    updateTicketStatus(ticket.id, newStatus);
    setTicket({ ...ticket, status: newStatus });
    setStatusUpdated(true);
    setTimeout(() => setStatusUpdated(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <Link href="/admin/support" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Support Queue
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-rose-600">
                {ticket.ticketNumber}
              </span>
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                {ticket.category}
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {ticket.subject}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={currentStatus}
              onValueChange={(val: string | null) => {
                if (val) handleStatusChange(val as SupportStatus);
              }}
            >
              <SelectTrigger className="w-36 h-8 text-xs font-medium">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="waiting-student">Waiting on Student</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {statusUpdated && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Ticket status successfully updated!
        </div>
      )}

      {/* Student Dossier & Issue Details */}
      <Card>
        <CardHeader className="p-4 pb-2 border-b bg-muted/20">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-foreground">
              Candidate: <strong>{ticket.studentName}</strong> • {ticket.courseName}
            </span>
            <span className="text-muted-foreground font-mono">{ticket.createdAt}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </CardContent>
      </Card>

      {/* Message History */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-rose-600" />
          Audit &amp; Response Thread ({ticket.replies.length})
        </h3>

        {ticket.replies.map((rep) => (
          <Card
            key={rep.id}
            className={
              rep.authorRole === "admin"
                ? "border-purple-200 bg-purple-50/10 ms-6"
                : rep.authorRole === "trainer"
                ? "border-emerald-200 bg-emerald-50/10 ms-6"
                : "border-blue-200 bg-blue-50/10 me-6"
            }
          >
            <CardHeader className="p-3 pb-2 border-b bg-muted/10">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{rep.authorName}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-muted">
                    {rep.authorRole}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {rep.createdAt}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-3.5">
              <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                {rep.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Reply Form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSendReply} className="space-y-3">
            <label className="text-xs font-semibold text-muted-foreground block">
              Official Resolution / Staff Response
            </label>
            <textarea
              placeholder="Provide instructional resolution, updated attendance verification, or administrative advice..."
              value={adminReply}
              onChange={(e) => setAdminReply(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[85px]"
              required
            />
            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-muted-foreground">
                Sending a reply automatically switches ticket to In Progress
              </span>
              <Button
                type="submit"
                size="sm"
                className="gap-1.5 text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="h-3 w-3" /> Post Resolution
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
