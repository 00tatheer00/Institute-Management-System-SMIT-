import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { siteConfig } from "@/lib/config/site";
import { Settings, Shield, Bell, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <PageHeader
        title="System Settings"
        description="Configure institutional parameters, branding, security policies, and future database connectors."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings" },
        ]}
      />

      <div className="space-y-6">
        {/* Institute Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-brand" /> Institute Information & Branding
            </CardTitle>
            <CardDescription>Official institution title, contact numbers, and campus address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Institute Title</Label>
              <Input defaultValue={siteConfig.name} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Official Email</Label>
                <Input defaultValue={siteConfig.contact.email} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Phone</Label>
                <Input defaultValue={siteConfig.contact.phone} readOnly />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Campus Address</Label>
              <Input defaultValue={siteConfig.contact.address} readOnly />
            </div>
          </CardContent>
        </Card>

        {/* Database & Supabase Connectors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-brand" /> Database & Storage Infrastructure
            </CardTitle>
            <CardDescription>Prepared configuration for production Supabase connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Current Data Mode</Label>
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Mock Repository Mode (Phase 2)</p>
                  <p className="text-muted-foreground text-[11px]">
                    All entity services are operating in-memory with Supabase-ready service contracts.
                  </p>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>NEXT_PUBLIC_SUPABASE_URL</Label>
                <Input placeholder="https://your-project.supabase.co" disabled />
              </div>
              <div className="space-y-1.5">
                <Label>NEXT_PUBLIC_SUPABASE_ANON_KEY</Label>
                <Input placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..." disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand" /> Security & Access Controls (RBAC)
            </CardTitle>
            <CardDescription>Permission profiles and authentication security parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-semibold text-sm">Strict Attendance Verification</p>
                <p className="text-muted-foreground text-[11px]">
                  Enforce minimum 75% attendance threshold before certificate eligibility.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-semibold text-sm">Candidate Duplicate Screening</p>
                <p className="text-muted-foreground text-[11px]">
                  Block duplicate CNIC or email entries during public admission form submission.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
