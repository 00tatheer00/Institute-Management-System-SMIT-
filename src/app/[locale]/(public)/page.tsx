import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config/site";
import { SmitHero } from "@/components/public/smit-hero";
import { SmitCourseTabs } from "@/components/public/smit-course-tabs";
import { SmitVideoTestimonials } from "@/components/public/smit-video-testimonials";
import { PakistanCampusMap } from "@/components/public/pakistan-campus-map";
import { AlumniMosaic } from "@/components/public/alumni-mosaic";
import { AnimatedCounter } from "@/components/public/animated-counter";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import {
  GraduationCap, Users, BookOpen, Layers, ArrowRight,
  CheckCircle2, Star, Award, Briefcase, Monitor, Code,
  Globe, Sparkles, TrendingUp, ShieldCheck, HeartHandshake,
  Lightbulb, Network, Building2, ChevronRight, DollarSign
} from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  return {
    title: "SMIT — Building Pakistan's Tech Future | Saylani Mass IT Training",
    description: "Changing Lives, Building Careers, Shaping the Future. 100% Free IT training and institutional technology education across Pakistan.",
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* ═════════════════════════════════════════════════════════
          1. HERO SECTION (Building Pakistan's Tech Future)
          ═════════════════════════════════════════════════════════ */}
      <SmitHero />

      {/* ═════════════════════════════════════════════════════════
          2. IMPACT STATS BAR (Blue to Green Continuous Gradient)
          ═════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#0284c7] via-[#059669] to-[#16a34a] text-white py-8 sm:py-10 shadow-lg relative z-20">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="pt-3 md:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                <AnimatedCounter end={200000} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm text-white/90 font-semibold mt-1 uppercase tracking-wider">
                Students Enrolled
              </p>
            </div>

            <div className="pt-3 md:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                <AnimatedCounter end={400} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm text-white/90 font-semibold mt-1 uppercase tracking-wider">
                Certified Trainers
              </p>
            </div>

            <div className="pt-3 md:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                <AnimatedCounter end={70} suffix="%" />
              </p>
              <p className="text-xs sm:text-sm text-white/90 font-semibold mt-1 uppercase tracking-wider">
                Employment Success
              </p>
            </div>

            <div className="pt-3 md:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                <AnimatedCounter end={150} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm text-white/90 font-semibold mt-1 uppercase tracking-wider">
                Nationwide Campuses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          3. WHY CHOOSE SMIT (World-Class IT Training & Success)
          ═════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-50/70 dark:bg-slate-900/30">
        <div className="container-custom max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge className="bg-[#0284c7]/15 text-[#0284c7] border-[#0284c7]/30 text-xs px-3.5 py-1 font-bold uppercase tracking-wider">
              WHY CHOOSE SMIT
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Empowering You with World-Class<br />
              <span className="text-[#0284c7]">IT Training &amp; Proven Success</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Designed by industry veterans to take students from basics to job-ready software professionals.
            </p>
          </div>

          {/* Symmetrical Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Market-Aligned Syllabus",
                desc: "Curriculum regularly updated with technologies demanded by global tech firms.",
                icon: <BookOpen className="h-6 w-6" />,
                gradient: "from-sky-500 to-blue-600",
              },
              {
                title: "100% Free Tuition Fee",
                desc: "Saylani Trust covers 100% of educational fees, making IT education accessible to all.",
                icon: <Award className="h-6 w-6" />,
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                title: "Hands-on Live Labs",
                desc: "Learn by building production-level web apps, mobile apps, and machine learning models.",
                icon: <Monitor className="h-6 w-6" />,
                gradient: "from-violet-500 to-purple-600",
              },
              {
                title: "Industry Expert Mentors",
                desc: "Instructors with years of software engineering experience in multinational firms.",
                icon: <Users className="h-6 w-6" />,
                gradient: "from-amber-500 to-orange-600",
              },
              {
                title: "Recognized Certifications",
                desc: "Verifiable credentials that boost your CV and LinkedIn credibility with recruiters.",
                icon: <ShieldCheck className="h-6 w-6" />,
                gradient: "from-rose-500 to-pink-600",
              },
              {
                title: "Nationwide Campus Network",
                desc: "Over 150 campuses, high-tech computer laboratories, and uninterrupted power grids.",
                icon: <Building2 className="h-6 w-6" />,
                gradient: "from-teal-500 to-cyan-600",
              },
            ].map((feat) => (
              <Card
                key={feat.title}
                className="group border-slate-200/80 dark:border-slate-800 shadow-float hover:shadow-lifted hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden bg-white dark:bg-slate-900"
              >
                <CardContent className="p-6 flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    {feat.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#0284c7] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          4. BROWSE OUR TOP COURSES (Tabbed Categories)
          ═════════════════════════════════════════════════════════ */}
      <SmitCourseTabs />

      {/* ═════════════════════════════════════════════════════════
          5. WHAT OUR STUDENTS SAY ABOUT US (Video Carousel)
          ═════════════════════════════════════════════════════════ */}
      <SmitVideoTestimonials />

      {/* ═════════════════════════════════════════════════════════
          6. FIND SAYLANI CAMPUSES NEAR YOU (Interactive Map)
          ═════════════════════════════════════════════════════════ */}
      <PakistanCampusMap />

      {/* ═════════════════════════════════════════════════════════
          7. ALUMNI SUCCESS STORIES (Mosaic Banner)
          ═════════════════════════════════════════════════════════ */}
      <AlumniMosaic />

      {/* ═════════════════════════════════════════════════════════
          8. SMIT VISION (10 Million+ IT Experts / $100 Billion)
          ═════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom max-w-5xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <Badge className="bg-[#0284c7]/15 text-[#0284c7] border-[#0284c7]/30 text-xs px-3.5 py-1 font-bold uppercase tracking-wider">
              OUR VISION
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SMIT <span className="text-[#0284c7]">Vision</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Targeting <strong className="text-slate-800 dark:text-slate-200">10 Million IT Experts</strong> and generating <strong className="text-slate-800 dark:text-slate-200">$100 Billion</strong> in digital economy for Pakistan.
            </p>
          </div>

          {/* Two Big Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: 10 Million */}
            <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-float hover:shadow-lifted transition-all p-6 sm:p-8 bg-white dark:bg-slate-900">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-sky-500/10 text-[#0284c7] flex items-center justify-center">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    10 Million+
                  </h3>
                  <p className="text-xs font-bold text-[#0284c7] uppercase tracking-wider mt-0.5">
                    IT Experts Pipeline
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Equipping Pakistani youth from every province with cutting-edge skills in Web, Mobile, AI, Cloud, and Cyber Security to serve global markets.
                </p>
              </div>
            </Card>

            {/* Card 2: $100 Billion */}
            <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-float hover:shadow-lifted transition-all p-6 sm:p-8 bg-white dark:bg-slate-900">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    $100 Billion
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                    Digital Economy Target
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Transforming Pakistan into an international IT superpower through freelance remittance, enterprise software exports, and high-value remote careers.
                </p>
              </div>
            </Card>
          </div>

          {/* ═════════════════════════════════════════════════════════
              9. BE A PART OF THIS VISION (Contained Gradient CTA)
              ═════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl bg-gradient-to-r from-[#0284c7] via-[#059669] to-[#16a34a] p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Be a Part of This Vision
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Join thousands of students learning world-class IT skills today. 100% free tuition, world-class computer labs, and verified certificates.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link href="/admissions">
                <Button
                  size="lg"
                  className="bg-white text-[#0284c7] hover:bg-white/95 font-bold px-8 rounded-full text-sm h-11 shadow-lg hover:scale-105 transition-all"
                >
                  Start Free Admission Test <ArrowRight className="ms-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/15 font-semibold px-8 rounded-full text-sm h-11 backdrop-blur-md"
                >
                  Learn About SMIT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
