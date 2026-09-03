import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { trainers, getTrainerById } from "@/lib/data/trainers";
import { courses } from "@/lib/data/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Star,
  Award,
  GraduationCap,
  BookOpen,
  Calendar,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export function generateStaticParams() {
  return trainers.map((trainer) => ({
    id: trainer.id,
  }));
}

export default async function TrainerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const trainer = getTrainerById(id);

  if (!trainer) {
    notFound();
  }

  const assignedCourses = courses.filter((c) => trainer.courseIds.includes(c.id));

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="container-custom max-w-5xl mx-auto px-4 space-y-8">
        {/* Back Link */}
        <Link
          href="/trainers"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Faculty Directory</span>
        </Link>

        {/* Profile Card Banner */}
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <div className="h-32 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#10b981]" />
          <CardContent className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-6">
              <div className="flex items-end gap-4">
                <img
                  src={trainer.avatar}
                  alt={trainer.name}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-lg bg-white"
                />
                <div className="pb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {trainer.name}
                  </h1>
                  <p className="text-sm font-bold text-[#0284c7]">
                    {trainer.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    Senior Faculty Member
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500 text-white font-extrabold text-xs px-3 py-1">
                  Active Faculty
                </Badge>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{trainer.rating} / 5.0</span>
                </div>
              </div>
            </div>

            {/* Bio & Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* Left Column (Bio & Courses) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
                    About the Instructor
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {trainer.bio}
                  </p>
                </div>

                {/* Core Technologies */}
                <div className="space-y-2">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
                    Technical Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {trainer.expertise.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned Courses */}
                <div className="space-y-3">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
                    Courses Taught by {trainer.name}
                  </h2>
                  <div className="space-y-3">
                    {assignedCourses.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.image}
                            alt={c.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {c.name}
                            </h3>
                            <p className="text-xs text-slate-500">{c.duration} • 100% Free</p>
                          </div>
                        </div>
                        <Link href={`/courses/${c.slug}`}>
                          <Button
                            size="sm"
                            className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-full px-4 cursor-pointer"
                          >
                            View Course →
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Credentials Card) */}
              <div className="space-y-4">
                <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Faculty Credentials
                  </h3>

                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="h-4 w-4 text-[#0284c7] shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">Education</span>
                        <span className="font-bold">{trainer.education}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Award className="h-4 w-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">Industry Experience</span>
                        <span className="font-bold">{trainer.experience}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Users className="h-4 w-4 text-[#0284c7] shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">Students Mentored</span>
                        <span className="font-bold">{trainer.totalStudents}+ Graduates</span>
                      </div>
                    </div>
                  </div>

                  {trainer.certifications && trainer.certifications.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Certifications
                      </span>
                      <div className="space-y-1 text-xs">
                        {trainer.certifications.map((cert, i) => (
                          <p key={i} className="flex items-center gap-1.5 font-medium">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>{cert}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link href="/admissions">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs h-10 shadow-sm cursor-pointer">
                        Apply to Join Classes
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
