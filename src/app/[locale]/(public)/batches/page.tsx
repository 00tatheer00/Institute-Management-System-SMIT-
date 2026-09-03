"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { batches } from "@/lib/data/batches";
import { courses } from "@/lib/data/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Building2,
  Users,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function BatchesPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBatches = batches.filter((b) => {
    if (statusFilter === "all") return true;
    return b.status === statusFilter;
  });

  const getCourse = (courseId: string) => {
    return courses.find((c) => c.id === courseId) || courses[0];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enrolling":
        return <Badge className="bg-emerald-500 text-white animate-pulse">Admissions Open</Badge>;
      case "in-progress":
        return <Badge className="bg-[#0284c7] text-white">In Progress</Badge>;
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "completed":
        return <Badge variant="outline" className="text-slate-400">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="container-custom max-w-6xl mx-auto px-4 space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Layers className="h-4 w-4" />
            Batch 2026 Academic Calendar
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Academic Batches & Admission Schedule
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Monitor live admission rounds, test dates, class shifts, and seat availability across all Saylani campuses nationwide.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "All Batches" },
            { id: "enrolling", label: "Admissions Open" },
            { id: "in-progress", label: "In Progress" },
            { id: "upcoming", label: "Upcoming" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#0284c7] text-white shadow-md shadow-[#0284c7]/25"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const course = getCourse(batch.courseId);
            const remainingSeats = batch.totalSeats - batch.enrolledSeats;
            const percentFilled = Math.round((batch.enrolledSeats / batch.totalSeats) * 100);

            return (
              <Card
                key={batch.id}
                className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {batch.name}
                      </span>
                      {getStatusBadge(batch.status)}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {course.name}
                    </h3>
                  </div>

                  <CardContent className="p-5 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#0284c7]" /> Start Date:
                      </span>
                      <span className="font-bold">{batch.startDate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#0284c7]" /> Timings:
                      </span>
                      <span className="font-bold">
                        {batch.schedule.startTime} - {batch.schedule.endTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-[#0284c7]" /> Venue:
                      </span>
                      <span className="font-bold">{batch.campus} ({batch.room})</span>
                    </div>

                    {/* Seat Progress */}
                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-slate-400">Seats Capacity:</span>
                        <span className="font-extrabold">
                          {batch.enrolledSeats} / {batch.totalSeats} ({percentFilled}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            batch.status === "enrolling"
                              ? "bg-emerald-500"
                              : batch.status === "in-progress"
                              ? "bg-[#0284c7]"
                              : "bg-slate-400"
                          }`}
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                  {batch.status === "enrolling" ? (
                    <Link href={`/admissions?course=${course.slug}`} className="block cursor-pointer">
                      <Button className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-full h-9 shadow-sm cursor-pointer flex items-center justify-center gap-1">
                        <span>Apply for This Batch</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/courses/${course.slug}`} className="block cursor-pointer">
                      <Button
                        variant="outline"
                        className="w-full text-xs font-bold rounded-full h-9 cursor-pointer"
                      >
                        View Course Details
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
