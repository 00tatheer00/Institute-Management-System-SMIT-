"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/data/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Clock,
  Award,
  ArrowRight,
  Code,
  Zap,
  CheckCircle2,
  Users,
  Layers,
  Sparkles,
  Filter,
} from "lucide-react";

const categories = [
  { id: "all", label: "All Programs" },
  { id: "Web Development", label: "Web Development" },
  { id: "Mobile Development", label: "Mobile Apps" },
  { id: "Artificial Intelligence", label: "AI & Data Science" },
  { id: "Cloud Computing", label: "Cloud & DevOps" },
  { id: "Cybersecurity", label: "Cybersecurity" },
  { id: "Graphic Design", label: "UI/UX & Design" },
];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((c) => {
    const matchesCategory =
      selectedCategory === "all" || c.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="container-custom max-w-7xl mx-auto px-4 space-y-10">
        {/* Header Title Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-[#0284c7] dark:text-sky-400 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <BookOpen className="h-4 w-4" />
            100% Free Government Certified Curriculum
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Explore IT Programs & Career Tracks
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Hands-on technical certifications designed with Silicon Valley standards, trained by industry leaders, funded by Saylani Welfare International Trust.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search courses by technology (e.g. React, Python, Flutter, Docker, AI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm shadow-xs focus:ring-2 focus:ring-[#0284c7]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#0284c7] text-white shadow-md shadow-[#0284c7]/25"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <AnimatePresence>
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="h-full group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                  <div>
                    {/* Course Thumbnail Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-emerald-500 text-white font-extrabold text-[10px] uppercase shadow-sm">
                          Batch 2026
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-black/60 text-white backdrop-blur-md border border-white/20 text-[10px] font-semibold">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration}
                        </Badge>
                      </div>

                      {/* Title on Image */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">
                          {course.category}
                        </span>
                        <h3 className="text-base font-extrabold leading-snug line-clamp-1">
                          {course.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <CardContent className="p-5 space-y-4">
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {course.shortDescription}
                      </p>

                      {/* Syllabus Highlights Tags */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Curriculum Highlights
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {course.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {course.skills.length > 4 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                              +{course.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center justify-between gap-2">
                    <Link href={`/courses/${course.slug}`} className="flex-1 cursor-pointer">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-bold rounded-full h-9 border-slate-300 dark:border-slate-700 cursor-pointer"
                      >
                        <span>View Syllabus</span>
                      </Button>
                    </Link>
                    <Link href={`/admissions?course=${course.slug}`} className="flex-1 cursor-pointer">
                      <Button
                        size="sm"
                        className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-full h-9 shadow-sm cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>Apply</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty Search Result */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              No courses found matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-slate-500">
              Try searching for &quot;Web&quot;, &quot;AI&quot;, &quot;Python&quot;, &quot;Flutter&quot;, or click All Programs.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="rounded-full cursor-pointer mt-2"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
