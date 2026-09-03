"use client";

import { Link } from "@/i18n/navigation";
import { ParticleConstellation } from "@/components/public/particle-constellation";
import { motion } from "framer-motion";
import { GraduationCap, Award, Building2, TrendingUp, Sparkles } from "lucide-react";

export function SmitHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fcfdfd] dark:bg-slate-950 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-36 border-b border-slate-100 dark:border-slate-800/80">
      {/* ─── 1. Prominent Cyber Grid Lines & Precision Dot Matrix ─── */}
      <div className="hero-faded-grid absolute inset-0 pointer-events-none opacity-90 dark:opacity-60" />
      <div className="hero-faded-dots absolute inset-0 pointer-events-none opacity-85 dark:opacity-45" />

      {/* ─── 2. Shimmer Effect in Grid Lines (Sweeping Luminous Light Wave) ─── */}
      <div className="hero-grid-shimmer absolute inset-0 pointer-events-none" />

      {/* ─── 3. Prominent 2D Constellation Net (Nodes & Connecting Laser Lines) ─── */}
      <ParticleConstellation
        color="rgba(2, 132, 199, "
        particleCount={70}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 dark:opacity-45"
      />

      {/* ─── 4. Shimmering Grid Junction Cross Markers (+) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <span className="absolute top-24 left-[18%] text-sky-400/60 dark:text-sky-400/40 text-sm font-mono animate-pulse">
          +
        </span>
        <span className="absolute top-40 right-[22%] text-emerald-400/60 dark:text-emerald-400/40 text-sm font-mono animate-pulse [animation-delay:1.2s]">
          +
        </span>
        <span className="absolute bottom-28 left-[28%] text-sky-400/60 dark:text-sky-400/40 text-sm font-mono animate-pulse [animation-delay:2s]">
          +
        </span>
        <span className="absolute bottom-36 right-[26%] text-emerald-400/60 dark:text-emerald-400/40 text-sm font-mono animate-pulse [animation-delay:0.8s]">
          +
        </span>
      </div>

      {/* ─── 5. Radiant Ambient Glowing Flares ─── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[400px] bg-gradient-to-r from-sky-400/18 via-emerald-400/15 to-teal-400/18 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-sky-400/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none" />

      {/* ─── 6. Animated Vector Doodles Layer ─── */}

      {/* Top-Left: Laptop Doodle with Mouse */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-0.5, 1.2, -0.5] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 left-6 sm:top-14 sm:left-14 lg:left-24 pointer-events-none select-none z-10"
      >
        <svg
          width="120"
          height="95"
          viewBox="0 0 120 95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-18 h-14 sm:w-26 sm:h-20 lg:w-32 lg:h-24 drop-shadow-md"
        >
          <path
            d="M 25 15 L 75 10 L 70 55 L 20 60 Z"
            stroke="#16a34a"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fill="rgba(22, 163, 74, 0.08)"
          />
          <path
            d="M 30 20 L 70 16 L 66 50 L 26 54 Z"
            stroke="#16a34a"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M 20 60 L 70 55 L 90 75 L 35 80 Z"
            stroke="#16a34a"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fill="rgba(22, 163, 74, 0.12)"
          />
          <line x1="33" y1="64" x2="73" y2="60" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="37" y1="70" x2="80" y2="66" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 3" />
          <path
            d="M 70 55 C 85 52 95 62 90 70 C 88 74 95 78 100 76"
            stroke="#16a34a"
            strokeWidth="2.2"
            fill="none"
          />
          <ellipse cx="102" cy="76" rx="6" ry="9" stroke="#16a34a" strokeWidth="2.8" fill="rgba(22, 163, 74, 0.16)" />
          <line x1="102" y1="70" x2="102" y2="76" stroke="#16a34a" strokeWidth="2.2" />
        </svg>
      </motion.div>

      {/* Top-Right: Paper Airplane with Curved Dotted Trail */}
      <motion.div
        animate={{ y: [0, 8, 0], x: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-10 right-6 sm:top-16 sm:right-16 lg:right-28 pointer-events-none select-none z-10"
      >
        <div className="relative">
          <svg
            width="160"
            height="80"
            viewBox="0 0 160 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-28 h-14 sm:w-40 sm:h-20 lg:w-48 lg:h-24"
          >
            <path
              d="M 10 75 C 60 70 110 50 140 15"
              stroke="#16a34a"
              strokeWidth="3"
              strokeDasharray="7 7"
              fill="none"
            />
          </svg>
          <div className="absolute top-0 right-1 sm:right-3 transform -rotate-12">
            <svg width="44" height="36" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 2 18 L 40 4 L 28 32 L 20 22 L 2 18 Z"
                stroke="#0284c7"
                strokeWidth="3"
                strokeLinejoin="round"
                fill="rgba(2, 132, 199, 0.12)"
              />
              <path d="M 40 4 L 20 22" stroke="#0284c7" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Bottom-Left: Ascending Paper Airplane with Upward Curved Dotted Trail */}
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 left-6 sm:bottom-14 sm:left-14 lg:left-24 pointer-events-none select-none z-10 hidden sm:block"
      >
        <div className="relative">
          <svg
            width="150"
            height="100"
            viewBox="0 0 150 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-28 h-18 sm:w-36 sm:h-24"
          >
            <path
              d="M 10 90 C 20 40 60 20 120 25"
              stroke="#16a34a"
              strokeWidth="3"
              strokeDasharray="7 7"
              fill="none"
            />
          </svg>
          <div className="absolute top-2 right-0 transform rotate-12">
            <svg width="40" height="32" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 2 18 L 40 4 L 28 32 L 20 22 L 2 18 Z"
                stroke="#16a34a"
                strokeWidth="3"
                strokeLinejoin="round"
                fill="rgba(22, 163, 74, 0.12)"
              />
              <path d="M 40 4 L 20 22" stroke="#16a34a" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Bottom-Right: Stylized Desk Globe */}
      <motion.div
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-6 sm:bottom-14 sm:right-16 lg:right-28 pointer-events-none select-none z-10 hidden sm:block"
      >
        <svg
          width="105"
          height="130"
          viewBox="0 0 100 125"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-24 sm:w-26 sm:h-32 drop-shadow-md"
        >
          <path
            d="M 50 10 C 80 10 92 35 92 60 C 92 85 75 105 50 105"
            stroke="#16a34a"
            strokeWidth="3.8"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 50 105 L 50 118" stroke="#16a34a" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 32 118 L 68 118" stroke="#16a34a" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="48" cy="58" r="36" stroke="#16a34a" strokeWidth="3.5" fill="rgba(22, 163, 74, 0.08)" />
          <ellipse cx="48" cy="58" rx="20" ry="36" stroke="#16a34a" strokeWidth="2.4" strokeDasharray="4 4" />
          <line x1="12" y1="58" x2="84" y2="58" stroke="#16a34a" strokeWidth="2.4" />
          <path
            d="M 36 38 C 42 34 50 36 54 42 C 58 48 54 54 48 56 C 42 54 38 48 36 38 Z"
            stroke="#16a34a"
            strokeWidth="2.4"
            fill="rgba(22, 163, 74, 0.18)"
          />
          <path
            d="M 58 64 C 64 66 68 74 62 78 C 56 78 54 70 58 64 Z"
            stroke="#16a34a"
            strokeWidth="2.4"
            fill="rgba(22, 163, 74, 0.18)"
          />
        </svg>
      </motion.div>

      {/* ─── 7. Perfectly Aligned Center Content Container ─── */}
      <div className="container-custom relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8">
        {/* Main Headline with Sweeping Shimmer Effect */}
        <div className="space-y-2 sm:space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.06]"
          >
            Building Pakistan&apos;s
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight leading-[1.06]"
          >
            <span className="shimmer-cyan inline-block relative">
              Tech Future
              <span className="absolute -bottom-2 left-0 right-0 h-2 bg-[#0284c7]/35 rounded-full blur-[2px]" />
            </span>
          </motion.h2>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto leading-relaxed"
        >
          Changing Lives. Building Careers. Shaping the Future.
        </motion.p>

        {/* Saylani Official Logo Emblem Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex justify-center items-center"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50/95 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 shadow-sm backdrop-blur-sm hover:scale-105 transition-transform duration-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-black text-base tracking-tighter">
                سیلانی
              </span>
              <span className="text-[#0284c7] font-black text-xs uppercase tracking-tight">
                Saylani
              </span>
              <span className="text-slate-400 dark:text-slate-600">|</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold text-xs">
                Welfare Trust
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons with Light-Sweep Shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-3.5 pt-2"
        >
          <Link href="/admissions">
            <button className="btn-shimmer bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-9 py-3.5 rounded-full shadow-lg shadow-[#0284c7]/30 hover:shadow-xl hover:shadow-[#0284c7]/40 hover:-translate-y-0.5 transition-all duration-200">
              ENROLL NOW
            </button>
          </Link>
          <Link href="/courses">
            <button className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-extrabold text-xs sm:text-sm uppercase tracking-wider px-9 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
              EXPLORE COURSES
            </button>
          </Link>
        </motion.div>

        {/* Trust Badges Row (Perfect Centered Alignment & Visual Balance) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-y-2 gap-x-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
            100% Free Tuition
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-[#0284c7]" />
            400+ Certified Trainers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-emerald-500" />
            150+ Nationwide Campuses
          </span>
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#0284c7]" />
            70% Employment Rate
          </span>
        </motion.div>
      </div>
    </section>
  );
}
