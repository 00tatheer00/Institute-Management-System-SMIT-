"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { courses } from "@/lib/data/courses";
import type { Course } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Award, Star, BookOpen } from "lucide-react";

const categories = [
  { id: "all", label: "All Admissions Open" },
  { id: "development", label: "Development" },
  { id: "data-science", label: "Data Science & AI" },
  { id: "networking", label: "Networking & Security" },
  { id: "creative", label: "Vocational & Creative Courses" },
];

export function SmitCourseTabs() {
  const [selectedCat, setSelectedCat] = useState("all");

  const filteredCourses = courses.filter((c) => {
    if (selectedCat === "all") return true;
    if (selectedCat === "development") {
      return c.category === "web-development" || c.category === "app-development";
    }
    if (selectedCat === "data-science") {
      return c.category === "artificial-intelligence" || c.category === "data-science";
    }
    if (selectedCat === "networking") {
      return c.category === "cyber-security" || c.category === "networking" || c.category === "cloud-computing";
    }
    if (selectedCat === "creative") {
      return c.category === "graphic-design" || c.category === "video-editing" || c.category === "ui-ux" || c.category === "digital-marketing";
    }
    return true;
  });

  return (
    <section className="section-padding bg-white dark:bg-slate-950">
      <div className="container-custom max-w-6xl mx-auto space-y-10">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Browse Our <span className="text-[#0284c7]">Top Courses</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Industry-vetted, 100% tuition-free programs taught by certified tech leaders.
          </p>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {categories.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#0284c7] text-white shadow-md shadow-[#0284c7]/25 scale-105"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Course Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCourses.slice(0, 6).map((course) => (
              <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-float hover:shadow-lifted hover:-translate-y-1.5 transition-all duration-300"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Green Badge in Top Corner */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#84cc16] text-slate-950 shadow-md">
                        Batch 2026
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[11px] font-mono text-cyan-300">
                        {course.category.replace(/-/g, " ").toUpperCase()}
                      </span>
                      <h3 className="text-base font-bold text-white line-clamp-1">
                        {course.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer with Enroll Button & Duration */}
                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <Link href={`/courses/${course.slug}`}>
                      <Button
                        size="sm"
                        className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs px-4 rounded-full h-8 shadow-xs"
                      >
                        Enroll Now
                      </Button>
                    </Link>

                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Courses Link */}
        <div className="text-center pt-2">
          <Link href="/courses">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 font-bold text-xs h-10 border-slate-300 dark:border-slate-700"
            >
              View All 12+ Available Courses <ArrowRight className="ms-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
