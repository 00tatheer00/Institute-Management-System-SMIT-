"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThreeHeroGlobe } from "@/components/public/three-hero-globe";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Sparkles, Terminal, Code2, Globe, Smartphone,
  Brain, Shield, Cloud, CheckCircle2, Flame, Star, Play,
  Laptop, Award
} from "lucide-react";

interface Track {
  id: string;
  name: string;
  badge: string;
  color: string;
  secondaryColor: string;
  icon: React.ReactNode;
  activeBatch: string;
  enrollingSeats: number;
  codeSnippet: string;
  language: string;
  description: string;
}

const tracks: Track[] = [
  {
    id: "web",
    name: "Full-Stack Web",
    badge: "Most Popular",
    color: "#06b6d4",
    secondaryColor: "#10b981",
    icon: <Globe className="h-4 w-4" />,
    activeBatch: "Batch WD-01 (Morning)",
    enrollingSeats: 12,
    language: "tsx",
    description: "React 19, Next.js, Node.js, TypeScript & PostgreSQL",
    codeSnippet: `// Welcome to SMIT Web Track
import { useState } from "react";

export default function Career() {
  const [skills, setSkills] = useState([
    "React", "Next.js", "TypeScript"
  ]);
  return <Student success={true} />;
}`,
  },
  {
    id: "ai",
    name: "AI & Data Science",
    badge: "High Demand",
    color: "#a855f7",
    secondaryColor: "#ec4899",
    icon: <Brain className="h-4 w-4" />,
    activeBatch: "Batch AI-02 (Weekend)",
    enrollingSeats: 8,
    language: "python",
    description: "Deep Learning, PyTorch, LLMs, NLP & Computer Vision",
    codeSnippet: `# SMIT AI Intelligence Lab
import tensorflow as tf

model = tf.keras.Sequential([
  tf.keras.layers.Dense(128, activation="relu"),
  tf.keras.layers.Dense(10, activation="softmax")
])
model.compile(optimizer="adam")`,
  },
  {
    id: "mobile",
    name: "Flutter Mobile",
    badge: "Cross Platform",
    color: "#3b82f6",
    secondaryColor: "#06b6d4",
    icon: <Smartphone className="h-4 w-4" />,
    activeBatch: "Batch AD-01 (Afternoon)",
    enrollingSeats: 15,
    language: "dart",
    description: "iOS & Android natively compiled apps with Dart & Firebase",
    codeSnippet: `// Flutter Mobile Development
import 'package:flutter/material.dart';

class StudentApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: LiveCode());
  }
}`,
  },
  {
    id: "cyber",
    name: "Cyber Security",
    badge: "Ethical Hacking",
    color: "#f59e0b",
    secondaryColor: "#ef4444",
    icon: <Shield className="h-4 w-4" />,
    activeBatch: "Batch CS-01 (Evening)",
    enrollingSeats: 5,
    language: "bash",
    description: "Penetration Testing, Network Defense, Kali Linux & SIEM",
    codeSnippet: `# Ethical Defense Lab
$ nmap -sV -sC -Pn target-lab.mhit
$ wireshark --interface eth0
$ metasploit -r audit-exploit.rc
[+] System Secured: 100% Protected`,
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    badge: "Infrastructure",
    color: "#0ea5e9",
    secondaryColor: "#6366f1",
    icon: <Cloud className="h-4 w-4" />,
    activeBatch: "Batch CLD-01 (Morning)",
    enrollingSeats: 9,
    language: "yaml",
    description: "AWS, Kubernetes, Docker, CI/CD & Terraform",
    codeSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: student-microservice
spec:
  replicas: 5
  template:
    spec: { containers: [mhit/core] }`,
  },
];

interface InteractiveHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaSecondaryText: string;
  tagline: string;
}

export function InteractiveHero({
  title,
  subtitle,
  ctaText,
  ctaSecondaryText,
  tagline,
}: InteractiveHeroProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track>(tracks[0]);
  const [isCelebrated, setIsCelebrated] = useState(false);

  // Trigger exciting student confetti burst
  const handleConfetti = () => {
    setIsCelebrated(true);
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: [selectedTrack.color, selectedTrack.secondaryColor, "#ffffff", "#f59e0b"],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    setTimeout(() => setIsCelebrated(false), 2000);
  };

  return (
    <section className="relative gradient-mesh text-white overflow-hidden min-h-[740px] flex items-center">
      {/* Decorative animated shapes */}
      <div className="hero-shape hero-shape-1" />
      <div className="hero-shape hero-shape-2" />
      <div className="hero-shape hero-shape-3" />

      {/* Dot grid & noise overlays */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      <div className="container-custom relative z-10 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* ─── Left Col: Copy & Track Selector ─── */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-black/10">
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                <span>{tagline}</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-300 font-medium">100% Free Tuition</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance leading-[1.08]"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* Interactive Student Career Track Pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-2.5 pt-1"
            >
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>Select Your Learning Path:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {tracks.map((track) => {
                  const isSelected = selectedTrack.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => setSelectedTrack(track)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 backdrop-blur-md border ${
                        isSelected
                          ? "bg-white text-slate-900 border-white shadow-glow scale-105"
                          : "bg-white/10 text-white/90 border-white/15 hover:bg-white/20 hover:border-white/30"
                      }`}
                    >
                      <span
                        className="p-1 rounded-md text-white"
                        style={{ backgroundColor: track.color }}
                      >
                        {track.icon}
                      </span>
                      <span>{track.name}</span>
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/95 font-bold px-7 shadow-depth hover:shadow-lifted transition-all duration-300 hover:-translate-y-0.5 text-sm h-11"
                >
                  {ctaText} <ArrowRight className="ms-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={handleConfetti}
                className="border-white/30 text-white hover:bg-white/15 font-semibold px-6 backdrop-blur-md text-sm h-11 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-amber-300 me-2" />
                {isCelebrated ? "🎉 Free Admission!" : "Claim Free Seat"}
              </Button>
            </motion.div>

            {/* Institutional Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/15 text-xs text-white/70"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Saylani Welfare Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Verified Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>100% Free Live Labs</span>
              </div>
            </motion.div>
          </div>

          {/* ─── Right Col: 3D Globe + Live Code Terminal ─── */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto max-w-lg lg:max-w-none"
            >
              {/* Interactive 3D Three.js Tech Canvas */}
              <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-slate-950/60 backdrop-blur-xl shadow-depth p-4 sm:p-6">
                {/* Header with track indicator */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500/80" />
                      <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <span className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-white/60 font-mono ms-2">
                      mhit-interactive-core.3d
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-semibold text-white/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>3D Interactive</span>
                  </div>
                </div>

                {/* The Real Three.js Canvas */}
                <div className="relative h-[240px] sm:h-[280px] w-full overflow-hidden flex items-center justify-center">
                  <ThreeHeroGlobe
                    themeColor={selectedTrack.color}
                    secondaryColor={selectedTrack.secondaryColor}
                    onNodeClick={handleConfetti}
                  />

                  {/* Drag to rotate hint badge */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] text-white/50 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                    🖱️ Drag to rotate 3D core • Click to celebrate
                  </div>
                </div>

                {/* Live Track Details & Code Snippet */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTrack.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: selectedTrack.color }}
                        />
                        <p className="text-xs font-bold text-white">
                          {selectedTrack.name} Curriculum
                        </p>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                        {selectedTrack.enrollingSeats} Seats Left
                      </span>
                    </div>

                    {/* Syntax Code block */}
                    <div className="font-mono text-[11px] text-white/80 bg-black/60 p-3 rounded-xl overflow-x-auto leading-relaxed border border-white/5">
                      <pre>
                        <code>{selectedTrack.codeSnippet}</code>
                      </pre>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/60 pt-1 border-t border-white/10">
                      <span className="truncate">{selectedTrack.activeBatch}</span>
                      <Link
                        href="/admissions"
                        className="text-white hover:underline font-semibold flex items-center gap-1 shrink-0"
                      >
                        Enroll Track <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating Student Achievement Badge 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/70 shadow-depth text-foreground"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">5,000+ Alumni</p>
                  <p className="text-[10px] text-muted-foreground">Certified in 2026</p>
                </div>
              </motion.div>

              {/* Floating Student Achievement Badge 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/70 shadow-depth text-foreground"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">0 Rs. Tuition</p>
                  <p className="text-[10px] text-muted-foreground">Free for Youth</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
