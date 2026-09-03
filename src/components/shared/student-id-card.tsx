"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Printer,
  RotateCcw,
  ShieldCheck,
  User,
  Sparkles,
} from "lucide-react";

export interface StudentCardProps {
  fullName: string;
  fatherName: string;
  rollNumber: string;
  courseName: string;
  campusName: string;
  batchName?: string;
  photoUrl?: string;
  cnic?: string;
  bloodGroup?: string;
  validThrough?: string;
}

export function StudentIdCard({
  fullName = "Muhammad Hamza",
  fatherName = "Abdul Rasheed",
  rollNumber = "SMIT-2026-84920",
  courseName = "Full Stack Web Development",
  campusName = "Gulshan Campus (MHIT)",
  batchName = "Batch 2026",
  photoUrl,
  cnic = "42101-1234567-1",
  bloodGroup = "B+",
  validThrough = "12/2026",
}: StudentCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ─── Control Action Bar (Screen Only) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#0284c7] text-white font-extrabold text-xs px-2.5 py-1">
            Portrait Smart Card
          </Badge>
          <span className="text-xs font-semibold text-slate-500">
            Front: Details &amp; Photo • Back: Attendance QR
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFlipped(!isFlipped)}
            className="rounded-full text-xs font-bold gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isFlipped ? "Flip to Front (Photo & Info)" : "Flip to Back (Attendance QR)"}</span>
          </Button>

          <Button
            size="sm"
            onClick={handlePrint}
            className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-full text-xs px-4 gap-1.5 shadow-md shadow-[#0284c7]/20 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Student Card</span>
          </Button>
        </div>
      </div>

      {/* ─── INTERACTIVE 3D PORTRAIT CARD CONTAINER (Screen View) ─── */}
      <div className="flex justify-center print:hidden perspective-1000 py-2">
        <div
          className="relative w-[320px] sm:w-[340px] h-[520px] sm:h-[540px] transition-transform duration-700 transform-style-3d select-none"
          style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* ═══════════════════════════════════════════════
              FRONT SIDE: Sleek, Simple, Professional
              (Lanyard Slot, Photo, Name, Program, Details)
              ═══════════════════════════════════════════════ */}
          <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between backface-hidden">
            {/* Top Lanyard Slot & Brand Header */}
            <div>
              {/* Lanyard Hole Cutout Simulation */}
              <div className="pt-2.5 pb-1 flex justify-center">
                <div className="w-14 h-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-inner" />
              </div>

              {/* Institution Header Bar */}
              <div className="px-5 pt-2 pb-3 text-center border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284c7] via-[#0ea5e9] to-[#10b981] text-white shadow-sm">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black tracking-tight leading-none block">
                      SMIT
                    </span>
                    <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 leading-none">
                      Saylani Welfare Trust
                    </span>
                  </div>
                  <Badge variant="outline" className="ml-auto text-[8.5px] font-mono font-bold px-1.5 py-0 h-4 border-slate-300 dark:border-slate-700">
                    {batchName}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Middle: Candidate Photo & Core Typography */}
            <div className="px-5 py-2 flex flex-col items-center text-center space-y-3 flex-1 justify-center">
              {/* Candidate Photograph with Verified Hologram Border */}
              <div className="relative">
                <div className="h-32 w-28 rounded-2xl overflow-hidden border-2 border-[#0284c7] shadow-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <User className="h-10 w-10 text-slate-400 mb-1" />
                      <span className="text-[8px] uppercase font-bold text-slate-400">
                        Passport Photo
                      </span>
                    </div>
                  )}
                </div>

                {/* Verified Pill Badge */}
                <div className="absolute -bottom-2 inset-x-2 bg-emerald-600 text-white text-[8px] font-black text-center py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  Student • Verified
                </div>
              </div>

              {/* Candidate Name */}
              <div className="space-y-0.5 pt-1">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight line-clamp-1">
                  {fullName}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  S/O {fatherName}
                </p>
              </div>

              {/* Roll Number Pill */}
              <div className="px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-[#0284c7] dark:text-sky-300 font-mono font-extrabold text-xs">
                {rollNumber}
              </div>

              {/* Course Title */}
              <div className="px-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  Enrolled Program
                </span>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                  {courseName}
                </p>
              </div>
            </div>

            {/* Bottom Meta Information Grid */}
            <div className="px-5 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-slate-400 block text-[7.5px] uppercase font-bold">Campus</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate block">
                    {campusName.split("—")[0].trim()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[7.5px] uppercase font-bold">Blood Group</span>
                  <span className="font-extrabold text-red-500 block">
                    {bloodGroup}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[7.5px] uppercase font-bold">CNIC</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 truncate block">
                    {cnic}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[7.5px] uppercase font-bold">Valid Thru</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    {validThrough}
                  </span>
                </div>
              </div>

              {/* Micro Holographic Security Bar */}
              <div className="mt-2.5 h-1 w-full rounded-full bg-gradient-to-r from-amber-400 via-pink-400 to-[#0284c7] opacity-80" />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              BACK SIDE: Attendance QR Code, Rules & Barcode
              ═══════════════════════════════════════════════ */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            {/* Top Lanyard Slot & Title */}
            <div>
              {/* Lanyard Cutout */}
              <div className="pt-2.5 pb-1 flex justify-center">
                <div className="w-14 h-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-inner" />
              </div>

              <div className="px-5 pt-1.5 pb-2 text-center border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#0284c7]">
                  Digital Biometric Attendance Card
                </p>
                <p className="text-[8px] text-slate-400">
                  Scan at campus turnstiles &amp; lab readers
                </p>
              </div>
            </div>

            {/* Center: Large High-Contrast Attendance QR Code */}
            <div className="px-5 py-3 flex flex-col items-center justify-center space-y-2.5 flex-1">
              {/* QR Code Container */}
              <div className="p-3 rounded-2xl bg-white border-2 border-slate-900 shadow-md text-center">
                <svg width="130" height="130" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="72" height="72" fill="white" />
                  {/* Top-Left Finder */}
                  <rect x="4" y="4" width="22" height="22" fill="#0f172a" />
                  <rect x="7" y="7" width="16" height="16" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="#0f172a" />
                  {/* Top-Right Finder */}
                  <rect x="46" y="4" width="22" height="22" fill="#0f172a" />
                  <rect x="49" y="7" width="16" height="16" fill="white" />
                  <rect x="52" y="10" width="10" height="10" fill="#0f172a" />
                  {/* Bottom-Left Finder */}
                  <rect x="4" y="46" width="22" height="22" fill="#0f172a" />
                  <rect x="7" y="49" width="16" height="16" fill="white" />
                  <rect x="10" y="52" width="10" height="10" fill="#0f172a" />
                  {/* Data Points */}
                  <rect x="30" y="8" width="4" height="4" fill="#0f172a" />
                  <rect x="38" y="12" width="4" height="4" fill="#0f172a" />
                  <rect x="34" y="18" width="4" height="4" fill="#0f172a" />
                  <rect x="30" y="26" width="4" height="4" fill="#0f172a" />
                  <rect x="38" y="26" width="4" height="4" fill="#0f172a" />
                  <rect x="8" y="32" width="4" height="4" fill="#0f172a" />
                  <rect x="16" y="36" width="4" height="4" fill="#0f172a" />
                  <rect x="22" y="32" width="4" height="4" fill="#0f172a" />
                  {/* Saylani Center Marker */}
                  <rect x="30" y="34" width="6" height="6" fill="#10b981" />
                  <rect x="42" y="34" width="4" height="4" fill="#0f172a" />
                  <rect x="50" y="32" width="4" height="4" fill="#0f172a" />
                  <rect x="60" y="36" width="4" height="4" fill="#0f172a" />
                  <rect x="34" y="44" width="4" height="4" fill="#0f172a" />
                  <rect x="44" y="46" width="4" height="4" fill="#0f172a" />
                  <rect x="54" y="50" width="4" height="4" fill="#0f172a" />
                  <rect x="38" y="56" width="4" height="4" fill="#0f172a" />
                  <rect x="48" y="60" width="4" height="4" fill="#0f172a" />
                  <rect x="58" y="56" width="4" height="4" fill="#0f172a" />
                </svg>
                <div className="text-[7.5px] font-mono font-black uppercase tracking-tight text-slate-800 pt-1">
                  {rollNumber}
                </div>
              </div>

              <div className="text-center">
                <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 block tracking-wider">
                  Scan for Attendance
                </span>
                <p className="text-[8px] text-slate-500 max-w-[220px] mx-auto leading-tight">
                  Hold this QR code in front of gate scanner to log entry and exit.
                </p>
              </div>

              {/* Barcode Strip */}
              <div className="w-full max-w-[200px] pt-1">
                <div className="h-5 w-full bg-slate-900 dark:bg-white p-0.5 rounded flex items-center justify-around">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-900 h-full"
                      style={{ width: i % 3 === 0 ? "3px" : i % 2 === 0 ? "1px" : "2px" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Rules & Helpline */}
            <div className="px-5 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[8px] text-slate-500 leading-tight space-y-1 bg-slate-50/50 dark:bg-slate-900/30">
              <p>• Mandatory 75% attendance required for exam eligibility &amp; certificate.</p>
              <p>• This card is non-transferable and property of Saylani Welfare Trust.</p>
              <div className="flex items-center justify-between pt-1 text-slate-600 dark:text-slate-400 font-semibold border-t border-slate-200 dark:border-slate-800">
                <span>Helpline: <strong>(021) 111-729-526</strong></span>
                <span className="font-serif italic text-[9px] text-[#0284c7]">Bashir Farooq Qadri</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DEDICATED PORTRAIT PRINT CONTAINER (@media print) ─── */}
      {/* Exact standard physical portrait PVC dimensions (53.98mm width × 85.6mm height) */}
      <div className="hidden print:block">
        <div className="text-center pb-4">
          <h2 className="text-xs font-bold uppercase">Saylani Mass IT Training (SMIT) — Student Smart Card</h2>
          <p className="text-[8px] text-gray-500">Print on PVC Plastic Card Sheet or Photo Paper (Front &amp; Back)</p>
        </div>

        <div className="flex flex-row justify-center items-start gap-8">
          {/* PRINT: FRONT SIDE (PORTRAIT: 53.98mm × 85.6mm) */}
          <div className="w-[53.98mm] h-[85.6mm] rounded-lg border border-black bg-white text-black flex flex-col justify-between p-2 box-border shadow-none">
            {/* Header */}
            <div className="text-center border-b pb-1 border-black">
              <div className="flex items-center justify-center gap-1">
                <GraduationCap className="h-3 w-3 text-black" />
                <span className="text-[8px] font-black uppercase">SMIT • SAYLANI</span>
              </div>
              <span className="text-[6.5px] font-mono font-bold block">{batchName}</span>
            </div>

            {/* Photo & Details */}
            <div className="flex flex-col items-center text-center space-y-1 py-1">
              <div className="h-20 w-16 border border-black rounded overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                {photoUrl ? (
                  <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[7px] text-gray-500">PHOTO</span>
                )}
              </div>

              <div className="space-y-0.5 pt-0.5">
                <h4 className="text-[9px] font-black uppercase leading-tight">{fullName}</h4>
                <p className="text-[7px] leading-none">S/O {fatherName}</p>
                <p className="text-[7.5px] font-mono font-bold">{rollNumber}</p>
                <p className="text-[7px] font-bold uppercase text-gray-800 line-clamp-1">{courseName}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="border-t pt-1 border-black text-[6.5px] leading-tight grid grid-cols-2 gap-0.5">
              <span>CAMPUS: {campusName.split("—")[0]}</span>
              <span>BLOOD: {bloodGroup}</span>
              <span>CNIC: {cnic}</span>
              <span>VALID: {validThrough}</span>
            </div>
          </div>

          {/* PRINT: BACK SIDE (PORTRAIT: 53.98mm × 85.6mm) */}
          <div className="w-[53.98mm] h-[85.6mm] rounded-lg border border-black bg-white text-black flex flex-col justify-between p-2 box-border shadow-none text-center">
            <div className="border-b pb-0.5 border-black text-[7px] font-black uppercase">
              ATTENDANCE SMART CARD
            </div>

            {/* Attendance QR Code */}
            <div className="flex flex-col items-center justify-center space-y-1 py-1">
              <div className="p-1 border border-black rounded bg-white">
                <svg width="84" height="84" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="72" height="72" fill="white" />
                  <rect x="4" y="4" width="22" height="22" fill="black" />
                  <rect x="7" y="7" width="16" height="16" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="black" />
                  <rect x="46" y="4" width="22" height="22" fill="black" />
                  <rect x="49" y="7" width="16" height="16" fill="white" />
                  <rect x="52" y="10" width="10" height="10" fill="black" />
                  <rect x="4" y="46" width="22" height="22" fill="black" />
                  <rect x="7" y="49" width="16" height="16" fill="white" />
                  <rect x="10" y="52" width="10" height="10" fill="black" />
                  <rect x="30" y="8" width="4" height="4" fill="black" />
                  <rect x="38" y="12" width="4" height="4" fill="black" />
                  <rect x="34" y="18" width="4" height="4" fill="black" />
                  <rect x="30" y="26" width="4" height="4" fill="black" />
                  <rect x="38" y="26" width="4" height="4" fill="black" />
                  <rect x="8" y="32" width="4" height="4" fill="black" />
                  <rect x="16" y="36" width="4" height="4" fill="black" />
                  <rect x="22" y="32" width="4" height="4" fill="black" />
                  <rect x="30" y="34" width="6" height="6" fill="black" />
                  <rect x="42" y="34" width="4" height="4" fill="black" />
                  <rect x="50" y="32" width="4" height="4" fill="black" />
                  <rect x="60" y="36" width="4" height="4" fill="black" />
                  <rect x="34" y="44" width="4" height="4" fill="black" />
                  <rect x="44" y="46" width="4" height="4" fill="black" />
                  <rect x="54" y="50" width="4" height="4" fill="black" />
                  <rect x="38" y="56" width="4" height="4" fill="black" />
                  <rect x="48" y="60" width="4" height="4" fill="black" />
                  <rect x="58" y="56" width="4" height="4" fill="black" />
                </svg>
              </div>
              <span className="text-[6px] font-bold uppercase block tracking-wider">
                SCAN FOR ATTENDANCE
              </span>
              <span className="text-[6.5px] font-mono">{rollNumber}</span>
            </div>

            {/* Rules */}
            <div className="border-t pt-1 border-black text-[6px] text-left leading-tight space-y-0.5">
              <p>• Mandatory turnstile scan for attendance.</p>
              <p>• 75% attendance required for certificate.</p>
              <p>• Property of Saylani Welfare Trust.</p>
              <div className="flex justify-between items-end pt-0.5 text-[6px]">
                <span>UAN: (021) 111-729-526</span>
                <span>Sign: Bashir Farooq</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
