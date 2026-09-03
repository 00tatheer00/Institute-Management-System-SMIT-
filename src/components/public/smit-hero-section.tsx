"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ExternalLink } from "lucide-react";

export function SmitHeroSection() {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-[#fcfdfd] dark:bg-slate-950 pt-10 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-100 dark:border-slate-850">
        {/* ─── Doodles Background Layer ─── */}

        {/* 1. Top-Left: Laptop Doodle with Mouse */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-0.5, 1, -0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-6 left-6 sm:top-10 sm:left-14 lg:left-24 pointer-events-none select-none z-0"
        >
          <svg
            width="110"
            height="85"
            viewBox="0 0 120 95"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-12 sm:w-24 sm:h-18 lg:w-28 lg:h-22"
          >
            {/* Screen */}
            <path
              d="M 25 15 L 75 10 L 70 55 L 20 60 Z"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinejoin="round"
              fill="rgba(34, 197, 94, 0.05)"
            />
            <path
              d="M 30 20 L 70 16 L 66 50 L 26 54 Z"
              stroke="#22c55e"
              strokeWidth="1.8"
              strokeDasharray="3 3"
            />
            {/* Keyboard Base */}
            <path
              d="M 20 60 L 70 55 L 90 75 L 35 80 Z"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinejoin="round"
              fill="rgba(34, 197, 94, 0.08)"
            />
            {/* Keyboard keys lines */}
            <line x1="33" y1="64" x2="73" y2="60" stroke="#22c55e" strokeWidth="1.8" strokeDasharray="3 3" />
            <line x1="37" y1="70" x2="80" y2="66" stroke="#22c55e" strokeWidth="1.8" strokeDasharray="3 3" />
            {/* Mouse with cable */}
            <path
              d="M 70 55 C 85 52 95 62 90 70 C 88 74 95 78 100 76"
              stroke="#22c55e"
              strokeWidth="2"
              fill="none"
            />
            <ellipse cx="102" cy="76" rx="6" ry="9" stroke="#22c55e" strokeWidth="2.5" fill="rgba(34, 197, 94, 0.1)" />
            <line x1="102" y1="70" x2="102" y2="76" stroke="#22c55e" strokeWidth="2" />
          </svg>
        </motion.div>

        {/* 2. Top-Right: Paper Airplane with Curved Dotted Trail */}
        <motion.div
          animate={{ y: [0, 6, 0], x: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute top-8 right-6 sm:top-12 sm:right-16 lg:right-28 pointer-events-none select-none z-0"
        >
          <div className="relative">
            <svg
              width="140"
              height="70"
              viewBox="0 0 160 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-12 sm:w-36 sm:h-18 lg:w-44 lg:h-22"
            >
              {/* Curved Dotted Flight Trail */}
              <path
                d="M 10 75 C 60 70 110 50 140 15"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
              />
            </svg>
            {/* Paper Airplane */}
            <div className="absolute top-0 right-1 sm:right-3 transform -rotate-12">
              <svg width="40" height="32" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 2 18 L 40 4 L 28 32 L 20 22 L 2 18 Z"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  fill="rgba(2, 132, 199, 0.08)"
                />
                <path d="M 40 4 L 20 22" stroke="#0284c7" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* 3. Bottom-Left: Ascending Paper Airplane with Curved Dotted Trail */}
        <motion.div
          animate={{ y: [0, -6, 0], x: [0, -4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-28 left-4 sm:bottom-36 sm:left-14 lg:left-24 pointer-events-none select-none z-0 hidden sm:block"
        >
          <div className="relative">
            <svg
              width="130"
              height="90"
              viewBox="0 0 150 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-16 sm:w-32 sm:h-22"
            >
              <path
                d="M 10 90 C 20 40 60 20 120 25"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
              />
            </svg>
            <div className="absolute top-3 right-0 transform rotate-12">
              <svg width="36" height="28" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 2 18 L 40 4 L 28 32 L 20 22 L 2 18 Z"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  fill="rgba(22, 163, 74, 0.08)"
                />
                <path d="M 40 4 L 20 22" stroke="#16a34a" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* 4. Bottom-Right: Stylized Globe on Desk Stand */}
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 right-6 sm:bottom-32 sm:right-16 lg:right-28 pointer-events-none select-none z-0 hidden sm:block"
        >
          <svg
            width="90"
            height="110"
            viewBox="0 0 100 125"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-20 sm:w-22 sm:h-28"
          >
            {/* Stand Arc */}
            <path
              d="M 50 10 C 80 10 92 35 92 60 C 92 85 75 105 50 105"
              stroke="#22c55e"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Base Stem */}
            <path d="M 50 105 L 50 118" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
            <path d="M 32 118 L 68 118" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
            {/* Sphere */}
            <circle cx="48" cy="58" r="36" stroke="#22c55e" strokeWidth="3" fill="rgba(34, 197, 94, 0.05)" />
            {/* Lat/Long Grid */}
            <ellipse cx="48" cy="58" rx="20" ry="36" stroke="#22c55e" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="12" y1="58" x2="84" y2="58" stroke="#22c55e" strokeWidth="2" />
            {/* Continent Doodles */}
            <path
              d="M 36 38 C 42 34 50 36 54 42 C 58 48 54 54 48 56 C 42 54 38 48 36 38 Z"
              stroke="#22c55e"
              strokeWidth="2"
              fill="rgba(34, 197, 94, 0.12)"
            />
            <path
              d="M 58 64 C 64 66 68 74 62 78 C 56 78 54 70 58 64 Z"
              stroke="#22c55e"
              strokeWidth="2"
              fill="rgba(34, 197, 94, 0.12)"
            />
          </svg>
        </motion.div>

        {/* ─── Hero Center Container ─── */}
        <div className="container-custom relative z-10 max-w-5xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Main Headline */}
          <div className="space-y-1 sm:space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]"
            >
              Building Pakistan&apos;s
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight text-[#0284c7] leading-[1.08]"
            >
              Tech Future
            </motion.h2>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed"
          >
            Changing Lives. Building Careers. Shaping the Future.
          </motion.p>

          {/* Saylani Official Logo Emblem in Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex justify-center items-center py-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              {/* Saylani Green Logo Mark */}
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm tracking-tighter">
                  سیلانی
                </span>
                <span className="text-[#0284c7] font-black text-xs uppercase tracking-tight">
                  Saylani
                </span>
                <span className="text-slate-400 dark:text-slate-600">|</span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                  Welfare Trust
                </span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-3 pt-1"
          >
            <Link href="/admissions">
              <button className="bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3 rounded-full shadow-md shadow-[#0284c7]/25 hover:shadow-lg hover:shadow-[#0284c7]/35 transition-all duration-200">
                ENROLL NOW
              </button>
            </Link>
            <Link href="/courses">
              <button className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3 rounded-full shadow-2xs hover:shadow-xs transition-all duration-200">
                EXPLORE COURSES
              </button>
            </Link>
          </motion.div>

          {/* ─── Trio Student Showcase Cards ─── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-8 sm:pt-10 max-w-4xl mx-auto items-center"
          >
            {/* Left Card: Male Graduate in Suit on Soft Sky-Blue Container */}
            <div className="md:col-span-4 group relative overflow-hidden rounded-[32px] bg-[#bfdbfe]/60 dark:bg-sky-950/40 p-4 border border-sky-200/80 dark:border-sky-800/60 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative h-64 sm:h-72 w-full rounded-[24px] overflow-hidden bg-[#bfdbfe]/80 dark:bg-sky-900/50 flex items-end justify-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt="SMIT Male Student"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs font-bold">Muhammad Saad</p>
                  <p className="text-[10px] text-sky-200">Full Stack Engineer</p>
                </div>
              </div>
            </div>

            {/* Center Card: Saylani Mega IT Entrance Exam Video Card */}
            <div
              onClick={() => setIsPlayingVideo(true)}
              className="md:col-span-4 group relative cursor-pointer overflow-hidden rounded-[28px] bg-black border-2 border-slate-900 dark:border-slate-700 shadow-2xl hover:shadow-[#0284c7]/20 hover:-translate-y-2 transition-all duration-300 transform md:-translate-y-2"
            >
              <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                {/* Background Image of Saylani Entrance Exam */}
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80"
                  alt="Saylani Mega IT Entrance Exam"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60" />

                {/* Top Video Banner */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-left">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">
                      S
                    </div>
                    <div className="leading-tight">
                      <p className="text-[11px] font-bold truncate max-w-[170px]">
                        Saylani IT Program — Banayein Apna...
                      </p>
                      <p className="text-[9px] text-white/70">Saylani Welfare Trust</p>
                    </div>
                  </div>
                </div>

                {/* Red Circular Play Button in Exact Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 rounded-full bg-red-600/40 animate-ping" />
                    <div className="h-16 w-16 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-2xl group-hover:scale-115 group-hover:bg-red-600 transition-transform duration-300">
                      <Play className="h-7 w-7 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Stage Banner: SAYLANI MEGA IT ENTRANCE EXAM */}
                <div className="absolute bottom-3 left-3 right-3 text-white text-center space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                    SAYLANI
                  </p>
                  <p className="text-xs font-extrabold tracking-wide uppercase">
                    MEGA IT ENTRANCE EXAM
                  </p>
                  <p className="text-[10px] text-white/60 flex items-center justify-center gap-1">
                    <span>Watch on</span>
                    <span className="font-bold text-white">YouTube</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card: Female Graduate in Hijab on Pastel Cream Container */}
            <div className="md:col-span-4 group relative overflow-hidden rounded-[32px] bg-[#fef3c7]/60 dark:bg-amber-950/40 p-4 border border-amber-200/80 dark:border-amber-800/60 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative h-64 sm:h-72 w-full rounded-[24px] overflow-hidden bg-[#fef3c7]/80 dark:bg-amber-900/50 flex items-end justify-center">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                  alt="SMIT Female Student"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs font-bold">Ayesha Tariq</p>
                  <p className="text-[10px] text-amber-200">AI Data Scientist</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Player Modal */}
      <AnimatePresence>
        {isPlayingVideo && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPlayingVideo(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between p-3 bg-slate-900 text-white">
                <p className="text-xs font-bold">Saylani Mass IT Training (SMIT) Documentary</p>
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Saylani Mega IT Entrance Exam"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
