"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  getCommunicationLogs,
  retryCommunicationLog,
} from "@/lib/services/communication-service";
import type { CommunicationLog, NotificationChannel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Clock, ArrowLeft, Search, Filter, RefreshCw,
  MessageSquare, Mail, Smartphone, Bell, CheckCircle2,
  AlertTriangle, RotateCw
} from "lucide-react";

export default function AdminCommunicationLogsPage() {
  const [logs, setLogs] = useState<CommunicationLog[]>(() => getCommunicationLogs());
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRetrying, setIsRetrying] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (channelFilter !== "all" && log.channel !== channelFilter) return false;
    if (statusFilter !== "all" && log.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.recipientName.toLowerCase().includes(q) ||
        log.recipientContact.toLowerCase().includes(q) ||
        log.title.toLowerCase().includes(q) ||
        log.body.toLowerCase().includes(q) ||
        (log.templateCode && log.templateCode.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleRetry = async (id: string) => {
    setIsRetrying(id);
    await retryCommunicationLog(id);
    setLogs(getCommunicationLogs());
    setIsRetrying(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/communications" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Communication Audit Logs
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Complete delivery audit trail across In-App, WhatsApp, Email, and SMS with failure diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/communications">
            <Button variant="outline" size="sm" className="text-xs">
              Back to Hub
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="p-3 bg-card/60">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute start-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by recipient, phone, email, subject, or template code..."
              className="ps-8 text-xs h-8"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Channel Select */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="text-xs rounded-lg border border-input bg-background p-1.5 h-8"
            >
              <option value="all">All Channels</option>
              <option value="in-app">In-App</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-lg border border-input bg-background p-1.5 h-8"
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="sent">Sent</option>
              <option value="queued">Queued</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="p-3 text-start">Recipient</th>
                <th className="p-3 text-start">Channel &amp; Provider</th>
                <th className="p-3 text-start">Subject &amp; Message</th>
                <th className="p-3 text-start">Status</th>
                <th className="p-3 text-start">Timestamp</th>
                <th className="p-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-foreground">{log.recipientName}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{log.recipientContact}</p>
                    <span className="text-[10px] text-primary capitalize font-medium">{log.recipientRole}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 font-medium capitalize">
                      {log.channel === "whatsapp" ? <MessageSquare className="h-3.5 w-3.5 text-emerald-600" /> :
                       log.channel === "email" ? <Mail className="h-3.5 w-3.5 text-blue-600" /> :
                       log.channel === "sms" ? <Smartphone className="h-3.5 w-3.5 text-amber-600" /> :
                       <Bell className="h-3.5 w-3.5" />}
                      <span>{log.channel}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[130px]">{log.provider}</p>
                  </td>
                  <td className="p-3 max-w-xs">
                    <p className="font-semibold text-foreground line-clamp-1">{log.title}</p>
                    <p className="text-muted-foreground text-[11px] line-clamp-2">{log.body}</p>
                    {log.templateCode && (
                      <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                        tpl:{log.templateCode}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        log.status === "delivered" ? "default" :
                        log.status === "sent" ? "outline" :
                        log.status === "failed" ? "destructive" : "secondary"
                      }
                      className="text-[10px] capitalize"
                    >
                      {log.status}
                    </Badge>
                    {log.errorMessage && (
                      <p className="text-[10px] text-destructive mt-1 font-mono truncate max-w-[140px]" title={log.errorMessage}>
                        {log.errorMessage}
                      </p>
                    )}
                  </td>
                  <td className="p-3 text-[11px] text-muted-foreground font-mono whitespace-nowrap">
                    {log.deliveredAt || log.createdAt}
                  </td>
                  <td className="p-3 text-end">
                    {log.status === "failed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(log.id)}
                        disabled={isRetrying === log.id}
                        className="h-7 text-xs gap-1"
                      >
                        <RefreshCw className={`h-3 w-3 ${isRetrying === log.id ? "animate-spin" : ""}`} />
                        Retry
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No communication logs matching selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
