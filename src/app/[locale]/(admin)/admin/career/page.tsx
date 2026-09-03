"use client";

import { useState } from "react";
import {
  getAllCareerProfiles,
  getPlacementStats,
  recordPlacement,
} from "@/lib/services/career-service";
import type { StudentCareerProfile, EmploymentStatus, PlacementType } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Briefcase, GraduationCap, Building2, CheckCircle2,
  ExternalLink, Plus, Filter, Sparkles, TrendingUp
} from "lucide-react";

export default function AdminCareerPage() {
  const [profiles, setProfiles] = useState<StudentCareerProfile[]>(() => getAllCareerProfiles().data);
  const [stats, setStats] = useState(() => getPlacementStats());
  const [statusFilter, setStatusFilter] = useState<EmploymentStatus | "all">("all");
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);

  // Form State
  const [studentName, setStudentName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [placementType, setPlacementType] = useState<PlacementType>("internship");
  const [monthlyStipend, setMonthlyStipend] = useState("");

  const handleCreatePlacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !companyName || !roleTitle) return;

    recordPlacement({
      studentId: `std-${Date.now()}`,
      studentName,
      courseName: "Web Development",
      companyName,
      roleTitle,
      placementType,
      startDate: new Date().toISOString().split("T")[0],
      monthlyStipend: Number(monthlyStipend) || 45000,
      isVerified: true,
    });

    setProfiles(getAllCareerProfiles().data);
    setStats(getPlacementStats());
    setIsPlacementOpen(false);
    setStudentName("");
    setCompanyName("");
    setRoleTitle("");
    setMonthlyStipend("");
  };

  const filtered = profiles.filter(
    (p: StudentCareerProfile) => statusFilter === "all" || p.employmentStatus === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Career Advisory &amp; Placement Coordination"
          description="Track student technical skill profiles, portfolio readiness, software house internships, and verified employment."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Career & Placements" },
          ]}
        />

        <div>
          <Button
            size="sm"
            onClick={() => setIsPlacementOpen(true)}
            className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Plus className="h-4 w-4" /> Record Verified Placement
          </Button>

          <Dialog open={isPlacementOpen} onOpenChange={setIsPlacementOpen}>
            <DialogContent className="sm:max-w-md">
            <form onSubmit={handleCreatePlacement}>
              <DialogHeader>
                <DialogTitle className="text-base font-bold">Record Industry Placement</DialogTitle>
                <DialogDescription className="text-xs">
                  Verify a graduate's software engineering internship or full-time employment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3.5 py-4 text-xs">
                <div className="space-y-1.5">
                  <Label>Candidate Name</Label>
                  <Input
                    placeholder="e.g. Muhammad Khan"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Hiring Software House</Label>
                    <Input
                      placeholder="e.g. TechInnovate Labs"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Designation / Role</Label>
                    <Input
                      placeholder="e.g. Junior React Developer"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Engagement Type</Label>
                    <Select value={placementType} onValueChange={(val) => setPlacementType(val as any)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internship">Paid Internship</SelectItem>
                        <SelectItem value="full-time">Full-Time Employment</SelectItem>
                        <SelectItem value="freelance-contract">Freelance Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Monthly Stipend (PKR)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 50000"
                      value={monthlyStipend}
                      onChange={(e) => setMonthlyStipend(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsPlacementOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Confirm Placement
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Placement KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Verified Hires</p>
          <p className="text-3xl font-extrabold text-foreground">{stats.totalPlaced}</p>
          <p className="text-xs text-muted-foreground">Placed across tech industry</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Active Internships</p>
          <p className="text-3xl font-extrabold text-blue-600">{stats.internshipsActive}</p>
          <p className="text-xs text-muted-foreground">3-6 month software house stints</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Full-Time Engineers</p>
          <p className="text-3xl font-extrabold text-emerald-600">{stats.fullTimeRoles}</p>
          <p className="text-xs text-muted-foreground">Permanent developer roles</p>
        </Card>
        <Card className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Avg. Monthly Stipend</p>
          <p className="text-3xl font-extrabold text-purple-600">PKR {(stats.averageStipend / 1000).toFixed(0)}k</p>
          <p className="text-xs text-muted-foreground">Industry-competitive compensation</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/20 border">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold">Filter by Career Status:</span>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employment Statuses</SelectItem>
            <SelectItem value="looking">Actively Looking</SelectItem>
            <SelectItem value="internship">In Internship</SelectItem>
            <SelectItem value="employed">Employed Full-Time</SelectItem>
            <SelectItem value="freelancing">Freelance Contractor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Student Career Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p: StudentCareerProfile) => (
          <Card key={p.studentId} className="flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  p.employmentStatus === "employed"
                    ? "bg-emerald-100 text-emerald-800"
                    : p.employmentStatus === "internship"
                    ? "bg-blue-100 text-blue-800"
                    : p.employmentStatus === "freelancing"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {p.employmentStatus}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {p.portfolioReadinessScore}% Ready
                </span>
              </div>
              <CardTitle className="text-base font-bold pt-1">{p.studentName}</CardTitle>
              <CardDescription className="text-xs">
                {p.courseName} · {p.batchName}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-0 text-xs">
              {/* Technical Skills */}
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground">Technical Stack:</p>
                <div className="flex flex-wrap gap-1">
                  {p.skills.slice(0, 5).map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Placement Details */}
              {p.placedCompany && (
                <div className="p-2.5 rounded-lg bg-muted/40 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Building2 className="h-3.5 w-3.5 text-blue-600" />
                    <span>{p.placedCompany}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{p.placedRole}</p>
                </div>
              )}

              {/* Notes */}
              {p.notes && (
                <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                  "{p.notes}"
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
