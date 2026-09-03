"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticleConstellation } from "@/components/public/particle-constellation";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Sparkles, Terminal, Code2, Globe, Smartphone,
  Brain, Shield, Cloud, CheckCircle2, Flame, Play,
  RotateCcw, Eye, Laptop, Check, Copy
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
  fileName: string;
  codeSnippet: string;
  outputSummary: string;
  previewTitle: string;
  previewDescription: string;
  metricLabel: string;
  metricValue: string;
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
    fileName: "App.tsx",
    codeSnippet: `import { useState } from "react";
import { TechStack } from "@smit/core";

export default function StudentApp() {
  const [enrolled, setEnrolled] = useState(true);
  return (
    <div className="p-4 bg-navy text-white">
      <h1>Welcome to MHIT × SMIT!</h1>
      <p>Status: Certified Full-Stack Dev</p>
    </div>
  );
}`,
    outputSummary: "✓ Compiled successfully in 320ms • 0 warnings",
    previewTitle: "React 19 Interactive Dashboard",
    previewDescription: "Full-stack SSR with Next.js, Node.js & PostgreSQL",
    metricLabel: "Hiring Rate",
    metricValue: "94.2%",
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
    fileName: "train_agent.py",
    codeSnippet: `import tensorflow as tf
from smit_ai import NeuralClassifier

# Train deep learning model
model = NeuralClassifier(layers=[128, 64, 10])
history = model.fit(train_data, epochs=25)

print(f"Accuracy: {history.accuracy:.2f}%")
print("Status: Model Ready for Deployment 🚀")`,
    outputSummary: "✓ Model training complete: 98.4% validation accuracy",
    previewTitle: "Neural Sentiment Classifier",
    previewDescription: "PyTorch & TensorFlow model with GPU acceleration",
    metricLabel: "Model Accuracy",
    metricValue: "98.4%",
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
    fileName: "main.dart",
    codeSnippet: `import 'package:flutter/material.dart';

void main() => runApp(const StudentMobileApp());

class StudentMobileApp extends StatelessWidget {
  const StudentMobileApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text("SMIT Flutter")),
        body: Center(child: Text("Live App Ready!")),
      ),
    );
  }
}`,
    outputSummary: "✓ Native build succeeded for iOS & Android targets",
    previewTitle: "iOS & Android Cross-App",
    previewDescription: "Dart 3 with state management & Firebase backend",
    metricLabel: "Store Rating",
    metricValue: "4.9 ★",
  },
  {
    id: "cyber",
    name: "Cyber Security",
    badge: "Ethical Defense",
    color: "#f59e0b",
    secondaryColor: "#ef4444",
    icon: <Shield className="h-4 w-4" />,
    activeBatch: "Batch CS-01 (Evening)",
    enrollingSeats: 5,
    fileName: "security_audit.sh",
    codeSnippet: `#!/bin/bash
# MHIT Ethical Security Vulnerability Scan
echo "[*] Initiating network intrusion audit..."
nmap -sV -sC -Pn 192.168.1.0/24
auditctl -w /etc/passwd -p wa -k auth_changes

echo "[+] Scan Complete: 0 Critical Vulnerabilities"
echo "[+] Status: Perimeter 100% Hardened"`,
    outputSummary: "✓ Security audit passed: Network defense hardened",
    previewTitle: "Penetration Defense Matrix",
    previewDescription: "Kali Linux, Wireshark, SIEM & Intrusion Prevention",
    metricLabel: "Threat Shield",
    metricValue: "100%",
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
    fileName: "docker-compose.yml",
    codeSnippet: `version: "3.8"
services:
  web-app:
    image: mhit/student-platform:latest
    ports:
      - "80:3000"
    deploy:
      replicas: 3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]`,
    outputSummary: "✓ Kubernetes cluster provisioned: 3 replicas running",
    previewTitle: "Cloud Cluster & Docker Orchestration",
    previewDescription: "AWS, Kubernetes, CI/CD Pipelines & Terraform",
    metricLabel: "Uptime SLA",
    metricValue: "99.99%",
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
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [isRunning, setIsRunning] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCelebrated, setIsCelebrated] = useState(false);

  // Trigger exciting student confetti burst
  const handleConfetti = () => {
    setIsCelebrated(true);
    const count = 180;
    const defaults = {
      origin: { y: 0.65 },
      colors: [selectedTrack.color, selectedTrack.secondaryColor, "#ffffff", "#f59e0b"],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 50 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });

    setTimeout(() => setIsCelebrated(false), 2000);
  };

  // Run Code simulation
  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasExecuted(true);
      setActiveTab("preview");
      handleConfetti();
    }, 700);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTrack.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="relative gradient-mesh text-white overflow-hidden min-h-[720px] flex items-center">
      {/* Interactive 2D Canvas Particle Constellation */}
      <ParticleConstellation
        color="rgba(6, 182, 212, "
        particleCount={50}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      />

      {/* Decorative animated shapes */}
      <div className="hero-shape hero-shape-1" />
      <div className="hero-shape hero-shape-2" />
      <div className="hero-shape hero-shape-3" />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

      <div className="container-custom relative z-10 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* ─── Left Col: Copy & Career Track Switcher ─── */}
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
                <span>Interactive Student Learning Tracks:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {tracks.map((track) => {
                  const isSelected = selectedTrack.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => {
                        setSelectedTrack(track);
                        setHasExecuted(false);
                        setActiveTab("code");
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 backdrop-blur-md border ${
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

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/15 text-xs text-white/70"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Saylani Tech Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Verified Certifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Hands-on Live Labs</span>
              </div>
            </motion.div>
          </div>

          {/* ─── Right Col: Interactive Student Code & Live Preview Studio ─── */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative mx-auto max-w-lg lg:max-w-none"
            >
              {/* Outer Glow Halo */}
              <div
                className="absolute -inset-2 rounded-3xl blur-2xl opacity-40 transition-colors duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${selectedTrack.color}, ${selectedTrack.secondaryColor})`,
                }}
              />

              {/* Main Studio Card */}
              <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-slate-950/80 backdrop-blur-xl shadow-depth">
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500/80" />
                      <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <span className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-white/60 font-mono ms-2">
                      {selectedTrack.fileName}
                    </span>
                  </div>

                  {/* Tabs: Code vs Live Preview */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setActiveTab("code")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "code"
                          ? "bg-white/20 text-white shadow-xs"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      <span>Code</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "preview"
                          ? "bg-brand text-white shadow-xs"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Live App</span>
                    </button>
                  </div>
                </div>

                {/* Studio Body */}
                <div className="p-4 sm:p-5 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    {activeTab === "code" ? (
                      <motion.div
                        key="code-tab"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {/* Code Box with Line Numbers */}
                        <div className="relative rounded-xl bg-black/60 border border-white/10 p-4 font-mono text-xs overflow-hidden">
                          <button
                            onClick={handleCopy}
                            aria-label="Copy code"
                            className="absolute top-3 right-3 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all text-[11px] flex items-center gap-1"
                          >
                            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            <span>{copied ? "Copied" : "Copy"}</span>
                          </button>

                          <div className="flex gap-4">
                            {/* Line Numbers */}
                            <div className="text-white/25 select-none font-mono text-end space-y-1">
                              {selectedTrack.codeSnippet.split("\n").map((_, idx) => (
                                <div key={idx}>{idx + 1}</div>
                              ))}
                            </div>

                            {/* Code Text */}
                            <pre className="text-white/90 overflow-x-auto leading-relaxed">
                              <code>{selectedTrack.codeSnippet}</code>
                            </pre>
                          </div>
                        </div>

                        {/* Interactive Run Code Bar */}
                        <div className="flex items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-2 text-xs text-white/70 font-mono">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: selectedTrack.color }}
                            />
                            <span>{selectedTrack.activeBatch}</span>
                          </div>

                          <Button
                            size="sm"
                            onClick={handleRunCode}
                            disabled={isRunning}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs h-8.5 px-4 gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95"
                          >
                            {isRunning ? (
                              <>
                                <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                <span>Compiling...</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 fill-white" />
                                <span>Run Code</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {/* Live Output Preview Card */}
                        <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-black/60 to-slate-900/80 p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-md"
                                style={{ backgroundColor: selectedTrack.color }}
                              >
                                {selectedTrack.icon}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white">
                                  {selectedTrack.previewTitle}
                                </h4>
                                <p className="text-[11px] text-white/60">
                                  {selectedTrack.previewDescription}
                                </p>
                              </div>
                            </div>

                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {selectedTrack.metricLabel}: {selectedTrack.metricValue}
                            </span>
                          </div>

                          {/* Output Terminal Console Log */}
                          <div className="rounded-xl bg-black/80 p-3.5 font-mono text-xs text-emerald-400 space-y-1 border border-emerald-500/20 shadow-inner">
                            <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
                              <Terminal className="h-3 w-3" />
                              <span>Execution Output Log:</span>
                            </div>
                            <p className="text-emerald-300 font-semibold">{selectedTrack.outputSummary}</p>
                            <p className="text-white/60 text-[11px]">
                              Status: Eligible for 100% Free SMIT Scholarship Enrollment
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                            <span className="text-amber-300 font-medium">
                              🔥 Only {selectedTrack.enrollingSeats} seats remaining
                            </span>
                            <Link href="/admissions">
                              <Button
                                size="sm"
                                variant="glow"
                                className="h-8 text-xs px-4 font-bold"
                              >
                                Secure Seat Now →
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Reset Code view button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => setActiveTab("code")}
                            className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Modify Code</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Floating Student Achievement Badge 1 */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-5 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/70 shadow-depth text-foreground"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
                  <Laptop className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Interactive Lab</p>
                  <p className="text-[10px] text-muted-foreground">Hands-on Coding</p>
                </div>
              </motion.div>

              {/* Floating Student Achievement Badge 2 */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/70 shadow-depth text-foreground"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0">
                  <Flame className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">0 Rs. Tuition</p>
                  <p className="text-[10px] text-muted-foreground">100% Free Seat</p>
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
