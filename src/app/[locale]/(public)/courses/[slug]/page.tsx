import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { trainers } from "@/lib/data/trainers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Sparkles,
  ChevronRight,
  Laptop,
} from "lucide-react";

export function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const trainer = trainers.find((t) => t.courseIds.includes(course.id)) || trainers[0];

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-slate-50/50 dark:bg-slate-950">
      <div className="container-custom max-w-6xl mx-auto px-4 space-y-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition-colors cursor-pointer">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/courses" className="hover:text-slate-600 transition-colors cursor-pointer">
            Courses
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 dark:text-white truncate">{course.name}</span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Course Info (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-500 text-white font-extrabold text-[10px] uppercase">
                  Batch 2026 Admissions Open
                </Badge>
                <Badge variant="outline" className="text-xs font-semibold">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-xs font-semibold">
                  Level: {course.level}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {course.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Course Image Preview */}
            <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
              <img
                src={course.image}
                alt={course.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Duration: {course.duration} ({course.totalClasses} Total Lectures)</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-extrabold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>100% Free Tuition Fee</span>
                </div>
              </div>
            </div>

            {/* What You'll Learn / Key Learning Objectives */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#0284c7]" />
                  What You Will Master in This Course
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {course.learningOutcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="font-semibold">{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Full Curriculum Modules */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Detailed Curriculum Modules
                  </h2>
                  <p className="text-xs text-slate-500">
                    {course.curriculum.length} core learning modules with real hands-on projects.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {course.curriculum.map((mod, idx) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#0284c7] font-black text-xs">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {mod.title}
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0 font-medium">
                        {mod.duration}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-9">
                      {mod.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pl-9 pt-1">
                      {mod.topics.map((t, tidx) => (
                        <span
                          key={tidx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Outcomes & Market Value */}
            <Card className="border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Career Prospects & Remote Earning Potential
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Graduates of this program have been placed at leading multinational technology firms, top local software houses, and global freelance platforms (Upwork, Fiverr, Toptal) earning an average starting compensation of $400 - $1,500/month.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sticky Quick-Apply Sidebar (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <Card className="border-2 border-[#0284c7]/40 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="p-5 bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200">
                  Government & Trust Funded
                </p>
                <h3 className="text-2xl font-black leading-tight">
                  Free Admission
                </h3>
                <p className="text-xs text-sky-100">
                  Rs. 0 Tuition Fee • 100% Free Scholarship
                </p>
              </div>

              <CardContent className="p-5 space-y-4">
                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Upcoming Batch:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">Batch 2026</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Total Duration:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Class Shifts:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">Morning / Evening</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Eligibility:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">Matric / Intermediate</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Certification:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">SMIT Verified</span>
                  </div>
                </div>

                {/* Direct Apply CTA */}
                <Link href={`/admissions?course=${course.slug}`} className="block cursor-pointer">
                  <button className="w-full btn-shimmer bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl h-11 shadow-lg shadow-[#0284c7]/30 transition-all cursor-pointer flex items-center justify-center gap-2">
                    <span>Apply for This Course</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>

                <p className="text-[10px] text-center text-slate-400">
                  Entrance test slip will be generated upon application submission.
                </p>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            {trainer && (
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Lead Instructor
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {trainer.name}
                    </h4>
                    <p className="text-[10px] text-slate-500">{trainer.title}</p>
                    <p className="text-[9px] text-[#0284c7] font-semibold">SMIT Lead Instructor</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Prerequisites */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Course Prerequisites
              </p>
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {course.prerequisites.map((p, idx) => (
                  <p key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{p}</span>
                  </p>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
