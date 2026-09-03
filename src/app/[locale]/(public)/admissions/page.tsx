"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/data/courses";
import { cn } from "@/lib/utils";
import { StudentIdCard } from "@/components/shared/student-id-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  BookOpen,
  Building2,
  Calendar,
  Clock,
  Printer,
  QrCode,
  ShieldCheck,
  AlertCircle,
  FileText,
  Upload,
  Sparkles,
  Laptop,
  Image as ImageIcon,
  CreditCard,
  Camera,
  Check,
  Loader2,
  X,
} from "lucide-react";

const campuses = [
  { id: "khi-main", name: "Karachi — Main Bahadurabad HQ", city: "Karachi" },
  { id: "khi-gulshan", name: "Karachi — Gulshan Campus (MHIT)", city: "Karachi" },
  { id: "khi-nazimabad", name: "Karachi — Nazimabad Tech Lab", city: "Karachi" },
  { id: "lhr-model", name: "Lahore — Model Town Campus", city: "Lahore" },
  { id: "isb-blue", name: "Islamabad — Blue Area Campus", city: "Islamabad" },
  { id: "fsd-peoples", name: "Faisalabad — Peoples Colony", city: "Faisalabad" },
  { id: "mul-bosan", name: "Multan — Bosan Road Campus", city: "Multan" },
  { id: "pew-university", name: "Peshawar — University Road", city: "Peshawar" },
  { id: "qta-cantt", name: "Quetta — Cantt Campus", city: "Quetta" },
  { id: "hyd-latifabad", name: "Hyderabad — Latifabad Center", city: "Hyderabad" },
];

const shifts = [
  { id: "morning", label: "Morning (09:00 AM - 12:00 PM)", desc: "Mon, Wed, Fri" },
  { id: "afternoon", label: "Afternoon (02:00 PM - 05:00 PM)", desc: "Mon, Wed, Fri" },
  { id: "evening", label: "Evening (06:00 PM - 09:00 PM)", desc: "Tue, Thu, Sat" },
  { id: "weekend", label: "Weekend Executive (10:00 AM - 03:00 PM)", desc: "Sat & Sun" },
];

