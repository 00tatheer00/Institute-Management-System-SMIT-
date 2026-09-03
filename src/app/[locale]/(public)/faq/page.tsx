"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { faqs } from "@/lib/data/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageSquare,
  Phone,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "admissions", label: "Admissions & Eligibility" },
    { id: "classes", label: "Classes & Schedule" },
    { id: "certificates", label: "Certificates & Verification" },
    { id: "courses", label: "Equipment & Laptops" },
    { id: "general", label: "General & Fees" },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="container-custom max-w-4xl mx-auto px-4 space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-[#0284c7] dark:text-sky-400 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <HelpCircle className="h-4 w-4" />
            Knowledge Base & Student Helpdesk
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about Saylani IT admissions, entrance test criteria, class shifts, and certificates.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search frequently asked questions (e.g. laptop, free fee, admit slip, test)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#0284c7] text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <Card
                key={faq.id}
                className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs transition-all"
              >
                <div
                  onClick={() => toggleFaq(faq.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {faq.question}
                  </h3>
                  <div
                    className={`h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#0284c7] text-white dark:bg-[#0284c7]" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                {isOpen && (
                  <CardContent className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.answer}
                  </CardContent>
                )}
              </Card>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No questions found matching your search.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Please contact our student helpline directly.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-sky-950/40 dark:to-emerald-950/40 border border-sky-200 dark:border-sky-800 text-center space-y-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0284c7] text-white shadow-md mx-auto">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Still have questions about admissions or courses?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Our admission counselors are available Monday to Saturday to guide you through course selection and test preparation.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a href="tel:021111729526">
              <Button className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-full px-6 h-10 cursor-pointer flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Call (021) 111-729-526</span>
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" className="rounded-full px-6 h-10 cursor-pointer">
                Submit Online Query →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
