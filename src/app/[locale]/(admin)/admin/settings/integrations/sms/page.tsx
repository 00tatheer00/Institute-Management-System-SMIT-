"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { dispatchNotification } from "@/lib/services/communication-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone, ArrowLeft, ShieldCheck, CheckCircle2,
  Send, RefreshCw
} from "lucide-react";

export default function SmsIntegrationPage() {
  const [testNumber, setTestNumber] = useState("+92 321 9876543");
  const [testMessage, setTestMessage] = useState("MHIT Portal SMS Alert: Verification code 849204. Valid for 10 minutes.");
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendTest = async () => {
    if (!testNumber || !testMessage) return;
    setIsSending(true);
    setTestResult(null);

    try {
      const log = await dispatchNotification({
        recipientId: "test-recipient",
        recipientName: "Test Recipient",
        recipientContact: testNumber,
        recipientRole: "student",
        channel: "sms",
        title: "Test SMS Verification",
        body: testMessage,
        idempotencyKey: `test-sms-${Date.now()}`,
      });

      if (log.status === "delivered" || log.status === "sent") {
        setTestResult({
          success: true,
          message: "Test SMS transmitted successfully via Telco / Twilio gateway.",
        });
      } else {
        setTestResult({
          success: false,
          message: log.errorMessage || "SMS test dispatch failed.",
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "SMS dispatch execution failed",
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
              SMS Gateway Integration
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Campus mobile SMS transmission adapter (Twilio and local telecommunication carriers)
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
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Campus Mobile SMS Gateway</CardTitle>
                <CardDescription className="text-xs">Provider: Twilio / Direct Telco Gateway</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
              <ShieldCheck className="h-3 w-3 me-1" /> Credentials Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Status</span>
              <span className="font-semibold text-amber-600">Not Configured — Requires Credentials</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Sender ID</span>
              <span className="font-mono text-[11px] text-foreground">SMIT-MHIT</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Security</span>
              <span className="font-mono text-[11px] text-muted-foreground">TWILIO_AUTH_TOKEN protected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test SMS Dispatcher */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Send className="h-4.5 w-4.5 text-primary" />
            Transmit Diagnostic Test SMS
          </CardTitle>
          <CardDescription className="text-xs">
            Verify mobile carrier routing and delivery status receipts
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
            <label className="text-xs font-semibold mb-1 block">Recipient Mobile Number</label>
            <Input
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              placeholder="+92 321 9876543"
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">SMS Message</label>
            <Input
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="text-xs"
            />
          </div>

          <Button
            onClick={handleSendTest}
            disabled={isSending || !testNumber || !testMessage}
            className="gap-2 text-xs"
          >
            {isSending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Transmit Test SMS
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
