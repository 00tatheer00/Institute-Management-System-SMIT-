"use client";

import { useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings, Globe, Bell, Shield, Key,
  CheckCircle2, Save, Moon, Smartphone
} from "lucide-react";

export default function StudentSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [classReminders, setClassReminders] = useState(true);
  const [gradeAlerts, setGradeAlerts] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLanguageSwitch = (locale: "en" | "ur") => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <Settings className="h-3.5 w-3.5" />
          Preferences & Security
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure interface language, notification channels, and portal authentication credentials
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings and notification preferences updated successfully!
        </div>
      )}

      {/* Language Preferences Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" /> Interface Language (زبان کا انتخاب)
          </CardTitle>
          <CardDescription className="text-xs">
            Switch between English (LTR) and Urdu (اردو - RTL) localization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleLanguageSwitch("en")}
            className="text-xs h-9 px-4 font-medium"
          >
            English (Default LTR)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleLanguageSwitch("ur")}
            className="text-xs h-9 px-4 font-urdu font-medium"
          >
            اردو (RTL Layout)
          </Button>
        </CardContent>
      </Card>

      {/* Notification Channel Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-600" /> Notification Channels
          </CardTitle>
          <CardDescription className="text-xs">
            Control which alerts you receive via email and instant portal broadcasts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
            <div>
              <p className="text-xs font-bold text-foreground">Classroom & Lecture Reminders</p>
              <p className="text-[11px] text-muted-foreground">
                Receive notifications 1 hour before scheduled lab sessions
              </p>
            </div>
            <input
              type="checkbox"
              checked={classReminders}
              onChange={(e) => setClassReminders(e.target.checked)}
              className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
            <div>
              <p className="text-xs font-bold text-foreground">Assignment & Grade Alerts</p>
              <p className="text-[11px] text-muted-foreground">
                Instant notification when a submission is evaluated or marked by your trainer
              </p>
            </div>
            <input
              type="checkbox"
              checked={gradeAlerts}
              onChange={(e) => setGradeAlerts(e.target.checked)}
              className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
            <div>
              <p className="text-xs font-bold text-foreground">Email Dispatches & Campus Notices</p>
              <p className="text-[11px] text-muted-foreground">
                Receive holiday announcements, hackathon invitations, and job circulars
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security / Password Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Key className="h-4 w-4 text-rose-600" /> Account Security Credentials
          </CardTitle>
          <CardDescription className="text-xs">
            Update your portal login password (minimum 8 characters)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="gap-1.5 text-xs h-8">
                <Save className="h-3.5 w-3.5" /> Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
