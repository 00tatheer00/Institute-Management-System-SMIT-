"use client";

import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Award,
  Building2,
  Users,
  Target,
  Heart,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe,
  Sparkles,
} from "lucide-react";

const milestones = [
  { year: "2013", title: "Foundation of SMIT", desc: "Hazrat Maulana Bashir Farooq Qadri inaugurated the first 50-student tech batch in Bahadurabad, Karachi." },
  { year: "2016", title: "Full-Stack Web Expansion", desc: "Launched dedicated MERN Stack and mobile app engineering programs with Silicon Valley curricula." },
  { year: "2019", title: "AI & Data Science Labs", desc: "Equipped high-tech AI research labs and established remote freelancing incubators." },
  { year: "2022", title: "Nationwide Campus Rollout", desc: "Expanded to 150+ centers across Lahore, Islamabad, Faisalabad, Multan, Peshawar, and Quetta." },
  { year: "2024", title: "150,000+ Graduates Milestone", desc: "Celebrated over 150,000 alumni employed in multinational tech firms and freelance marketplaces." },
  { year: "2026", title: "Batch 2026 & Digital Economy Target", desc: "Enrolling 50,000+ students towards Pakistan's $100 Billion tech export vision." },
];

const leaders = [
  {
    name: "Hazrat Maulana Bashir Farooq Qadri",
    role: "Founder & Chief Patron",
    org: "Saylani Welfare International Trust",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quote: "Our mission is simple: ensure no deserving youth in Pakistan is deprived of world-class IT education due to financial constraints.",
  },
  {
    name: "Muhammad Zia Khan",
    role: "Chief Technology Advisor",
    org: "Panaverse & SMIT Academic Lead",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    quote: "We teach modern production engineering — cloud native, AI agents, full-stack TypeScript — so our students compete globally on day one.",
  },
  {
    name: "Muhammad Ghous",
    role: "Head of Training & Faculty",
    org: "SMIT Engineering Directorate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    quote: "Hands-on projects and live code reviews ensure our graduates build portfolios that impress top tech recruiters.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-10 sm:py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="container-custom max-w-6xl mx-auto px-4 space-y-16">
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Heart className="h-4 w-4 text-emerald-600" />
            Saylani Welfare International Trust Initiative
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Changing Lives. Building Careers. Shaping Pakistan&apos;s Tech Future.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Saylani Mass IT Training (SMIT) is Pakistan&apos;s largest non-profit digital empowerment program, providing 100% tuition-free, market-aligned technology education to over 200,000 youth nationwide.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-sky-200 dark:border-sky-900/60 bg-gradient-to-br from-sky-50/60 via-white to-sky-50/30 dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0284c7] text-white shadow-md mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To democratize access to cutting-edge technical education by eliminating all financial barriers. We equip passionate Pakistani students from every background with modern coding, artificial intelligence, cloud, and creative skills required to earn sustainable, respectable livelihoods.
            </p>
          </Card>

          <Card className="border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/30 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Our 2030 Vision</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To build a global pipeline of 10 Million certified IT professionals, transforming Pakistan into a premier global technology superpower capable of generating $100 Billion in foreign remittances and software exports annually.
            </p>
          </Card>
        </div>

        {/* Four Core Pillars */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <Badge variant="outline" className="text-xs font-bold uppercase">The SMIT Standard</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Why SMIT is Different</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: "100% Free Tuition", desc: "Funded by Saylani Welfare. Zero admission fee, zero hidden charges." },
              { icon: Users, title: "Industry Mentors", desc: "Taught by active senior engineers from top tech multinationals." },
              { icon: Building2, title: "150+ Nationwide Labs", desc: "Equipped with high-speed internet, power backup, and modern machines." },
              { icon: Award, title: "70% Job Placement", desc: "Direct campus recruitment by 500+ partnered software houses." },
            ].map((pillar, idx) => (
              <Card key={idx} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-[#0284c7]">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Milestones Timeline */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <Badge variant="outline" className="text-xs font-bold uppercase">Our Journey</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">A Decade of Empowering Youth</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2"
              >
                <span className="text-2xl font-black text-[#0284c7] dark:text-sky-400 font-mono">
                  {m.year}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{m.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Cards */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <Badge variant="outline" className="text-xs font-bold uppercase">Leadership</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Guided by Visionary Leaders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map((leader, idx) => (
              <Card key={idx} className="border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                        {leader.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#0284c7]">{leader.role}</p>
                      <p className="text-[10px] text-slate-400">{leader.org}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                    &quot;{leader.quote}&quot;
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Container */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#10b981] text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to Build Your Tech Career with SMIT?
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto">
            Admissions for Batch 2026 are currently open nationwide. Apply online today to secure your seat.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/admissions">
              <Button className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold rounded-full px-8 h-11 cursor-pointer shadow-md">
                Apply for Admission →
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-extrabold rounded-full px-8 h-11 cursor-pointer">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
