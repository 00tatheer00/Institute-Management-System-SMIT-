"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building2, Users, Monitor, ArrowRight, Sparkles } from "lucide-react";

interface Campus {
  id: string;
  name: string;
  city: string;
  address: string;
  studentsCount: string;
  labsCount: number;
  xPercent: number; // percentage coordinate on map SVG
  yPercent: number;
  isMain?: boolean;
}

const campuses: Campus[] = [
  {
    id: "karachi-mhit",
    name: "Mohsin & Huma IT Center (Main MHIT)",
    city: "Karachi",
    address: "Block 5, Gulshan-e-Iqbal, Karachi",
    studentsCount: "12,000+",
    labsCount: 16,
    xPercent: 37,
    yPercent: 82,
    isMain: true,
  },
  {
    id: "hyderabad",
    name: "Saylani SMIT Hyderabad Campus",
    city: "Hyderabad",
    address: "Auto Bhan Road, Latifabad, Hyderabad",
    studentsCount: "3,500+",
    labsCount: 6,
    xPercent: 43,
    yPercent: 77,
  },
  {
    id: "quetta",
    name: "Saylani SMIT Quetta Center",
    city: "Quetta",
    address: "Zarghoon Road, Quetta, Balochistan",
    studentsCount: "2,800+",
    labsCount: 5,
    xPercent: 30,
    yPercent: 55,
  },
  {
    id: "multan",
    name: "Saylani SMIT Multan Campus",
    city: "Multan",
    address: "Bosan Road, Gulgasht Colony, Multan",
    studentsCount: "4,200+",
    labsCount: 8,
    xPercent: 54,
    yPercent: 53,
  },
  {
    id: "faisalabad",
    name: "Saylani SMIT Faisalabad Hub",
    city: "Faisalabad",
    address: "Jaranwala Road, Peoples Colony, Faisalabad",
    studentsCount: "5,000+",
    labsCount: 9,
    xPercent: 61,
    yPercent: 43,
  },
  {
    id: "lahore",
    name: "Saylani SMIT Lahore Regional Center",
    city: "Lahore",
    address: "Ferozepur Road, Model Town, Lahore",
    studentsCount: "8,500+",
    labsCount: 12,
    xPercent: 69,
    yPercent: 41,
  },
  {
    id: "islamabad",
    name: "Saylani SMIT Federal Campus",
    city: "Islamabad / Rawalpindi",
    address: "Murree Road, Faizabad, Islamabad",
    studentsCount: "7,000+",
    labsCount: 10,
    xPercent: 63,
    yPercent: 27,
  },
  {
    id: "peshawar",
    name: "Saylani SMIT KP Hub",
    city: "Peshawar",
    address: "University Road, Peshawar, KPK",
    studentsCount: "3,800+",
    labsCount: 6,
    xPercent: 55,
    yPercent: 24,
  },
];

export function PakistanCampusMap() {
  const [activeCampus, setActiveCampus] = useState<Campus>(campuses[0]);

  return (
    <section className="section-padding bg-slate-50/70 dark:bg-slate-900/40 relative overflow-hidden">
      <div className="container-custom relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <Badge className="bg-[#0284c7]/15 text-[#0284c7] hover:bg-[#0284c7]/20 border-[#0284c7]/30 text-xs px-3.5 py-1 font-bold uppercase tracking-wider">
            OUR NATIONWIDE PRESENCE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Find Saylani Campuses Near You
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover Saylani &amp; MHIT educational centers, computer laboratories, and training facilities across Pakistan.
          </p>
        </div>

        {/* Interactive Map Layout */}
        <div className="relative mx-auto max-w-3xl aspect-[16/11] rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-float">
          {/* Pakistan Map SVG Outline */}
          <svg
            viewBox="0 0 800 650"
            className="w-full h-full stroke-emerald-500/60 dark:stroke-emerald-400/50 fill-emerald-50/30 dark:fill-emerald-950/20"
            style={{ filter: "drop-shadow(0 4px 12px rgba(16, 185, 129, 0.08))" }}
          >
            {/* Stylized Pakistan Geographic Contour */}
            <path
              d="M 450,110 
                 C 490,120 540,150 560,180 
                 C 590,220 580,260 550,290 
                 C 560,330 520,380 470,410 
                 C 430,440 400,480 370,540 
                 C 340,560 300,550 280,520 
                 C 250,510 200,490 190,460 
                 C 170,420 180,380 210,350 
                 C 220,310 260,280 280,240 
                 C 300,200 350,170 380,140 
                 Z"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            {/* Regional Connecting Route Lines */}
            <path
              d="M 320,530 Q 360,450 430,350 T 500,180"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          </svg>

          {/* Campus Pins */}
          {campuses.map((campus) => {
            const isSelected = activeCampus.id === campus.id;
            return (
              <div
                key={campus.id}
                style={{
                  left: `${campus.xPercent}%`,
                  top: `${campus.yPercent}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                onClick={() => setActiveCampus(campus)}
              >
                {/* Outer Ping */}
                <span
                  className={`absolute -inset-2 rounded-full opacity-60 transition-all ${
                    isSelected
                      ? "bg-[#0284c7] animate-ping"
                      : "bg-emerald-500 group-hover:bg-[#0284c7] opacity-0 group-hover:opacity-40"
                  }`}
                />

                {/* Inner Pin Icon */}
                <div
                  className={`relative flex items-center justify-center rounded-full p-2 text-white shadow-lg transition-all duration-300 ${
                    isSelected
                      ? "bg-[#0284c7] scale-125 ring-4 ring-[#0284c7]/25"
                      : "bg-emerald-600 group-hover:bg-[#0284c7] group-hover:scale-110"
                  }`}
                >
                  <MapPin className="h-4 w-4 fill-white" />
                </div>

                {/* City Label Pill */}
                <div
                  className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs transition-all pointer-events-none ${
                    isSelected
                      ? "bg-[#0284c7] text-white"
                      : "bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 group-hover:bg-slate-900 group-hover:text-white"
                  }`}
                >
                  {campus.city}
                </div>
              </div>
            );
          })}

          {/* Floating Campus Details Popover */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCampus.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-8 sm:w-80 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 border border-slate-200 dark:border-slate-800 shadow-xl z-30 space-y-2 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0284c7]/10 text-[#0284c7]">
                  {activeCampus.city} Center
                </span>
                {activeCampus.isMain && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                    ★ Main Campus
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {activeCampus.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                {activeCampus.address}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                  <Users className="h-3.5 w-3.5 text-[#0284c7]" />
                  <span>{activeCampus.studentsCount} Students</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                  <Monitor className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{activeCampus.labsCount} High-tech Labs</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="text-center mt-8">
          <Link href="/admissions">
            <Button
              size="lg"
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all text-sm h-11"
            >
              Find Nearest Campus <ArrowRight className="ms-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
