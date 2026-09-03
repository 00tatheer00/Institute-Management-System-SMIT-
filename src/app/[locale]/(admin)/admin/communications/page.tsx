"use client";

import { useState, useTransition } from "react";
import { Link } from "@/i18n/navigation";
import {
  getCommunicationLogs,
  dispatchNotification,
  getProviderConfigs,
  retryCommunicationLog,
} from "@/lib/services/communication-service";
import { getAllTemplates, interpolateVariables } from "@/lib/services/template-service";
import { students } from "@/lib/data/students";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import type { NotificationChannel, CommunicationLog, UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Send, MessageSquare, Mail, Smartphone, Bell, CheckCircle2,
  AlertCircle, RefreshCw, Layers, FileText, Settings, ShieldCheck,
  ArrowUpRight, Users, Clock
} from "lucide-react";

export default function AdminCommunicationsPage() {
  const [logs, setLogs] = useState<CommunicationLog[]>(() => getCommunicationLogs());
  const templates = getAllTemplates();
  const providers = getProviderConfigs();

  // Form State
  const [audience, setAudience] = useState<"all-students" | "course" | "batch" | "student" | "trainers" | "staff">("all-students");
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || "");
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "");
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(["in-app", "whatsapp"]);
  const [selectedTemplateCode, setSelectedTemplateCode] = useState<string>("");
  const [customTitle, setCustomTitle] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [isSending, startSending] = useTransition();
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  // Template change handler
  const handleTemplateSelect = (code: string) => {
    setSelectedTemplateCode(code);
    if (!code) {
      setCustomTitle("");
      setCustomBody("");
      return;
    }
    const tpl = templates.find((t) => t.code === code);
    if (tpl) {
      setCustomTitle(tpl.titleEn);
      setCustomBody(tpl.bodyEn);
      setSelectedChannels(tpl.channels);
    }
  };

  // Toggle channel
  const toggleChannel = (ch: NotificationChannel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  // Send broadcast
  const handleSendBroadcast = () => {
    if (!customTitle || !customBody) return;

    startSending(async () => {
      let targetRecipients: { id: string; name: string; contact: string; role: UserRole }[] = [];

      if (audience === "student") {
        const st = students.find((s) => s.id === selectedStudentId);
        if (st) {
          targetRecipients = [{ id: st.id, name: st.name, contact: st.phone || st.email, role: "student" }];
        }
      } else if (audience === "batch") {
        targetRecipients = students
          .filter((s) => s.batchId === selectedBatchId && s.status === "active")
          .map((s) => ({ id: s.id, name: s.name, contact: s.phone || s.email, role: "student" }));
      } else if (audience === "course") {
        targetRecipients = students
          .filter((s) => s.courseId === selectedCourseId && s.status === "active")
          .map((s) => ({ id: s.id, name: s.name, contact: s.phone || s.email, role: "student" }));
      } else if (audience === "trainers") {
        targetRecipients = [
          { id: "trainer-1", name: "Ahmed Hassan", contact: "+92 300 1112233", role: "trainer" },
          { id: "trainer-2", name: "Sara Fatima", contact: "+92 300 4445566", role: "trainer" },
        ];
      } else if (audience === "staff") {
        targetRecipients = [{ id: "staff-1", name: "Asif Ali", contact: "asif.ali@mhit.edu.pk", role: "staff" }];
      } else {
        // All active students
        targetRecipients = students.slice(0, 8).map((s) => ({
          id: s.id,
          name: s.name,
          contact: s.phone || s.email,
          role: "student",
        }));
      }

      for (const rec of targetRecipients) {
        for (const ch of selectedChannels) {
          const variables = {
            student_name: rec.name,
            course_name: courses.find((c) => c.id === selectedCourseId)?.name || "Web Development",
            batch_name: batches.find((b) => b.id === selectedBatchId)?.name || "WD-01",
            attendance_percentage: 88,
          };

          const finalTitle = interpolateVariables(customTitle, variables);
          const finalBody = interpolateVariables(customBody, variables);

          await dispatchNotification({
            recipientId: rec.id,
            recipientName: rec.name,
            recipientContact: rec.contact,
            recipientRole: rec.role,
            channel: ch,
            title: finalTitle,
            body: finalBody,
            templateCode: selectedTemplateCode || undefined,
            idempotencyKey: `broadcast-${Date.now()}-${rec.id}-${ch}`,
          });
        }
      }

      setLogs(getCommunicationLogs());
      setSendSuccess(`Broadcast successfully dispatched to ${targetRecipients.length} recipients across ${selectedChannels.length} channels.`);
      setTimeout(() => setSendSuccess(null), 5000);
    });
  };

  const handleRetry = async (logId: string) => {
    await retryCommunicationLog(logId);
    setLogs(getCommunicationLogs());
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Institute Communication Hub
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Omnichannel notification dispatch, automated academic triggers, and delivery audit logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/communications/templates">
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              Templates ({templates.length})
            </Button>
          </Link>
          <Link href="/admin/communications/logs">
            <Button variant="outline" size="sm" className="gap-2">
              <Clock className="h-4 w-4" />
              Delivery Logs
            </Button>
          </Link>
          <Link href="/admin/settings/notifications">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Automation Rules
            </Button>
          </Link>
        </div>
      </div>

      {/* Provider Connectivity Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {providers.map((p) => {
          const icon =
            p.channel === "in-app" ? <Bell className="h-4 w-4" /> :
            p.channel === "whatsapp" ? <MessageSquare className="h-4 w-4 text-emerald-600" /> :
            p.channel === "email" ? <Mail className="h-4 w-4 text-blue-600" /> :
            <Smartphone className="h-4 w-4 text-amber-600" />;

          return (
            <Card key={p.channel} className="p-3.5 bg-card/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-muted">{icon}</div>
                  <span className="text-xs font-bold capitalize">{p.channel}</span>
                </div>
                <Badge variant={p.isConfigured ? "default" : "secondary"} className="text-[10px] h-5">
                  {p.isConfigured ? "Configured" : "Simulated"}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 truncate">{p.name}</p>
              <div className="mt-2 pt-2 border-t flex items-center justify-between text-[10px]">
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Ready
                </span>
                <Link
                  href={`/admin/settings/integrations/${p.channel === "in-app" ? "whatsapp" : p.channel}`}
                  className="text-primary hover:underline flex items-center gap-0.5"
                >
                  Configure <ArrowUpRight className="h-2.5 w-2.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {sendSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{sendSuccess}</span>
        </div>
      )}

      {/* Main Broadcast Composer & Dispatch Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Broadcast Composer */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Send className="h-4.5 w-4.5 text-primary" />
              Compose Multi-Channel Dispatch
            </CardTitle>
            <CardDescription className="text-xs">
              Broadcast announcements or notices to selected student cohorts, trainers, or staff
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Target Audience */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Target Audience</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { id: "all-students", label: "All Students" },
                  { id: "course", label: "By Course" },
                  { id: "batch", label: "By Batch" },
                  { id: "student", label: "Single Student" },
                  { id: "trainers", label: "Trainers" },
                  { id: "staff", label: "Staff" },
                ].map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant={audience === item.id ? "default" : "outline"}
                    size="sm"
                    className="text-[11px] h-8 px-2"
                    onClick={() => setAudience(item.id as any)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dynamic Audience Selectors */}
            {audience === "course" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-input bg-background p-2"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {audience === "batch" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Select Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-input bg-background p-2"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}

            {audience === "student" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-input bg-background p-2"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.registrationId}) - {s.phone}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Channel Checkboxes */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Delivery Channels</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "in-app", label: "In-App Feed", icon: <Bell className="h-3.5 w-3.5" /> },
                  { id: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-3.5 w-3.5 text-emerald-600" /> },
                  { id: "email", label: "Email Notice", icon: <Mail className="h-3.5 w-3.5 text-blue-600" /> },
                  { id: "sms", label: "SMS Text", icon: <Smartphone className="h-3.5 w-3.5 text-amber-600" /> },
                ].map((ch) => {
                  const active = selectedChannels.includes(ch.id as NotificationChannel);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => toggleChannel(ch.id as NotificationChannel)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-colors text-start ${
                        active ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {ch.icon}
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-foreground">Template Preset (Optional)</label>
                <span className="text-[10px] text-muted-foreground">Auto-populates standardized institutional text</span>
              </div>
              <select
                value={selectedTemplateCode}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full text-xs rounded-lg border border-input bg-background p-2"
              >
                <option value="">Custom Free-Form Message</option>
                {templates.map((tpl) => (
                  <option key={tpl.code} value={tpl.code}>
                    [{tpl.category.toUpperCase()}] {tpl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject / Title */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Subject / Title</label>
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Important Announcement: Campus Schedule Update"
                className="text-xs"
              />
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-foreground">Message Content</label>
                <span className="text-[10px] text-muted-foreground">Supports: {"{{student_name}}, {{course_name}}, {{batch_name}}"}</span>
              </div>
              <Textarea
                rows={4}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                placeholder="Dear student, please note that tomorrow's lab session..."
                className="text-xs font-sans"
              />
            </div>

            <Button
              onClick={handleSendBroadcast}
              disabled={isSending || !customTitle || !customBody}
              className="w-full gap-2 text-xs"
            >
              {isSending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Dispatching to Channels...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Dispatch Broadcast ({selectedChannels.length} Channels)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right 5 cols: Live Delivery Stream & Quick Logs */}
        <Card className="lg:col-span-5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-primary" />
                Live Dispatch Stream
              </CardTitle>
              <Link href="/admin/communications/logs" className="text-xs text-primary hover:underline">
                View All Logs →
              </Link>
            </div>
            <CardDescription className="text-xs">
              Real-time audit records of outbound institutional notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {logs.slice(0, 6).map((log) => (
              <div key={log.id} className="p-3 rounded-lg border border-border bg-card/40 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{log.recipientName}</p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">{log.recipientContact}</p>
                  </div>
                  <Badge
                    variant={
                      log.status === "delivered" ? "default" :
                      log.status === "sent" ? "outline" :
                      log.status === "failed" ? "destructive" : "secondary"
                    }
                    className="text-[10px] capitalize shrink-0"
                  >
                    {log.status}
                  </Badge>
                </div>

                <p className="text-xs font-medium text-foreground/90 line-clamp-1">{log.title}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{log.body}</p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t">
                  <span className="capitalize font-medium flex items-center gap-1">
                    {log.channel === "whatsapp" ? <MessageSquare className="h-3 w-3 text-emerald-600" /> :
                     log.channel === "email" ? <Mail className="h-3 w-3 text-blue-600" /> :
                     log.channel === "sms" ? <Smartphone className="h-3 w-3 text-amber-600" /> :
                     <Bell className="h-3 w-3" />}
                    {log.channel}
                  </span>
                  <span>{log.deliveredAt || log.createdAt}</span>
                </div>

                {log.status === "failed" && (
                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    <span className="text-destructive font-mono truncate max-w-[200px]">
                      {log.errorMessage || "Delivery timeout"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRetry(log.id)}
                      className="h-6 text-[10px] px-2 text-primary"
                    >
                      <RefreshCw className="h-3 w-3 me-1" /> Retry
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
