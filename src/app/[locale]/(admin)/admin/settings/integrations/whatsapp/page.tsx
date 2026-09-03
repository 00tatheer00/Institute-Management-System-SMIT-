"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { dispatchNotification } from "@/lib/services/communication-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare, ArrowLeft, ShieldCheck, CheckCircle2,
  Send, RefreshCw, Copy, Check, ExternalLink, HelpCircle
} from "lucide-react";

export default function WhatsAppIntegrationPage() {
  const [testNumber, setTestNumber] = useState("+92 300 1234567");
  const [testMessage, setTestMessage] = useState("Hello! This is an official test communication from Mohsin & Huma IT Center portal.");
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/webhooks/whatsapp`
    : "https://portal.mhit.edu.pk/api/webhooks/whatsapp";

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

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
        channel: "whatsapp",
        title: "Test WhatsApp Verification",
        body: testMessage,
        idempotencyKey: `test-wa-${Date.now()}`,
      });

      if (log.status === "delivered" || log.status === "sent") {
        setTestResult({
          success: true,
          message: "Test message transmitted successfully via WhatsApp driver.",
        });
      } else {
        setTestResult({
          success: false,
          message: log.errorMessage || "WhatsApp test dispatch failed.",
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Dispatch execution failed",
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
              WhatsApp Integration
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Meta Cloud Business API and Twilio WhatsApp gateway driver configuration
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

      {/* Connection Status Overview */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Meta WhatsApp Business API</CardTitle>
                <CardDescription className="text-xs">Provider: WhatsApp Cloud Platform / Twilio Adapter</CardDescription>
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
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Authentication</span>
              <span className="font-mono text-[11px] text-muted-foreground">Environment Protected</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Last Successful Dispatch</span>
              <span className="font-medium text-foreground">Today at 12:00 PM</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
              Zero-Credential Leakage Security Policy
            </p>
            <p className="text-[11px] leading-relaxed">
              API tokens and Phone Number IDs are securely managed through server environment variables
              (<code className="font-mono text-primary">WHATSAPP_API_TOKEN</code> &amp; <code className="font-mono text-primary">WHATSAPP_PHONE_NUMBER_ID</code>) and are never transmitted to client browsers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Webhook Callback Endpoint</CardTitle>
          <CardDescription className="text-xs">
            Configure this endpoint in your Meta Business App to receive live delivery and read receipts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-semibold mb-1 block">Callback URL</label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={webhookUrl}
                className="font-mono text-xs bg-muted/50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyWebhook}
                className="gap-1.5 shrink-0 text-xs"
              >
                {copiedWebhook ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedWebhook ? "Copied" : "Copy URL"}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Verify Token</label>
            <Input
              readOnly
              value="mhit_portal_webhook_verify_secret"
              className="font-mono text-xs bg-muted/50 max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Message Dispatcher */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Send className="h-4.5 w-4.5 text-primary" />
            Transmit Diagnostic Test Message
          </CardTitle>
          <CardDescription className="text-xs">
            Verify provider connectivity by sending a test alert to a mobile number
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
              {testResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <ShieldCheck className="h-4 w-4 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold mb-1 block">Recipient Phone Number (with Country Code)</label>
            <Input
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              placeholder="+92 300 1234567"
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Test Message Content</label>
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
            Transmit Test Message
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
