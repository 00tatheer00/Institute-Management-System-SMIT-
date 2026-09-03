"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { VideoModal } from "@/components/public/video-modal";
import { motion } from "framer-motion";
import {
  Play, ArrowRight, Sparkles, MessageCircle, Laptop,
  Send, Globe2, Compass, CheckCircle2
} from "lucide-react";

export function SmitHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-12 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
        {/* ─── Animated Doodle Vector Graphics ─── */}
        {/* 1. Laptop doodle top-left */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-1, 2, -1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 left-8 sm:top-14 sm:left-16 lg:left-28 opacity-85 pointer-events-none"
        >
          <svg width="84" height="64" viewBox="0 0 84 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500">
            <rect x="12" y="8" width="60" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
            <path d="M4 48H80C81.1 48 82 48.9 82 50V52C82 54.2 80.2 56 78 56H6C3.8 56 2 54.2 2 52V50C2 48.9 2.9 48 4 48Z" stroke="currentColor" strokeWidth="2.5" />
            <path d="M26 24L32 30L26 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 36H48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* 2. Paper airplane with dashed trail top-right */}
        <motion.div
          animate={{ y: [0, 8, 0], x: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-10 right-10 sm:top-16 sm:right-24 lg:right-36 opacity-85 pointer-events-none"
        >
          <div className="relative">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 45C35 15 70 10 100 25" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            <div className="absolute right-0 top-3 text-emerald-600 dark:text-emerald-400 rotate-12">
              <Send className="h-7 w-7" />
            </div>
          </div>
        </motion.div>

        {/* 3. Curved dotted trajectory bottom-left */}
        <div className="absolute bottom-28 left-6 sm:left-20 opacity-70 pointer-events-none hidden md:block">
          <svg width="140" height="90" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 80C30 30 70 15 120 40" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="125,40 115,35 118,45" fill="#0284c7" />
          </svg>
        </div>

        {/* 4. Globe doodle bottom-right */}
        <motion.div
          animate={{ rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-28 right-8 sm:right-20 lg:right-28 opacity-80 pointer-events-none hidden sm:block text-emerald-500"
        >
          <svg width="74" height="90" viewBox="0 0 74 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="37" cy="35" r="28" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 3" />
            <path d="M37 7V63M9 35H65" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M15 20C22 28 22 42 15 50" stroke="currentColor" strokeWidth="2" />
            <path d="M59 20C52 28 52 42 59 50" stroke="currentColor" strokeWidth="2" />
            <path d="M37 63V80M22 80H52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* ─── Hero Center Content ─── */}
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto space-y-6">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Building Pakistan&apos;s{" "}
              <span className="text-[#0284c7] inline-block relative">
                Tech Future
                <span className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-[#0284c7]/25 rounded-full" />
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto">
              Changing Lives, Building Careers, Shaping the Future
            </p>
          </motion.div>

          {/* Saylani Welfare Emblem Partner Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center items-center gap-2 pt-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Saylani Welfare International Trust</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">SMIT × MHIT</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-3.5 pt-2"
          >
            <Link href="/admissions">
              <Button
                size="lg"
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-[#0284c7]/25 hover:shadow-[#0284c7]/40 hover:-translate-y-0.5 transition-all duration-300 text-sm h-11"
              >
                Apply Now <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8 py-3 rounded-full text-sm h-11 transition-all duration-200"
              >
                Explore Courses
              </Button>
            </Link>
          </motion.div>

          {/* ─── Trio Student Cards Showcase ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 max-w-4xl mx-auto items-center"
          >
            {/* Left Card: Male Graduate Portrait */}
            <div className="group relative overflow-hidden rounded-3xl bg-[#e0f2fe] dark:bg-sky-950/40 p-4 border border-sky-200 dark:border-sky-800 shadow-float hover:shadow-lifted hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-sky-100 dark:bg-sky-900/50">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt="SMIT Male Graduate"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-left">
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-[#0284c7] px-2 py-0.5 rounded text-white shadow-xs">
                    Software Engineer
                  </span>
                  <p className="text-sm font-bold mt-1">Muhammad Saad</p>
                  <p className="text-[11px] text-white/80">Batch 11 • Remote Developer</p>
                </div>
              </div>
            </div>

            {/* Center Card: Featured Video Card with Play Button */}
            <div
              onClick={() => setIsVideoOpen(true)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-900 border-2 border-emerald-400/50 shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2 transition-all duration-300 transform md:-translate-y-3"
            >
              <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80"
                  alt="Saylani SMIT Documentary & Leadership"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

                {/* SAYLANI Top Banner Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
                    SAYLANI
                  </span>
                  <span className="bg-black/60 text-white backdrop-blur-md text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
                    Featured Story
                  </span>
                </div>

                {/* Red Circular Play Button with Pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 rounded-full bg-red-600/50 animate-ping" />
                    <div className="relative h-16 w-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-7 w-7 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Label */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    Hazrat Maulana Bashir Farooq Qadri
                  </p>
                  <h4 className="text-sm font-bold text-white mt-0.5 leading-tight">
                    The Vision Behind 10 Million Free IT Experts
                  </h4>
                </div>
              </div>
            </div>

            {/* Right Card: Female Graduate in Hijab Portrait */}
            <div className="group relative overflow-hidden rounded-3xl bg-[#fef3c7] dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800 shadow-float hover:shadow-lifted hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-amber-100 dark:bg-amber-900/40">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                  alt="SMIT Female Tech Graduate"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-left">
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-[#16a34a] px-2 py-0.5 rounded text-white shadow-xs">
                    AI Practitioner
                  </span>
                  <p className="text-sm font-bold mt-1">Ayesha Khan</p>
                  <p className="text-[11px] text-white/80">Batch 08 • Data Analyst</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Help/Action Chat Bubble on right */}
        <div className="fixed right-5 bottom-6 z-40 hidden sm:block">
          <Link href="/contact" aria-label="Support & Admissions Helpline">
            <div className="h-12 w-12 rounded-full bg-[#0284c7] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
              <MessageCircle className="h-6 w-6" />
            </div>
          </Link>
        </div>
      </section>

      {/* Video Modal popup */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title="Saylani Mass IT Training (SMIT) — Transforming Pakistan's Youth"
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
      />
    </>
  );
}
