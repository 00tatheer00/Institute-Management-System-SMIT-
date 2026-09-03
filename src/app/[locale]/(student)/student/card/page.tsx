"use client";

import { useState } from "react";
import { StudentIdCard } from "@/components/shared/student-id-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
} from "lucide-react";

export default function StudentCardPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500 text-white font-extrabold text-[10px] uppercase">
            Official Credential
          </Badge>
          <span className="text-xs text-slate-500">Academic Year 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Digital Student ID &amp; Attendance Smart Card
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          This digital PVC smart card is your official identification at all Saylani Welfare International Trust campuses. Scan the embedded QR code at campus gates for automatic biometric attendance marking.
        </p>
      </div>

      {/* Interactive Smart Card Component */}
      <StudentIdCard
        fullName="Muhammad Hamza"
        fatherName="Abdul Rasheed"
        rollNumber="SMIT-2026-84920"
        courseName="Full Stack Web Development (MERN)"
        campusName="Karachi — Gulshan Campus (MHIT)"
        batchName="Batch 2026"
        cnic="42101-1234567-1"
        bloodGroup="B+"
        validThrough="12/2026"
        photoUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
      />

      {/* Guidelines & Attendance FAQ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <QrCode className="h-5 w-5" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              How Digital Attendance Works
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every Saylani campus entrance and computer lab is equipped with optical QR scanners. Simply hold your printed or digital card QR code in front of the scanner when entering and leaving to log your attendance in real-time.
          </p>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#0284c7]">
            <Printer className="h-5 w-5" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Printing Instructions
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Click <strong>&quot;Print Student Card&quot;</strong> above. Set your printer paper size to Standard A4 or 4x6 Photo Paper. Both Front and Back sides will print at exact standard physical PVC dimensions (85.6mm × 54mm) ready for laminating or plastic badge insertion.
          </p>
        </Card>
      </div>
    </div>
  );
}
