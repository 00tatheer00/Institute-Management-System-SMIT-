"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { dispatchNotification } from "@/lib/services/communication-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Mail, ArrowLeft, ShieldCheck, CheckCircle2,
  Send, RefreshCw, Copy, Check, HelpCircle
} from "lucide-react";

export default function EmailIntegrationPage() {
  const [testEmail, setTestEmail] = useState("student@mhit.edu.pk");
  const [testSubject, setTestSubject] = useState("MHIT Institutional Email Connectivity Test");
  const [testBody, setTestBody] = useState("This is an automated test dispatch confirming email delivery driver health.");
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendTest = async () => {
    if (!testEmail || !testSubject || !testBody) return;
    setIsSending(true);
    setTestResult(null);

    try {
      const log = await dispatchNotification({
        recipientId: "test-recipient",
        recipientName: "Test Recipient",
        recipientContact: testEmail,
        recipientRole: "student",
        channel: "email",
        title: testSubject,
        body: testBody,
        idempotencyKey: `test-email-${Date.now()}`,
      });

      if (log.status === "delivered" || log.status === "sent") {
        setTestResult({
          success: true,
          message: "Test email transmitted successfully through transactional driver.",
        });
      } else {
        setTestResult({
          success: false,
          message: log.errorMessage || "Email test dispatch failed.",
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Email dispatch execution failed",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/communications" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Email Integration
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Transactional email dispatcher powered by Resend and SMTP Gateway Adapter
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

      {/* Provider Details */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Institutional Email Dispatcher</CardTitle>
                <CardDescription className="text-xs">Provider: Resend API / SMTP Gateway</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
              <ShieldCheck className="h-3 w-3 me-1" /> Architecture Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Status</span>
              <span className="font-semibold text-emerald-600">Active / Simulated Mock</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Sender Address</span>
              <span className="font-mono text-[11px] text-foreground">notifications@mhit.edu.pk</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Security</span>
              <span className="font-mono text-[11px] text-muted-foreground">RESEND_API_KEY protected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Email Dispatcher */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Send className="h-4.5 w-4.5 text-primary" />
            Transmit Diagnostic Test Email
          </CardTitle>
          <CardDescription className="text-xs">
            Validate transactional email routing and HTML formatting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                testResult.success
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600"
                  : "bg-destructive/10 border border-destructive/20 text-destructive"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{testResult.message}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold mb-1 block">Recipient Email</label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Subject</label>
            <Input
              value={testSubject}
              onChange={(e) => setTestSubject(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Body</label>
            <Input
              value={testBody}
              onChange={(e) => setTestBody(e.target.value)}
              className="text-xs"
            />
          </div>

          <Button
            onClick={handleSendTest}
            disabled={isSending || !testEmail || !testSubject}
            className="gap-2 text-xs"
          >
            {isSending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Transmit Test Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
