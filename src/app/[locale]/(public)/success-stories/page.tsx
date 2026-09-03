"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { successStories } from "@/lib/data/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Star,
  Quote,
  TrendingUp,
  Building2,
  Briefcase,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function SuccessStoriesPage() {
  const [selectedTrack, setSelectedTrack] = useState("all");

  const tracks = [
    { id: "all", label: "All Stories" },
    { id: "Web Development", label: "Web Development" },
    { id: "App Development", label: "Mobile Apps" },
    { id: "Artificial Intelligence", label: "AI & Data Science" },
    { id: "UI/UX Design", label: "UI/UX Design" },
    { id: "Freelancing", label: "Freelancing & Remote" },
  ];

  const filteredStories = successStories.filter((s) => {
    if (selectedTrack === "all") return true;
    return s.courseName.toLowerCase().includes(selectedTrack.toLowerCase());
  });

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="container-custom max-w-6xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Trophy className="h-4 w-4 text-emerald-600" />
            150,000+ Alumni Across 35 Countries
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            From Zero Coding to High-Paying Tech Careers
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Real stories of Pakistani students, non-tech graduates, and job seekers who transformed their families&apos; financial futures through 100% free Saylani IT education.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                selectedTrack === track.id
                  ? "bg-[#0284c7] text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card
              key={story.id}
              className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                {/* User Head */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={story.avatar}
                    alt={story.studentName}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                      {story.studentName}
                    </h3>
                    <p className="text-xs text-[#0284c7] font-semibold">
                      {story.currentRole}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      at {story.company}
                    </p>
                  </div>
                </div>

                {/* Achievement Highlight */}
                <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-200 font-semibold flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{story.achievement}</span>
                </div>

                {/* Quote */}
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed pt-1">
                  &quot;{story.quote}&quot;
                </p>

                {/* Batch Badge */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <span>Track: {story.courseName}</span>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {story.batchName}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Placement Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-center space-y-4 shadow-xl">
          <Badge className="bg-emerald-500 text-white font-extrabold text-xs uppercase px-3 py-1">
            Start Your Transformation
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black">
            You Could Be the Next Success Story!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            All it takes is dedication and consistency. Zero tuition fees, world-class trainers, and complete placement guidance are waiting for you.
          </p>
          <div className="pt-2">
            <Link href="/admissions">
              <Button className="btn-shimmer bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold rounded-full px-9 h-11 shadow-lg shadow-[#0284c7]/30 cursor-pointer">
                Enroll for Free Admission Today →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
