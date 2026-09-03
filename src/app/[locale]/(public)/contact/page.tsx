"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  HelpCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

const campuses = [
  {
    city: "Karachi",
    name: "Main Bahadurabad HQ Campus",
    address: "A-25, Bahadurabad Chowrangi, Karachi, Sindh 74800",
    phone: "(021) 111-729-526",
    email: "karachi@saylaniwelfare.com",
    timings: "08:00 AM - 10:00 PM (Mon - Sat)",
    mapUrl: "https://maps.google.com/?q=Saylani+Head+Office+Bahadurabad+Karachi",
  },
  {
    city: "Karachi",
    name: "Gulshan Campus (Mohsin and Huma IT Center)",
    address: "Block 5, Gulshan-e-Iqbal, Near NIPA, Karachi",
    phone: "(021) 3497-2281",
    email: "mhit@saylaniwelfare.com",
    timings: "09:00 AM - 09:00 PM (Mon - Sat)",
    mapUrl: "https://maps.google.com/?q=Mohsin+and+Huma+IT+Center+Karachi",
  },
  {
    city: "Lahore",
    name: "Model Town Tech Campus",
    address: "Plot 14-C, Model Town Link Road, Lahore, Punjab",
    phone: "(042) 3517-8890",
    email: "lahore@saylaniwelfare.com",
    timings: "09:00 AM - 08:00 PM (Mon - Sat)",
    mapUrl: "https://maps.google.com/?q=Saylani+Model+Town+Lahore",
  },
  {
    city: "Islamabad",
    name: "Blue Area IT Center",
    address: "3rd Floor, Executive Heights, Blue Area, Islamabad",
    phone: "(051) 280-1492",
    email: "islamabad@saylaniwelfare.com",
    timings: "09:00 AM - 07:00 PM (Mon - Sat)",
    mapUrl: "https://maps.google.com/?q=Saylani+Blue+Area+Islamabad",
  },
  {
    city: "Faisalabad",
    name: "Peoples Colony Campus",
    address: "D-Ground, Peoples Colony # 1, Faisalabad, Punjab",
    phone: "(041) 871-3345",
    email: "faisalabad@saylaniwelfare.com",
    timings: "09:00 AM - 06:00 PM (Mon - Sat)",
    mapUrl: "https://maps.google.com/?q=Saylani+Faisalabad",
  },
  {
    city: "Multan",
    name: "Bosan Road Campus",
    address: "Near Bahauddin Zakariya University, Bosan Road, Multan",
    phone: "(061) 621-4478",
    email: "multan@saylaniwelfare.com",
    timings: "09:00 AM - 06:00 PM (Mon - Sat)",
    mapUrl: "https://maps.google.com/?q=Saylani+Multan",
  },
];

export default function ContactPage() {
  const [selectedCampus, setSelectedCampus] = useState(campuses[0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "admissions",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="container-custom max-w-6xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-[#0284c7] dark:text-sky-400 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Building2 className="h-4 w-4" />
            Nationwide Campuses & Support Center
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Get in Touch with Our Team
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Have questions about admissions, certificate verification, or campus visits? Reach out to our dedicated student helpline or send us a message.
          </p>
        </div>

        {/* Helpline Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 shrink-0">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Toll-Free UAN</p>
              <a href="tel:021111729526" className="text-base font-black text-slate-900 dark:text-white hover:text-[#0284c7] cursor-pointer">
                (021) 111-729-526
              </a>
              <p className="text-[10px] text-slate-500">Mon - Sat: 9 AM - 9 PM</p>
            </div>
          </Card>

          <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-950 text-[#0284c7] shrink-0">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Email Support</p>
              <a href="mailto:support@saylaniwelfare.com" className="text-xs font-bold text-slate-900 dark:text-white hover:text-[#0284c7] cursor-pointer">
                support@saylaniwelfare.com
              </a>
              <p className="text-[10px] text-slate-500">24-hour response time</p>
            </div>
          </Card>

          <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Campuses Network</p>
              <p className="text-base font-black text-slate-900 dark:text-white">
                150+ Centers
              </p>
              <p className="text-[10px] text-slate-500">Sindh, Punjab, KPK, Balochistan</p>
            </div>
          </Card>
        </div>

        {/* Split Grid: Interactive Contact Form & Campus Locator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Detailed Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-float bg-white dark:bg-slate-900">
              <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#0284c7]" />
                  Send an Official Inquiry
                </CardTitle>
                <CardDescription>
                  Fill out the details below and our admissions team will respond within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {submitted ? (
                  <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Message Received!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      Thank you for contacting Saylani Mass IT Training. Ticket #SMIT-{Math.floor(1000 + Math.random() * 9000)} has been logged. Our student counselor will contact you via email or phone shortly.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", subject: "admissions", message: "" });
                      }}
                      className="rounded-full cursor-pointer mt-2"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Your Full Name *
                        </Label>
                        <Input
                          placeholder="e.g. Bilal Ahmed"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-11 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Email Address *
                        </Label>
                        <Input
                          type="email"
                          placeholder="bilal@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-11 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Phone / WhatsApp Number
                        </Label>
                        <Input
                          placeholder="0300-1234567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-11 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Department / Inquiry Type *
                        </Label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                        >
                          <option value="admissions">Admission & Entry Test Inquiry</option>
                          <option value="verification">Certificate Verification Support</option>
                          <option value="corporate">Corporate Hiring & Job Placement</option>
                          <option value="trainer">Trainer / Instructor Application</option>
                          <option value="general">General Support / Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Your Message *
                      </Label>
                      <textarea
                        rows={4}
                        placeholder="Describe your question or requirement in detail..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-[#0284c7]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn-shimmer bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold w-full sm:w-auto px-9 h-11 rounded-full cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{loading ? "Sending Message..." : "Submit Inquiry"}</span>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Interactive Campus Directory (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  Find Nearest Saylani Campus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {/* Campus Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {campuses.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedCampus(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCampus.name === c.name
                          ? "bg-[#0284c7] text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {c.city} ({c.name.split("—")[1]?.trim().split(" ")[0] || c.city})
                    </button>
                  ))}
                </div>

                {/* Selected Campus Detail Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mt-2">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedCampus.name}
                  </h4>

                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{selectedCampus.address}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#0284c7] shrink-0" />
                    <span className="font-bold">{selectedCampus.phone}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#0284c7] shrink-0" />
                    <span>{selectedCampus.email}</span>
                  </p>

                  <p className="flex items-center gap-2 text-slate-500">
                    <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>{selectedCampus.timings}</span>
                  </p>

                  <a
                    href={selectedCampus.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-2 block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold rounded-xl h-9 cursor-pointer flex items-center justify-center gap-1.5 text-[#0284c7] border-[#0284c7]/40 hover:bg-sky-50"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
