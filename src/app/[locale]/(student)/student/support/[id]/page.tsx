"use client";

import { useState, use } from "react";
import { Link } from "@/i18n/navigation";
import { getTicketById, addTicketReply } from "@/lib/services/support-service";
import type { SupportTicket } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LifeBuoy, ArrowLeft, Send, MessageSquare,
  CheckCircle2, Clock, User, ShieldCheck
} from "lucide-react";

export default function StudentTicketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

  const [ticket, setTicket] = useState<SupportTicket | undefined>(() =>
    getTicketById(ticketId)
  );

  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!ticket) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Ticket Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested support ticket does not exist.</p>
        <Link href="/student/support">
          <Button size="sm" variant="outline">← Back to Support</Button>
        </Link>
      </div>
    );
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSending(true);
    const reply = addTicketReply({
      ticketId: ticket.id,
      authorId: "student-1",
      authorName: "Muhammad Khan",
      authorRole: "student",
      message: replyMessage.trim(),
    });

    if (reply) {
      setTicket({
        ...ticket,
        replies: [...ticket.replies, reply],
      });
      setReplyMessage("");
    }
    setIsSending(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button & Header */}
      <div>
        <Link href="/student/support" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Support Requests
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

          <Badge
            className={
              ticket.status === "resolved"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
            }
          >
            Status: {ticket.status}
          </Badge>
        </div>
      </div>

      {/* Original Issue Card */}
      <Card>
        <CardHeader className="p-4 pb-2 border-b bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {ticket.studentName} (Original Request)
            </span>
            <span className="font-mono">{ticket.createdAt}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </CardContent>
      </Card>

      {/* Conversation Thread */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-rose-600" />
          Replies & Updates ({ticket.replies.length})
        </h3>

        {ticket.replies.length > 0 ? (
          ticket.replies.map((rep) => (
            <Card
              key={rep.id}
              className={
                rep.authorRole === "student"
                  ? "border-blue-200 bg-blue-50/10 ms-6"
                  : "border-emerald-200 bg-emerald-50/15 me-6"
              }
            >
              <CardHeader className="p-3 pb-2 border-b bg-muted/10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{rep.authorName}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        rep.authorRole === "trainer"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : rep.authorRole === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {rep.authorRole}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-[11px] font-mono">
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
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic p-4 text-center border rounded-lg bg-card">
            No replies yet. Faculty and administration typically respond within 24 hours.
          </p>
        )}
      </div>

      {/* Student Reply Form */}
      {ticket.status !== "closed" && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSendReply} className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground block">
                Post Additional Information or Reply
              </label>
              <textarea
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[80px]"
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSending}
                  className="gap-1.5 text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <Send className="h-3 w-3" /> Send Reply
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
