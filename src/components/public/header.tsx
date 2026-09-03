"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  Image as ImageIcon,
  Trophy,
  Code2,
  Calendar,
  HelpCircle,
  Bell,
  LogIn,
} from "lucide-react";

export function PublicHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNav = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/about" },
    { label: t("courses"), href: "/courses" },
    { label: t("trainers"), href: "/trainers" },
    { label: t("batches"), href: "/batches" },
    {
      label: t("admissions"),
      href: "/admissions",
      badge: "BATCH 2026",
    },
  ];

  const moreNavCategories = [
    {
      title: "Campus Life & Showcase",
      items: [
        { label: t("gallery"), href: "/gallery", icon: ImageIcon, desc: "Campus labs & student life" },
        { label: t("successStories"), href: "/success-stories", icon: Trophy, desc: "Alumni working worldwide" },
        { label: t("projects"), href: "/projects", icon: Code2, desc: "Student capstones & software" },
        { label: t("events"), href: "/events", icon: Calendar, desc: "Hackathons & tech workshops" },
      ],
    },
    {
      title: "Verification & Support",
      items: [
        { label: t("verifyCertificate"), href: "/verify-certificate", icon: ShieldCheck, desc: "Verify SMIT credentials online" },
        { label: t("announcements"), href: "/announcements", icon: Bell, desc: "Official exam & batch notices" },
        { label: t("faq"), href: "/faq", icon: HelpCircle, desc: "Frequently asked questions" },
        { label: t("contact"), href: "/contact", icon: Building2, desc: "Nationwide campuses & helpline" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full select-none">
      {/* ─── 1. Ultra-Clean Top Announcement Bar ─── */}
      <div className="bg-slate-950 text-slate-200 border-b border-slate-800/80 text-[11px] sm:text-xs py-1.5 px-4 transition-all">
        <div className="container-custom flex items-center justify-between gap-3">
          {/* Left Announcement */}
          <div className="flex items-center gap-2 truncate">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-emerald-400">Admissions Open:</span>
            <span className="text-slate-300 truncate hidden sm:inline">
              100% Free IT Education under Saylani Welfare International Trust
            </span>
            <Link
              href="/admissions"
              className="inline-flex items-center gap-1 font-bold text-sky-400 hover:text-sky-300 transition-colors ml-1 cursor-pointer"
            >
              Apply Online <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Right Support Details */}
          <div className="hidden md:flex items-center gap-4 text-slate-400 shrink-0 font-medium">
            <a
              href="tel:021111729526"
              className="hover:text-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Phone className="h-3 w-3 text-emerald-400" />
              <span>UAN: (021) 111-729-526</span>
            </a>
            <span className="text-slate-700">|</span>
            <Link
              href="/verify-certificate"
              className="hover:text-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="h-3 w-3 text-sky-400" />
              <span>Verify Certificate</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 2. Main High-End Navigation Bar ─── */}
      <div
        className={cn(
          "w-full transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-200/90 dark:border-slate-800/90 shadow-md py-2.5"
            : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200/60 dark:border-slate-800/60 shadow-2xs py-3.5"
        )}
      >
        <div className="container-custom flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group cursor-pointer">
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0284c7] via-[#0ea5e9] to-[#10b981] shadow-md shadow-[#0284c7]/20 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  SMIT
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  SAYLANI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight pt-0.5 hidden xs:block">
                Mass IT Training Program
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5",
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-[#0284c7] dark:text-sky-400 shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-500 text-white shadow-2xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0284c7] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Rich "More" Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all duration-200 flex items-center gap-1 outline-none cursor-pointer">
                <span>{t("more")}</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 p-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-2xl"
              >
                {moreNavCategories.map((cat, idx) => (
                  <div key={cat.title}>
                    {idx > 0 && <DropdownMenuSeparator className="my-1.5 bg-slate-100 dark:bg-slate-800" />}
                    <DropdownMenuLabel className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
                      {cat.title}
                    </DropdownMenuLabel>
                    <div className="space-y-0.5">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem
                            key={item.href}
                            className="p-0 rounded-xl cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800/70"
                          >
                            <Link
                              href={item.href}
                              className="flex items-start gap-2.5 p-2 w-full rounded-xl transition-colors cursor-pointer group"
                            >
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-[#0284c7] group-hover:text-white transition-colors shrink-0">
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0284c7] dark:group-hover:text-sky-400 transition-colors">
                                  {item.label}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                  {item.desc}
                                </span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Actions Suite */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Switcher */}
            <div className="cursor-pointer">
              <LanguageSwitcher />
            </div>

            {/* Portal Login Button */}
            <Link href="/login" className="hidden sm:block cursor-pointer">
              <Button
                variant="outline"
                size="sm"
                className="font-bold text-xs rounded-full h-9 px-4 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5 text-slate-500" />
                <span>{t("login")}</span>
              </Button>
            </Link>

            {/* High-Impact Enroll Now Pill Button */}
            <Link href="/admissions" className="cursor-pointer">
              <button className="btn-shimmer bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full h-9 px-5 shadow-md shadow-[#0284c7]/25 hover:shadow-lg hover:shadow-[#0284c7]/35 transition-all duration-200 cursor-pointer flex items-center gap-1.5">
                <span>Enroll Now</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </Link>

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-xl h-9 w-9 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle navigation</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 border-0 shadow-2xl bg-white dark:bg-slate-950">
                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Drawer Brand Header */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284c7] to-[#10b981] text-white shadow-md">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">SMIT Portal</span>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Saylani IT Initiative</p>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Navigation Links */}
                  <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 pb-1">
                      Academic Navigation
                    </p>
                    {mainNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}

                    <div className="pt-3 pb-1">
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 pb-1">
                        Explore & Verification
                      </p>
                    </div>

                    {moreNavCategories.flatMap((cat) => cat.items).map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer"
                        >
                          <Icon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Drawer CTA & Helpline */}
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/30">
                    <Link href="/admissions" onClick={() => setIsOpen(false)} className="block cursor-pointer">
                      <button className="w-full btn-shimmer bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl h-10 shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5">
                        <span>Enroll Now — Free Admission</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="block cursor-pointer">
                      <Button
                        variant="outline"
                        className="w-full font-bold text-xs rounded-xl h-10 border-slate-300 dark:border-slate-700 cursor-pointer"
                      >
                        {t("login")}
                      </Button>
                    </Link>
                    <p className="text-center text-[10px] text-slate-400 pt-1">
                      Helpline UAN: (021) 111-729-526
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
