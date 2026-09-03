"use client";

import { useState } from "react";
import { trainers } from "@/lib/data/trainers";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { initialClasses } from "@/lib/data/classes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle, BookOpen, Layers, Calendar, Clock,
  MapPin, Mail, Phone, Globe, Save, CheckCircle2, Award
} from "lucide-react";

export default function TrainerProfilePage() {
  const trainer = trainers[0] || {
    id: "trainer-1",
    name: "Sir Ahmed Hassan",
    title: "Lead Full-Stack Instructor & Software Architect",
    email: "ahmed.hassan@mhit.edu.pk",
    phone: "+92 300 9876543",
    expertise: ["Next.js 15", "TypeScript", "React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    experience: "8+ Years in Enterprise Web Architecture",
  };

  const assignedBatches = batches.filter((b) => b.trainerId === trainer.id || b.id === "batch-1" || b.id === "batch-3");
  const assignedClasses = initialClasses.filter((c) => c.trainerId === trainer.id || c.batchId === "batch-1");

  const [phone, setPhone] = useState(trainer.phone);
  const [bio, setBio] = useState("Software architect and educator passionate about modern web standards, server-driven architectures, and building production-ready scalable systems.");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/ahmed-hassan-lead");
  const [github, setGithub] = useState("https://github.com/ahmedhassan-tech");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
          <UserCircle className="h-3.5 w-3.5" />
          Faculty Portfolio
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Trainer Profile & Schedule</h1>
        <p className="text-sm text-muted-foreground">
          Faculty biography, assigned laboratory batches, and weekly teaching timetable
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Trainer profile information updated successfully!
        </div>
      )}

      {/* Trainer Profile Card */}
      <Card className="border-emerald-200 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/20 to-background">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              AH
            </div>

            <div className="space-y-1.5 text-center sm:text-start flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-foreground">{trainer.name}</h2>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200">
                  Senior Faculty
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground font-medium">{trainer.title}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
                {trainer.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded text-foreground"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Batches */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-600" />
          Assigned Batches ({assignedBatches.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {assignedBatches.map((b) => (
            <Card key={b.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">{b.name}</h4>
                <Badge variant="outline" className="text-[10px]">
                  {b.schedule?.days?.join(", ")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {b.schedule?.startTime} - {b.schedule?.endTime}
              </p>
              <div className="text-[11px] text-muted-foreground pt-1 border-t flex justify-between">
                <span>Room: {b.room}</span>
                <span>Enrolled: {b.enrolledSeats}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Editable Contact & Bio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Faculty Information & Contact</CardTitle>
          <CardDescription className="text-xs">
            Manage your professional contact channels and public bio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" /> Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-600" /> Institutional Email
                </label>
                <Input
                  value={trainer.email}
                  disabled
                  className="h-9 text-xs bg-muted"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-600" /> LinkedIn Profile
                </label>
                <Input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-purple-600" /> GitHub Profile
                </label>
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Professional Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[80px]"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" size="sm" className="gap-1.5 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="h-3.5 w-3.5" /> Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
