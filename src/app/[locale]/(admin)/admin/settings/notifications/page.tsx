"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  getAutomationRules,
  updateAutomationRule,
} from "@/lib/services/automation-service";
import type { AutomationRule, NotificationChannel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings, ArrowLeft, CheckCircle2, MessageSquare,
  Mail, Smartphone, Bell, Clock, Zap
} from "lucide-react";

export default function AdminNotificationSettingsPage() {
  const [rules, setRules] = useState<AutomationRule[]>(() => getAutomationRules());
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const toggleRuleEnabled = (ruleId: string) => {
    const current = rules.find((r) => r.id === ruleId);
    if (!current) return;

    const updated = updateAutomationRule(ruleId, { isEnabled: !current.isEnabled });
    if (updated) {
      setRules([...getAutomationRules()]);
      setSaveSuccess(`Rule "${current.label}" updated.`);
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const toggleRuleChannel = (ruleId: string, channel: NotificationChannel) => {
    const current = rules.find((r) => r.id === ruleId);
    if (!current) return;

    let updatedChannels = [...current.channels];
    if (updatedChannels.includes(channel)) {
      if (updatedChannels.length > 1) {
        updatedChannels = updatedChannels.filter((c) => c !== channel);
      }
    } else {
      updatedChannels.push(channel);
    }

    updateAutomationRule(ruleId, { channels: updatedChannels });
    setRules([...getAutomationRules()]);
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
              Notification Automation Rules
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure automated event-driven notification triggers and transport channel routing
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

      {saveSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Rules List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-amber-500" />
            Active Institutional Event Triggers
          </CardTitle>
          <CardDescription className="text-xs">
            Events automatically trigger multi-channel notifications when transactions occur in the portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-1">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-colors space-y-3 ${
                rule.isEnabled ? "bg-card border-border" : "bg-muted/40 border-border/50 opacity-60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{rule.label}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {rule.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Trigger: <code className="font-mono text-primary text-[10px]">{rule.eventName}</code> • Template: <code className="font-mono text-muted-foreground text-[10px]">{rule.templateCode}</code>
                  </p>
                </div>

                <Button
                  type="button"
                  variant={rule.isEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRuleEnabled(rule.id)}
                  className="h-7 text-xs px-3 self-start sm:self-auto"
                >
                  {rule.isEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {/* Channels Selector for this rule */}
              <div className="pt-2 border-t flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground me-1">Active Channels:</span>
                {[
                  { id: "in-app", label: "In-App", icon: <Bell className="h-3 w-3" /> },
                  { id: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-3 w-3 text-emerald-600" /> },
                  { id: "email", label: "Email", icon: <Mail className="h-3 w-3 text-blue-600" /> },
                  { id: "sms", label: "SMS", icon: <Smartphone className="h-3 w-3 text-amber-600" /> },
                ].map((ch) => {
                  const active = rule.channels.includes(ch.id as NotificationChannel);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      disabled={!rule.isEnabled}
                      onClick={() => toggleRuleChannel(rule.id, ch.id as NotificationChannel)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {ch.icon}
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
