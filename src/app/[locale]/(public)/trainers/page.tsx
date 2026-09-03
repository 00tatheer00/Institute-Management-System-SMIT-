"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { trainers } from "@/lib/data/trainers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Star,
  GraduationCap,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function TrainersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const tags = ["all", "React.js", "Flutter", "Python", "AWS", "UI/UX", "Cybersecurity", "Docker"];

  const filteredTrainers = trainers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === "all" ||
      t.expertise.some((e) => e.toLowerCase().includes(selectedTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="container-custom max-w-6xl mx-auto px-4 space-y-10">
        {/* Header Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-[#0284c7] dark:text-sky-400 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Users className="h-4 w-4" />
            400+ Certified Industry Mentors
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Learn from Silicon Valley & Local Tech Leaders
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Our faculty members are active staff engineers, solution architects, and tech founders who bring real-world production code into the classroom.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search faculty by name or tech stack (e.g. React, Flutter, Python, AWS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  selectedTag === tag
                    ? "bg-[#0284c7] text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {tag === "all" ? "All Faculty" : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <Card
              key={trainer.id}
              className="group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#0284c7]/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                      {trainer.name}
                    </h3>
                    <p className="text-xs text-[#0284c7] font-semibold line-clamp-1">
                      {trainer.title}
                    </p>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{trainer.rating}</span>
                      <span className="text-slate-400 font-normal">
                        ({trainer.totalStudents} students)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {trainer.bio}
                </p>

                {/* Skills Chips */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Core Technologies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.expertise.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-auto flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  {trainer.experience.split(",")[0]}
                </span>
                <Link href={`/courses`} className="cursor-pointer">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-[#0284c7] hover:text-[#0369a1] hover:bg-sky-50 dark:hover:bg-sky-950/40 p-0 h-auto cursor-pointer flex items-center gap-1"
                  >
                    <span>View Courses</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Join as Mentor Banner */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Are you a senior tech lead or software architect?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Join Saylani&apos;s mission to train Pakistan&apos;s next generation of software engineers. Become a guest speaker, mentor, or full trainer.
            </p>
          </div>
          <Link href="/contact">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full px-8 h-11 cursor-pointer shrink-0 shadow-md">
              Join as Trainer →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