function AdmissionsFormContent() {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("course") || "";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    courseId: initialCourse ? courses.find((c) => c.slug === initialCourse)?.id || courses[0].id : courses[0].id,
    campusId: campuses[0].id,
    shiftId: shifts[0].id,
    fullName: "",
    fatherName: "",
    cnic: "",
    dob: "",
    gender: "male",
    phone: "",
    email: "",
    city: "Karachi",
    address: "",
    qualification: "intermediate",
    board: "",
    passingYear: "2024",
    grade: "A",
    hasLaptop: "yes",
    priorCoding: "beginner",
    photoUrl: "",
    bloodGroup: "B+",
  });

  const [rollNumber, setRollNumber] = useState("");
  const [testDate, setTestDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resultView, setResultView] = useState<"admit-slip" | "student-card">("student-card");

  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadSource, setUploadSource] = useState<string>("");

  useEffect(() => {
    if (initialCourse) {
      const match = courses.find((c) => c.slug === initialCourse);
      if (match) {
        setFormData((prev) => ({ ...prev, courseId: match.id }));
      }
    }
  }, [initialCourse]);

  const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
  const selectedCampus = campuses.find((c) => c.id === formData.campusId) || campuses[0];
  const selectedShift = shifts.find((s) => s.id === formData.shiftId) || shifts[0];

  // Auto-format CNIC as XXXXX-XXXXXXX-X
  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 13) val = val.slice(0, 13);
    let formatted = "";
    if (val.length > 5) {
      formatted = val.slice(0, 5) + "-" + val.slice(5);
    } else {
      formatted = val;
    }
    if (val.length > 12) {
      formatted = formatted.slice(0, 13) + "-" + val.slice(12, 13);
    }
    setFormData({ ...formData, cnic: formatted });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 11) val = val.slice(0, 11);
    let formatted = val;
    if (val.length > 4) {
      formatted = val.slice(0, 4) + "-" + val.slice(4);
    }
    setFormData({ ...formData, phone: formatted });
  };

  // Image Upload to Cloudinary with local fallback
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, photo: "Please upload an image file (PNG, JPG, JPEG, WEBP)" }));
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Image size must be less than 6MB" }));
      return;
    }

    // Instant local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const localUrl = event.target?.result as string;
      setFormData((prev) => ({ ...prev, photoUrl: localUrl }));
    };
    reader.readAsDataURL(file);

    // Call Cloudinary API endpoint
    setIsUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload/cloudinary", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, photoUrl: data.url }));
        setUploadSource(data.source === "cloudinary" ? "Cloudinary Cloud" : "Processed");
      }
    } catch {
      // Keep local base64 preview
      setUploadSource("Attached");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const validateStep = (currentStep: number) => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.courseId) errs.courseId = "Please select a course";
      if (!formData.campusId) errs.campusId = "Please select a campus";
    } else if (currentStep === 2) {
      if (!formData.fullName.trim()) errs.fullName = "Full name is required";
      if (!formData.fatherName.trim()) errs.fatherName = "Father's name is required";
      if (formData.cnic.length < 15) errs.cnic = "Valid 13-digit CNIC/B-Form is required (XXXXX-XXXXXXX-X)";
      if (!formData.phone || formData.phone.length < 11) errs.phone = "Valid 11-digit phone number is required";
      if (!formData.email.includes("@")) errs.email = "Valid email is required";
      if (!formData.dob) errs.dob = "Date of birth is required";
    } else if (currentStep === 3) {
      if (!formData.board.trim()) errs.board = "Institute or Board name is required";
      if (!formData.passingYear) errs.passingYear = "Passing year is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const randomRoll = `SMIT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const dates = ["Sunday, March 15, 2026", "Sunday, March 22, 2026", "Sunday, March 29, 2026"];
      const assignedDate = dates[Math.floor(Math.random() * dates.length)];

      setRollNumber(randomRoll);
      setTestDate(assignedDate);
      setIsSubmitting(false);
      setStep(5);
      window.scrollTo({ top: 80, behavior: "smooth" });
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container-custom max-w-4xl mx-auto px-4">
        {/* Header Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <GraduationCap className="h-4 w-4 text-emerald-600" />
            Saylani Mass IT Training (SMIT) • Batch 2026
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Online Admission Application
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            100% Free Government &amp; Saylani Trust Certified IT Education. Upload your photograph to generate your official Student ID &amp; Attendance Smart Card.
          </p>
        </div>

        {/* Step Progress Indicator (Hidden on Final Step) */}
        {step < 5 && (
          <div className="mb-10">
            <div className="flex items-center justify-between relative max-w-2xl mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#0284c7] -translate-y-1/2 -z-0 transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />

              {[
                { s: 1, title: "Course" },
                { s: 2, title: "Personal" },
                { s: 3, title: "Education" },
                { s: 4, title: "Photo & Review" },
              ].map(({ s, title }) => (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-sm",
                      step > s
                        ? "bg-emerald-600 text-white"
                        : step === s
                        ? "bg-[#0284c7] text-white ring-4 ring-sky-100 dark:ring-sky-950/60"
                        : "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-400"
                    )}
                  >
                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] sm:text-xs font-bold mt-2",
                      step >= s ? "text-slate-900 dark:text-white" : "text-slate-400"
                    )}
                  >
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── FORM CONTAINER ─── */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {/* STEP 1: Program, Campus & Shift */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border border-slate-200 dark:border-slate-800 shadow-float">
                  <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#0284c7]" />
                      Select Desired Course &amp; Training Center
                    </CardTitle>
                    <CardDescription>
                      Choose the IT career track you want to master and your nearest Saylani campus.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Course Picker */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Select IT Program *
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {courses.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => setFormData({ ...formData, courseId: c.id })}
                            className={cn(
                              "p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none",
                              formData.courseId === c.id
                                ? "border-[#0284c7] bg-sky-50/60 dark:bg-sky-950/40 shadow-xs"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                            )}
                          >
                            <img
                              src={c.image}
                              alt={c.name}
                              className="h-12 w-12 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                {c.name}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {c.shortDescription}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                                  {c.duration}
                                </Badge>
                                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                  100% Free
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Campus Picker */}
                    <div className="space-y-2 pt-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Select Campus Location *
                      </Label>
                      <select
                        value={formData.campusId}
                        onChange={(e) => setFormData({ ...formData, campusId: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0284c7] outline-none cursor-pointer"
                      >
                        {campuses.map((camp) => (
                          <option key={camp.id} value={camp.id}>
                            {camp.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Shift Picker */}
                    <div className="space-y-2 pt-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Preferred Batch Shift *
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {shifts.map((shift) => (
                          <div
                            key={shift.id}
                            onClick={() => setFormData({ ...formData, shiftId: shift.id })}
                            className={cn(
                              "p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between",
                              formData.shiftId === shift.id
                                ? "border-[#0284c7] bg-sky-50/50 dark:bg-sky-950/30"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                            )}
                          >
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {shift.label}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                {shift.desc}
                              </p>
                            </div>
                            <div
                              className={cn(
                                "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                                formData.shiftId === shift.id
                                  ? "border-[#0284c7] bg-[#0284c7]"
                                  : "border-slate-300"
                              )}
                            >
                              {formData.shiftId === shift.id && (
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation CTA */}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleNext}
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-8 h-11 rounded-full cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <span>Proceed to Personal Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Personal Information */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border border-slate-200 dark:border-slate-800 shadow-float">
                  <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <User className="h-5 w-5 text-[#0284c7]" />
                      Candidate Personal Details
                    </CardTitle>
                    <CardDescription>
                      Provide exact legal details matching your CNIC / B-Form or Matric Certificate.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Full Name (as per CNIC) *
                        </Label>
                        <Input
                          placeholder="e.g. Muhammad Hamza"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                        {errors.fullName && (
                          <p className="text-[11px] text-red-500 font-semibold">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Father's Name */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Father&apos;s Name *
                        </Label>
                        <Input
                          placeholder="e.g. Abdul Rasheed"
                          value={formData.fatherName}
                          onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                        {errors.fatherName && (
                          <p className="text-[11px] text-red-500 font-semibold">{errors.fatherName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* CNIC / B-Form */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          CNIC or B-Form Number *
                        </Label>
                        <Input
                          placeholder="42101-1234567-1"
                          value={formData.cnic}
                          onChange={handleCnicChange}
                          className="h-11 rounded-xl font-mono text-sm"
                        />
                        {errors.cnic ? (
                          <p className="text-[11px] text-red-500 font-semibold">{errors.cnic}</p>
                        ) : (
                          <p className="text-[10px] text-slate-400">Include dashes (13 digits)</p>
                        )}
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Date of Birth *
                        </Label>
                        <Input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                        {errors.dob && (
                          <p className="text-[11px] text-red-500 font-semibold">{errors.dob}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Gender */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Gender *
                        </Label>
                        <div className="flex items-center gap-4 pt-2">
                          {["male", "female"].map((g) => (
                            <label
                              key={g}
                              className="flex items-center gap-2 text-xs font-bold capitalize cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="gender"
                                value={g}
                                checked={formData.gender === g}
                                onChange={() => setFormData({ ...formData, gender: g })}
                                className="h-4 w-4 text-[#0284c7] cursor-pointer"
                              />
                              <span>{g}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Blood Group */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Blood Group (for Student Card)
                        </Label>
                        <select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold outline-none cursor-pointer"
                        >
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>

                      {/* City */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          City of Residence *
                        </Label>
                        <Input
                          placeholder="e.g. Karachi"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Mobile / WhatsApp */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Mobile / WhatsApp Number *
                        </Label>
                        <Input
                          placeholder="0300-1234567"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className="h-11 rounded-xl font-mono text-sm"
                        />
                        {errors.phone ? (
                          <p className="text-[11px] text-red-500 font-semibold">{errors.phone}</p>
                        ) : (
                          <p className="text-[10px] text-slate-400">Exam instructions will be sent via SMS/WhatsApp</p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Email Address *
                        </Label>
                        <Input
                          type="email"
                          placeholder="student@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                        {errors.email && (
                          <p className="text-[11px] text-red-500 font-semibold">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Residential Address */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Current Residential Address *
                      </Label>
                      <Input
                        placeholder="House / Flat No, Street, Area"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    className="h-11 px-6 rounded-full cursor-pointer flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-8 h-11 rounded-full cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <span>Proceed to Education Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Education & Tech Readiness */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border border-slate-200 dark:border-slate-800 shadow-float">
                  <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-[#0284c7]" />
                      Academic Qualifications &amp; Technical Background
                    </CardTitle>
                    <CardDescription>
                      All educational backgrounds are welcome. Minimum criteria is Matric / O-Level.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Qualification Level */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Highest Completed Qualification *
                        </Label>
                        <select
                          value={formData.qualification}
                          onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                        >
                          <option value="matric">Matriculation / O-Level</option>
                          <option value="intermediate">Intermediate / A-Level / DAE</option>
                          <option value="undergraduate">Bachelors (In-progress or Completed)</option>
                          <option value="graduate">Masters / MS</option>
                        </select>
                      </div>

                      {/* Board / University */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Board / College / University Name *
                        </Label>
                        <Input
                          placeholder="e.g. BIEK Karachi / Punjab Board / NED"
                          value={formData.board}
                          onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                        {errors.board && (
                          <p className="text-[11px] text-red-500 font-semibold">{errors.board}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Passing Year */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Passing Year *
                        </Label>
                        <Input
                          type="number"
                          min="2010"
                          max="2026"
                          value={formData.passingYear}
                          onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                      </div>

                      {/* Grade / Percentage */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Grade / Percentage *
                        </Label>
                        <Input
                          placeholder="e.g. A-One (82%)"
                          value={formData.grade}
                          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Laptop Ownership */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-[#0284c7]" />
                        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Do you own a personal laptop for hands-on practice? *
                        </Label>
                      </div>
                      <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="hasLaptop"
                            value="yes"
                            checked={formData.hasLaptop === "yes"}
                            onChange={() => setFormData({ ...formData, hasLaptop: "yes" })}
                            className="h-4 w-4 text-[#0284c7] cursor-pointer"
                          />
                          <span>Yes, I have a laptop</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="hasLaptop"
                            value="no"
                            checked={formData.hasLaptop === "no"}
                            onChange={() => setFormData({ ...formData, hasLaptop: "no" })}
                            className="h-4 w-4 text-[#0284c7] cursor-pointer"
                          />
                          <span>No, I will use Saylani Campus Labs</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    className="h-11 px-6 rounded-full cursor-pointer flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-8 h-11 rounded-full cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <span>Proceed to Photo Upload</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Photo Upload (Cloudinary) & Final Review */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border border-slate-200 dark:border-slate-800 shadow-float">
                  <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Camera className="h-5 w-5 text-[#0284c7]" />
                      Candidate Photograph (For Student ID &amp; Attendance Card)
                    </CardTitle>
                    <CardDescription>
                      Upload a clear, front-facing passport photograph with plain background. Uploads directly to Cloudinary cloud storage.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Cloudinary Image Upload Dropzone */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-2 border-dashed border-slate-300 dark:border-slate-700">
                      {/* Photo Preview Box */}
                      <div className="relative h-36 w-32 rounded-2xl overflow-hidden border-2 border-[#0284c7]/40 bg-white dark:bg-slate-800 shadow-md shrink-0 flex items-center justify-center">
                        {formData.photoUrl ? (
                          <>
                            <img
                              src={formData.photoUrl}
                              alt="Candidate Preview"
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, photoUrl: "" });
                                setUploadSource("");
                              }}
                              className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-md cursor-pointer"
                              title="Remove photo"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-3 text-center">
                            <User className="h-10 w-10 text-slate-400 mb-1" />
                            <span className="text-[9px] uppercase font-bold text-slate-400">
                              Passport Photo
                            </span>
                          </div>
                        )}

                        {isUploadingImage && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                            <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
                            <span className="text-[9px] font-bold mt-1">Uploading...</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      <div className="flex-1 space-y-3 text-center sm:text-left">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {formData.photoUrl ? "Photo Attached Successfully" : "Upload Candidate Photograph *"}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            PNG, JPG, or WEBP up to 6MB. This photo will be printed on your official Admit Card &amp; Student ID Card.
                          </p>
                        </div>

                        {uploadSource && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                            <Check className="h-3.5 w-3.5" />
                            <span>Photo Linked ({uploadSource})</span>
                          </div>
                        )}

                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="photo-upload-input"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="rounded-full text-xs font-bold h-10 px-5 gap-2 border-slate-300 dark:border-slate-700 cursor-pointer"
                          >
                            <Upload className="h-4 w-4 text-[#0284c7]" />
                            <span>{formData.photoUrl ? "Change Photograph" : "Select Photo from Device"}</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Summary Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                      <div>
                        <p className="text-slate-400 font-medium">Selected Program</p>
                        <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {selectedCourse.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Assigned Campus</p>
                        <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {selectedCampus.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Preferred Shift</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {selectedShift.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Tuition Fee</p>
                        <p className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          100% Free (Zero Charges)
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Candidate Name</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {formData.fullName || "Muhammad Hamza"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">CNIC / B-Form</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {formData.cnic || "42101-1234567-1"}
                        </p>
                      </div>
                    </div>

                    {/* Declaration */}
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <p>
                        I hereby declare that all information provided is accurate and true. I understand that admission is subject to passing the Saylani Entrance Exam and merit verification.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={isSubmitting}
                    className="h-11 px-6 rounded-full cursor-pointer flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isUploadingImage}
                    className="btn-shimmer bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-9 h-11 rounded-full cursor-pointer shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Generating Admit Slip &amp; Student Card...</span>
                    ) : (
                      <>
                        <span>Submit &amp; Generate Credentials</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: OFFICIAL CREDENTIAL GENERATOR (Admit Slip + Student Card with Attendance QR) */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Top Success Banner */}
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-extrabold">Admission Application Successfully Submitted!</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Roll Number: <strong className="font-mono text-slate-900 dark:text-white">{rollNumber}</strong> • Your official documents are generated below.
                      </p>
                    </div>
                  </div>

                  {/* Document Switcher Tabs */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                    <button
                      onClick={() => setResultView("student-card")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                        resultView === "student-card"
                          ? "bg-[#0284c7] text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      )}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Student ID Card</span>
                    </button>
                    <button
                      onClick={() => setResultView("admit-slip")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                        resultView === "admit-slip"
                          ? "bg-[#0284c7] text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      )}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Entrance Exam Slip</span>
                    </button>
                  </div>
                </div>

                {/* VIEW 1: PVC STUDENT ID CARD WITH ATTENDANCE QR */}
                {resultView === "student-card" && (
                  <div className="space-y-4">
                    <div className="text-center pb-1">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Official Student Smart Card &amp; Attendance Badge
                      </h3>
                      <p className="text-xs text-slate-500">
                        Equipped with your photograph and encrypted QR Code for campus biometric turnstiles and classroom attendance.
                      </p>
                    </div>

                    <StudentIdCard
                      fullName={formData.fullName || "Muhammad Hamza"}
                      fatherName={formData.fatherName || "Abdul Rasheed"}
                      rollNumber={rollNumber}
                      courseName={selectedCourse.name}
                      campusName={selectedCampus.name}
                      batchName="Batch 2026"
                      cnic={formData.cnic || "42101-1234567-1"}
                      bloodGroup={formData.bloodGroup}
                      photoUrl={formData.photoUrl}
                    />
                  </div>
                )}

                {/* VIEW 2: OFFICIAL ENTRANCE EXAM ADMIT SLIP */}
                {resultView === "admit-slip" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-end">
                      <Button
                        onClick={handlePrint}
                        className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-full h-10 px-5 shadow-sm flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print Admit Slip</span>
                      </Button>
                    </div>

                    {/* Official Admit Slip Printable Card */}
                    <Card id="admit-slip" className="border-2 border-slate-900 shadow-2xl overflow-hidden bg-white text-slate-900">
                      {/* Slip Header */}
                      <div className="border-b-2 border-slate-900 p-5 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284c7] to-[#10b981] text-white shadow-md">
                            <GraduationCap className="h-7 w-7" />
                          </div>
                          <div>
                            <h2 className="text-lg font-black tracking-tight uppercase leading-none">
                              Saylani Welfare International Trust
                            </h2>
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide pt-0.5">
                              Saylani Mass IT Training Program (SMIT)
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Entrance Examination Admit Slip • Batch 2026
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-slate-900 text-white font-mono text-xs px-2.5 py-1">
                            ROLL NO: {rollNumber}
                          </Badge>
                        </div>
                      </div>

                      {/* Slip Body */}
                      <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                          {/* Left Details */}
                          <div className="md:col-span-8 space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="border-b border-slate-200 pb-1.5">
                                <span className="text-slate-500 font-medium block">Candidate Name:</span>
                                <span className="font-extrabold text-sm uppercase">{formData.fullName || "Muhammad Hamza"}</span>
                              </div>
                              <div className="border-b border-slate-200 pb-1.5">
                                <span className="text-slate-500 font-medium block">Father&apos;s Name:</span>
                                <span className="font-extrabold text-sm uppercase">{formData.fatherName || "Abdul Rasheed"}</span>
                              </div>
                              <div className="border-b border-slate-200 pb-1.5">
                                <span className="text-slate-500 font-medium block">CNIC / B-Form:</span>
                                <span className="font-bold font-mono">{formData.cnic || "42101-1234567-1"}</span>
                              </div>
                              <div className="border-b border-slate-200 pb-1.5">
                                <span className="text-slate-500 font-medium block">Mobile Number:</span>
                                <span className="font-bold font-mono">{formData.phone || "0300-1234567"}</span>
                              </div>
                              <div className="border-b border-slate-200 pb-1.5 col-span-2">
                                <span className="text-slate-500 font-medium block">Applied Course:</span>
                                <span className="font-extrabold text-[#0284c7] text-sm">{selectedCourse.name}</span>
                              </div>
                              <div className="border-b border-slate-200 pb-1.5 col-span-2">
                                <span className="text-slate-500 font-medium block">Assigned Examination Center:</span>
                                <span className="font-bold">{selectedCampus.name}</span>
                              </div>
                              <div className="border-b border-slate-200 pb-1.5">
                                <span className="text-slate-500 font-medium block">Test Date &amp; Day:</span>
                                <span className="font-extrabold text-emerald-700">{testDate}</span>
                              </div>
                              <div className="border-b border-slate-200 pb-1.5">
                                <span className="text-slate-500 font-medium block">Reporting Time:</span>
                                <span className="font-extrabold">09:30 AM Sharp</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Photo & QR Code */}
                          <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3 border-l md:pl-6 border-slate-200">
                            {/* Candidate Passport Photo */}
                            <div className="h-32 w-28 rounded-lg border-2 border-slate-300 overflow-hidden bg-slate-100 flex flex-col items-center justify-center text-center">
                              {formData.photoUrl ? (
                                <img
                                  src={formData.photoUrl}
                                  alt="Candidate Photo"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="p-2">
                                  <User className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                                  <span className="text-[9px] text-slate-500 font-bold uppercase leading-tight">
                                    Passport Photo
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* QR Code Verification */}
                            <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2">
                              <QrCode className="h-10 w-10 text-slate-800" />
                              <div className="text-[9px] font-mono leading-tight">
                                <p className="font-bold">VERIFY ENTRANCE</p>
                                <p className="text-slate-500">{rollNumber}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Important Instructions Box */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px] text-slate-700">
                          <p className="font-bold uppercase tracking-wider text-slate-900">
                            Mandatory Exam Day Instructions:
                          </p>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li>Candidate must bring this printed Admit Card and original CNIC / B-Form.</li>
                            <li>Mobile phones, smart watches, and calculators are strictly prohibited in the exam hall.</li>
                            <li>Test covers basic English, Mathematics, and Logical Reasoning.</li>
                            <li>Test venue gates will close exactly at 09:45 AM. Late candidates will not be entertained.</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Bottom Global Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                  <Link href="/">
                    <Button variant="outline" className="rounded-full px-6 cursor-pointer">
                      ← Back to Home
                    </Button>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link href="/student/card">
                      <Button variant="outline" className="rounded-full px-5 cursor-pointer flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-[#0284c7]" />
                        <span>Open in Student Portal</span>
                      </Button>
                    </Link>
                    <Button
                      onClick={handlePrint}
                      className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-full px-7 cursor-pointer shadow-md flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print Document Now</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function AdmissionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center">Loading Admission Portal...</div>}>
      <AdmissionsFormContent />
    </Suspense>
  );
}
