"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Printer,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  Heart,
  Download,
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
      {/* Action Bar (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500 text-white font-extrabold text-xs px-2.5 py-1">
            PVC Smart Card
          </Badge>
          <span className="text-xs font-semibold text-slate-500">
            Digital Biometric Attendance Enabled
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
            <span>{isFlipped ? "Flip to Front" : "Flip to Back"}</span>
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

      {/* ─── INTERACTIVE CARD CONTAINER (Screen View) ─── */}
      <div className="flex justify-center print:hidden perspective-1000">
        <div
          className="relative w-full max-w-[420px] aspect-[1.586/1] transition-transform duration-500 transform-style-3d select-none"
          style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* ════════ FRONT SIDE ════════ */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white flex flex-col justify-between backface-hidden">
            {/* Top Color Banner */}
            <div className="relative bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#10b981] px-4 py-2 flex items-center justify-between border-b border-white/20">
              {/* Holographic Security Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-300 opacity-90 animate-pulse" />

              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#0284c7] shadow-sm">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider leading-none text-white">
                    Saylani Welfare Trust
                  </h4>
                  <p className="text-[8px] font-extrabold text-emerald-100 uppercase tracking-tight">
                    Mass IT Training Program (SMIT)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-white border border-white/30">
                  {batchName}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="flex-1 p-3.5 flex items-center justify-between gap-3 relative">
              {/* Saylani Watermark Emblem */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                <GraduationCap className="w-48 h-48 text-white" />
              </div>

              {/* Student Photo with Hologram Badge */}
              <div className="flex flex-col items-center shrink-0 space-y-1 z-10">
                <div className="relative h-28 w-24 rounded-xl overflow-hidden border-2 border-emerald-400/80 bg-slate-800 shadow-md">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
                      <User className="h-10 w-10 text-slate-500" />
                      <span className="text-[8px] uppercase font-bold text-slate-500 mt-1">Photo</span>
                    </div>
                  )}
                  {/* Verified Hologram Badge */}
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[7px] font-extrabold text-center py-0.5 uppercase tracking-wider backdrop-blur-xs">
                    Verified
                  </div>
                </div>

                {/* EMV Smart Chip Simulation */}
                <div className="w-9 h-6 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-500/60 flex items-center justify-center shadow-xs">
                  <div className="w-7 h-4 border border-amber-600/40 rounded-xs grid grid-cols-2 gap-0.5 opacity-70">
                    <div className="border-r border-amber-600/40" />
                    <div />
                  </div>
                </div>
              </div>

              {/* Center Student Details */}
              <div className="flex-1 min-w-0 space-y-1 text-left z-10 pl-1">
                <div>
                  <span className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">Candidate Name</span>
                  <h3 className="text-sm font-black text-white leading-tight truncate uppercase">
                    {fullName}
                  </h3>
                </div>

                <div>
                  <span className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">Father&apos;s Name</span>
                  <p className="text-[11px] font-bold text-slate-200 leading-tight truncate">
                    {fatherName}
                  </p>
                </div>

                <div>
                  <span className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">Roll Number</span>
                  <p className="text-xs font-black font-mono text-sky-400 leading-tight">
                    {rollNumber}
                  </p>
                </div>

                <div>
                  <span className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">Program</span>
                  <p className="text-[10px] font-extrabold text-emerald-400 leading-tight truncate">
                    {courseName}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[8px] text-slate-400 pt-0.5">
                  <span>Campus: <strong className="text-white">{campusName.split("—")[0].trim()}</strong></span>
                  <span>Blood: <strong className="text-red-400">{bloodGroup}</strong></span>
                </div>
              </div>

              {/* Right Attendance QR Code */}
              <div className="flex flex-col items-center justify-center shrink-0 z-10 pl-1">
                <div className="p-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 shadow-sm text-center">
                  {/* High-Resolution SVG Attendance QR Code */}
                  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="72" height="72" fill="white" />
                    {/* Finder 1 (Top Left) */}
                    <rect x="4" y="4" width="22" height="22" fill="#0284c7" />
                    <rect x="7" y="7" width="16" height="16" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="#0284c7" />
                    {/* Finder 2 (Top Right) */}
                    <rect x="46" y="4" width="22" height="22" fill="#0284c7" />
                    <rect x="49" y="7" width="16" height="16" fill="white" />
                    <rect x="52" y="10" width="10" height="10" fill="#0284c7" />
                    {/* Finder 3 (Bottom Left) */}
                    <rect x="4" y="46" width="22" height="22" fill="#0284c7" />
                    <rect x="7" y="49" width="16" height="16" fill="white" />
                    <rect x="10" y="52" width="10" height="10" fill="#0284c7" />
                    {/* Data Matrix Dots */}
                    <rect x="30" y="8" width="4" height="4" fill="#0284c7" />
                    <rect x="38" y="12" width="4" height="4" fill="#0284c7" />
                    <rect x="34" y="18" width="4" height="4" fill="#0284c7" />
                    <rect x="30" y="26" width="4" height="4" fill="#0284c7" />
                    <rect x="38" y="26" width="4" height="4" fill="#0284c7" />
                    <rect x="8" y="32" width="4" height="4" fill="#0284c7" />
                    <rect x="16" y="36" width="4" height="4" fill="#0284c7" />
                    <rect x="22" y="32" width="4" height="4" fill="#0284c7" />
                    <rect x="30" y="34" width="6" height="6" fill="#10b981" />
                    <rect x="42" y="34" width="4" height="4" fill="#0284c7" />
                    <rect x="50" y="32" width="4" height="4" fill="#0284c7" />
                    <rect x="60" y="36" width="4" height="4" fill="#0284c7" />
                    <rect x="34" y="44" width="4" height="4" fill="#0284c7" />
                    <rect x="44" y="46" width="4" height="4" fill="#0284c7" />
                    <rect x="54" y="50" width="4" height="4" fill="#0284c7" />
                    <rect x="38" y="56" width="4" height="4" fill="#0284c7" />
                    <rect x="48" y="60" width="4" height="4" fill="#0284c7" />
                    <rect x="58" y="56" width="4" height="4" fill="#0284c7" />
                  </svg>
                  <p className="text-[6.5px] font-black uppercase tracking-tight text-[#0284c7] leading-none pt-1">
                    ATTENDANCE QR
                  </p>
                </div>
                <span className="text-[6px] text-slate-400 font-semibold tracking-tighter uppercase text-center mt-1">
                  Biometric Scan
                </span>
              </div>
            </div>

            {/* Bottom ID Strip */}
            <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-1 flex items-center justify-between text-[8px] text-slate-400 font-mono">
              <span>CNIC: {cnic}</span>
              <span className="text-emerald-400 font-bold">VALID THRU: {validThrough}</span>
            </div>
          </div>

          {/* ════════ BACK SIDE ════════ */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            {/* Top Bar */}
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[9px] font-bold text-slate-300">
              <span>CARD RULES & TERMS</span>
              <span className="text-emerald-400">SMIT OFFICIAL CREDENTIAL</span>
            </div>

            {/* Back Body */}
            <div className="p-4 space-y-2 text-[8px] text-slate-300 leading-relaxed">
              <ul className="list-decimal pl-3 space-y-1 text-slate-400">
                <li>This card is non-transferable and remains property of Saylani Welfare Trust.</li>
                <li>
                  <strong className="text-emerald-400">Mandatory Attendance:</strong> The QR code on the front must be scanned at campus biometric gates for attendance marking.
                </li>
                <li>Minimum 75% attendance is required for examination and official certificate.</li>
                <li>Loss of card must be reported immediately. Replacement fee applies.</li>
              </ul>

              {/* Barcode Graphic */}
              <div className="pt-1 text-center">
                <div className="h-6 w-full max-w-[200px] mx-auto bg-white p-1 rounded flex items-center justify-around">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{ width: i % 3 === 0 ? "3px" : i % 2 === 0 ? "1px" : "2px" }}
                    />
                  ))}
                </div>
                <p className="text-[7.5px] font-mono font-bold tracking-widest text-slate-400 mt-0.5">
                  *{rollNumber.replace(/-/g, "")}*
                </p>
              </div>

              {/* Signatures & Support Info */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-800 text-[8px]">
                <div>
                  <span className="text-slate-500 block">Emergency Helpline:</span>
                  <strong className="text-sky-400 font-mono">(021) 111-729-526</strong>
                </div>
                <div className="text-right">
                  <div className="font-serif italic text-emerald-400 text-[9px]">Bashir Farooq</div>
                  <span className="text-[7px] text-slate-400 block border-t border-slate-700 pt-0.5">
                    Authorized Signatory (Patron)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Address */}
            <div className="bg-slate-900/90 px-4 py-1 text-center text-[7.5px] text-slate-500">
              A-25, Bahadurabad Chowrangi, Karachi • www.saylaniwelfare.com
            </div>
          </div>
        </div>
      </div>

      {/* ─── DEDICATED HIGH-RESOLUTION PRINT CONTAINER ─── */}
      {/* This renders only when printing, positioned at standard physical card size (85.6mm × 54mm) */}
      <div className="hidden print:block space-y-6">
        <div className="text-center pb-2">
          <h2 className="text-sm font-bold uppercase">Saylani Mass IT Training (SMIT) — Official Student Card</h2>
          <p className="text-[10px] text-gray-500">Print on Photo Paper or PVC Plastic Card Sheet (Front &amp; Back)</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Print: Front Side */}
          <div className="w-[85.6mm] h-[53.98mm] rounded-lg overflow-hidden border border-black bg-white text-black flex flex-col justify-between p-2.5 box-border shadow-none">
            <div className="flex items-center justify-between border-b pb-1 border-black">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-black" />
                <span className="text-[9px] font-black uppercase">SMIT • SAYLANI WELFARE</span>
              </div>
              <span className="text-[8px] font-bold font-mono">{batchName}</span>
            </div>

            <div className="flex items-center justify-between gap-2 py-1">
              {/* Photo */}
              <div className="h-20 w-16 border border-black rounded overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                {photoUrl ? (
                  <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[7px] text-gray-500">PHOTO</span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 text-left text-[8px] leading-tight space-y-0.5">
                <p><strong>NAME:</strong> {fullName.toUpperCase()}</p>
                <p><strong>FATHER:</strong> {fatherName.toUpperCase()}</p>
                <p><strong>ROLL NO:</strong> {rollNumber}</p>
                <p><strong>PROGRAM:</strong> {courseName}</p>
                <p><strong>CAMPUS:</strong> {campusName.split("—")[0]}</p>
                <p><strong>BLOOD:</strong> {bloodGroup} | <strong>CNIC:</strong> {cnic}</p>
              </div>

              {/* QR Code */}
              <div className="shrink-0 text-center border p-1 rounded border-black">
                <QrCode className="h-12 w-12 text-black" />
                <span className="text-[6px] font-bold block uppercase">ATTENDANCE</span>
              </div>
            </div>

            <div className="text-[7px] text-center border-t pt-0.5 border-black font-mono">
              VALID THRU: {validThrough} • HELPLINE: (021) 111-729-526
            </div>
          </div>

          {/* Print: Back Side */}
          <div className="w-[85.6mm] h-[53.98mm] rounded-lg overflow-hidden border border-black bg-white text-black flex flex-col justify-between p-2.5 box-border shadow-none">
            <div className="border-b pb-1 border-black text-[8px] font-bold text-center">
              RULES &amp; DIGITAL ATTENDANCE INSTRUCTIONS
            </div>
            <ul className="text-[7px] list-decimal pl-3 space-y-0.5">
              <li>Scan the front QR code at biometric turnstiles for attendance.</li>
              <li>Minimum 75% attendance mandatory for exam &amp; certification.</li>
              <li>This card is non-transferable property of Saylani Welfare.</li>
              <li>If found, please return to nearest Saylani Campus.</li>
            </ul>
            <div className="text-center pt-1">
              <div className="h-5 w-40 mx-auto bg-black" />
              <p className="text-[7px] font-mono mt-0.5">{rollNumber}</p>
            </div>
            <div className="flex justify-between items-end border-t pt-1 border-black text-[7px]">
              <span>UAN: (021) 111-729-526</span>
              <span>Authorized Signature: ____________</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
