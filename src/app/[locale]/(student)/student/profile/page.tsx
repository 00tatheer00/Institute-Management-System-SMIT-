"use client";

import { useState } from "react";
import { getStudentById } from "@/lib/data/students";
import { getCourseById } from "@/lib/data/courses";
import { getBatchById } from "@/lib/data/batches";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle, Lock, Save, CheckCircle2,
  Mail, Phone, MapPin, Globe, Award, ShieldAlert,
  GraduationCap, Calendar, BookOpen
} from "lucide-react";

export default function StudentProfilePage() {
  const student = getStudentById("student-1");
  const course = getCourseById(student?.courseId || "course-1");
  const batch = getBatchById(student?.batchId || "batch-1");

  // Editable personal info state
  const [phone, setPhone] = useState(student?.phone || "+92 300 1234567");
  const [altEmail, setAltEmail] = useState("m.khan.dev@gmail.com");
  const [address, setAddress] = useState(student?.address || "House 42, Block 5, Gulshan-e-Iqbal, Karachi");
  const [emergencyContact, setEmergencyContact] = useState("+92 321 9876543 (Father)");
  const [github, setGithub] = useState("https://github.com/mkhan-dev");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/mkhan-dev");

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <UserCircle className="h-3.5 w-3.5" />
          Student Dossier & Account
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal contact details and review your verified institutional credentials
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Personal contact information successfully updated!
        </div>
      )}

      {/* Main Profile Dossier Card */}
      <Card className="border-blue-200 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/20 to-background">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              MK
            </div>

            <div className="space-y-1.5 text-center sm:text-start flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-foreground">
                  {student?.name || "Muhammad Khan"}
                </h2>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200">
                  Active Student
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground font-mono">
                Roll No: <strong className="text-foreground">{student?.registrationId || "MH-C1-2026-0001"}</strong>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                  {course?.name || "Web Development"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                  Cohort {batch?.name || "WD-01 (Morning)"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Editable Personal Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Personal Contact Information</CardTitle>
            <CardDescription className="text-xs">
              Keep your contact details up to date for campus notifications and job placement dispatches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-blue-600" /> Primary Mobile Phone
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-blue-600" /> Alternate Email Address
                </label>
                <Input
                  type="email"
                  value={altEmail}
                  onChange={(e) => setAltEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-rose-600" /> Emergency Contact
                </label>
                <Input
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Residential Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-purple-600" /> GitHub Profile URL
                </label>
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-sky-600" /> LinkedIn Profile URL
                </label>
                <Input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="gap-1.5 text-xs h-8">
                <Save className="h-3.5 w-3.5" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Read-Only Academic Credentials Section */}
        <Card className="border-muted bg-muted/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" /> Institutional Academic Credentials
                </CardTitle>
                <CardDescription className="text-xs">
                  Protected official records maintained by the Office of Admissions & Registrar
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-muted gap-1">
                <Lock className="h-3 w-3" /> Read-Only
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-card border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Official Student ID</span>
                <span className="font-bold font-mono text-sm">{student?.registrationId}</span>
              </div>

              <div className="p-3 rounded-lg bg-card border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Registered Program</span>
                <span className="font-bold text-sm">{course?.name}</span>
              </div>

              <div className="p-3 rounded-lg bg-card border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Assigned Cohort</span>
                <span className="font-bold text-sm">{batch?.name}</span>
              </div>

              <div className="p-3 rounded-lg bg-card border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Admission Date</span>
                <span className="font-medium font-mono">{student?.enrolledAt || "2026-01-05"}</span>
              </div>

              <div className="p-3 rounded-lg bg-card border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Identity Document</span>
                <span className="font-medium font-mono">{student?.cnic || "42101-1234567-1"}</span>
              </div>

              <div className="p-3 rounded-lg bg-card border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Institutional Email</span>
                <span className="font-medium font-mono text-blue-600">{student?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
