"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  getStudentCareerProfile,
  updateStudentCareerProfile,
} from "@/lib/services/career-service";
import type { StudentCareerProfile, EmploymentStatus } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Briefcase, Award, FolderGit2, FileText, CheckCircle2,
  ExternalLink, Sparkles, Plus, Save
} from "lucide-react";

export default function StudentCareerPage() {
  const [profile, setProfile] = useState(() => getStudentCareerProfile("student-1"));
  const [newSkill, setNewSkill] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!profile) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading career profile...
      </div>
    );
  }

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || profile.skills.includes(newSkill.trim())) return;

    const updated = updateStudentCareerProfile(profile.studentId, {
      skills: [...profile.skills, newSkill.trim()],
    });
    setProfile({ ...updated });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = updateStudentCareerProfile(profile.studentId, {
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
    setProfile({ ...updated });
  };

  const handleStatusChange = (status: EmploymentStatus) => {
    const updated = updateStudentCareerProfile(profile.studentId, {
      employmentStatus: status,
    });
    setProfile({ ...updated });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <PageHeader
        title="My Career Profile &amp; Placement Readiness"
        description="Showcase your verified technical competencies, capstone project repositories, CV status, and industry placement preferences."
        breadcrumbs={[
          { label: "Student", href: "/student" },
          { label: "Career & Placement" },
        ]}
      />

      {saveSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Career profile status updated successfully!
        </div>
      )}

      {/* Portfolio Readiness Gauge Banner */}
      <Card className="border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-foreground">
                  Industry Portfolio Readiness Score
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Evaluates code repository quality, verified course certificates, and curriculum attendance.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-blue-600">
                {profile.portfolioReadinessScore}%
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                Interview Ready
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Status Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Current Career Status</CardTitle>
          <CardDescription className="text-xs">
            Notify institute placement coordinators about your current availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="space-y-1.5 max-w-xs">
            <Label>Employment &amp; Internship Standing</Label>
            <Select
              value={profile.employmentStatus}
              onValueChange={(val) => handleStatusChange(val as EmploymentStatus)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="looking">Actively Looking for Internship / Job</SelectItem>
                <SelectItem value="internship">Currently in Internship</SelectItem>
                <SelectItem value="employed">Employed Full-Time</SelectItem>
                <SelectItem value="freelancing">Freelance Contractor (Upwork/Fiverr)</SelectItem>
                <SelectItem value="further-study">Pursuing Higher Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {profile.placedCompany && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300">
              Verified Placement: <strong>{profile.placedRole}</strong> at <strong>{profile.placedCompany}</strong>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Skills Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Verified Technical Stack</CardTitle>
          <CardDescription className="text-xs">
            Skills highlighted to software houses for technical interviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-semibold border border-blue-200 dark:border-blue-900"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600 font-bold"
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm pt-2">
            <Input
              placeholder="Add skill (e.g. Next.js, Docker, Python)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="h-8 text-xs font-mono"
            />
            <Button type="submit" size="sm" variant="outline" className="h-8 text-xs gap-1">
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Artifacts & Showcase Linkages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderGit2 className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs font-bold text-foreground">Capstone Projects</p>
              <p className="text-[11px] text-muted-foreground">Portfolio showcase items</p>
            </div>
          </div>
          <Link href="/student/projects">
            <Button size="sm" variant="outline" className="text-xs h-7">
              Manage Projects
            </Button>
          </Link>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-xs font-bold text-foreground">Council Certificates</p>
              <p className="text-[11px] text-muted-foreground">Verified digital credentials</p>
            </div>
          </div>
          <Link href="/student/certificates">
            <Button size="sm" variant="outline" className="text-xs h-7">
              View Certificates
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
