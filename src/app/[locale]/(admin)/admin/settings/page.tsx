"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { siteConfig } from "@/lib/config/site";
import {
  defaultAcademicPolicies,
  getAcademicPolicies,
  updateAcademicPolicies,
} from "@/lib/config/academic-policies";
import {
  Settings, Shield, Bell, Database, Globe,
  BookOpen, CheckCircle2, Save, Info
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"institute" | "academic" | "notifications" | "localization" | "system">("institute");
  const [policies, setPolicies] = useState(() => getAcademicPolicies());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcademicPolicies(policies);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <PageHeader
        title="Institutional System Settings &amp; Policies"
        description="Centralized configuration for campus branding, minimum academic pass thresholds, communication channels, and system parameters."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings" },
        ]}
      />

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        {[
          { id: "institute", label: "Institute & Branding", icon: <Settings className="h-3.5 w-3.5" /> },
          { id: "academic", label: "Academic Policies", icon: <BookOpen className="h-3.5 w-3.5" /> },
          { id: "notifications", label: "Notification Channels", icon: <Bell className="h-3.5 w-3.5" /> },
          { id: "localization", label: "Localization & Languages", icon: <Globe className="h-3.5 w-3.5" /> },
          { id: "system", label: "System & Architecture", icon: <Database className="h-3.5 w-3.5" /> },
        ].map((tab) => (
          <Button
            key={tab.id}
            size="sm"
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id as any)}
            className="text-xs h-8 gap-1.5 font-medium"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings successfully saved and synchronized across domain services!
        </div>
      )}

      {/* Tab 1: Institute & Branding */}
      {activeTab === "institute" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Institute Profile &amp; Campus Contacts</CardTitle>
            <CardDescription className="text-xs">
              Official institutional credentials displayed on public certificates and admission slips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Institution Title</Label>
              <Input defaultValue={siteConfig.name} readOnly className="bg-muted/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Official Email</Label>
                <Input defaultValue={siteConfig.contact.email} readOnly className="bg-muted/30" />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Hotline</Label>
                <Input defaultValue={siteConfig.contact.phone} readOnly className="bg-muted/30" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Main Campus Physical Address</Label>
              <Input defaultValue={siteConfig.contact.address} readOnly className="bg-muted/30" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Configurable Academic Policies */}
      {activeTab === "academic" && (
        <form onSubmit={handleSavePolicies}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Institutional Academic Pass &amp; Eligibility Thresholds</CardTitle>
              <CardDescription className="text-xs">
                Centralized evaluation standards applied across attendance audits, exam certifications, and grade calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Minimum Attendance Requirement (%)</Label>
                  <Input
                    type="number"
                    value={policies.minAttendancePercentage}
                    onChange={(e) =>
                      setPolicies({ ...policies, minAttendancePercentage: Number(e.target.value) })
                    }
                    min={50}
                    max={100}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Standard threshold for certificate clearance (default 75%)</p>
                </div>

                <div className="space-y-1.5">
                  <Label>Assignment Completion Rate (%)</Label>
                  <Input
                    type="number"
                    value={policies.minAssignmentCompletionRate}
                    onChange={(e) =>
                      setPolicies({ ...policies, minAssignmentCompletionRate: Number(e.target.value) })
                    }
                    min={50}
                    max={100}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Mandatory coursework completion (default 80%)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Minimum Passing Cumulative GPA (out of 4.0)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={policies.passingGpaThreshold}
                    onChange={(e) =>
                      setPolicies({ ...policies, passingGpaThreshold: Number(e.target.value) })
                    }
                    min={1.0}
                    max={4.0}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Minimum grade threshold required for graduation (default 2.0)</p>
                </div>

                <div className="space-y-1.5">
                  <Label>Late Submission Daily Penalty (%)</Label>
                  <Input
                    type="number"
                    value={policies.latePenaltyPerDayPercentage}
                    onChange={(e) =>
                      setPolicies({ ...policies, latePenaltyPerDayPercentage: Number(e.target.value) })
                    }
                    min={0}
                    max={25}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Marks deducted for overdue submissions per 24 hours</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border">
                <div>
                  <p className="font-semibold text-foreground">Automated Certificate Issuance</p>
                  <p className="text-muted-foreground text-[11px]">
                    Automatically issue scannable digital certificates upon meeting all 3 eligibility criteria
                  </p>
                </div>
                <Switch
                  checked={policies.autoIssueCertificates}
                  onCheckedChange={(checked) =>
                    setPolicies({ ...policies, autoIssueCertificates: checked })
                  }
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
                  <Save className="h-3.5 w-3.5" /> Save Academic Policies
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* Tab 3: Notification Channels */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Communication Architecture &amp; Gateway Adapters</CardTitle>
            <CardDescription className="text-xs">
              Configured dispatch channels for multi-channel broadcasts and instant student alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {[
              { title: "In-App Portal Notification Stream", status: "Active (Operational)", desc: "Delivers bell notifications in Student and Trainer topbars.", live: true },
              { title: "Institutional Email Gateway (SMTP / SES)", status: "Architecture Ready (Mock)", desc: "Dispatches admission confirmation and credential download links.", live: false },
              { title: "Campus Mobile SMS Provider (Telco API)", status: "Architecture Ready (Mock)", desc: "Instant SMS alerts for class schedule changes and emergency closures.", live: false },
              { title: "WhatsApp Cloud Business API", status: "Architecture Ready (Mock)", desc: "Broadcasts batch timetable notifications directly to student WhatsApp.", live: false },
            ].map((chan, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">{chan.title}</p>
                  <p className="text-muted-foreground text-[11px]">{chan.desc}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  chan.live ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {chan.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Localization */}
      {activeTab === "localization" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Internationalization &amp; Script Layouts</CardTitle>
            <CardDescription className="text-xs">
              Language support across English (LTR) and Urdu (RTL) locales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-muted/20 border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold">English (en)</span>
                <span className="text-emerald-600 font-semibold text-[11px]">Active (LTR)</span>
              </div>
              <p className="text-muted-foreground text-[11px]">Primary instruction language for programming code and technical terminology.</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/20 border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold">اردو (ur)</span>
                <span className="text-emerald-600 font-semibold text-[11px]">Active (RTL)</span>
              </div>
              <p className="text-muted-foreground text-[11px]">Full right-to-left layout support for community accessibility and regional inclusion.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: System & Architecture */}
      {activeTab === "system" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">System Architecture &amp; Database State</CardTitle>
            <CardDescription className="text-xs">
              Infrastructure mode and migration readiness
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-muted/30 border space-y-1">
              <p className="font-bold text-foreground">Current Operating Mode</p>
              <p className="text-muted-foreground">
                Domain Service Layer with Relational In-Memory Datasets (Enterprise Phase 5).
              </p>
              <p className="text-[11px] text-blue-600 font-mono">
                All 18 domain services adhere to asynchronous contracts ready for direct Supabase PostgreSQL tables.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Platform Build Version</Label>
                <Input value="v0.5.0-enterprise" readOnly className="bg-muted/30 font-mono text-xs" />
              </div>
              <div className="space-y-1">
                <Label>Next.js Framework</Label>
                <Input value="Next.js 16.3.4 (Turbopack)" readOnly className="bg-muted/30 font-mono text-xs" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
