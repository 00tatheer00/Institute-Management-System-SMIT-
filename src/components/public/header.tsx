"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, GraduationCap } from "lucide-react";

export function PublicHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);

  const mainNav = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/about" },
    { label: t("courses"), href: "/courses" },
    { label: t("trainers"), href: "/trainers" },
    { label: t("batches"), href: "/batches" },
    { label: t("admissions"), href: "/admissions" },
  ];

  const moreNav = [
    { label: t("events"), href: "/events" },
    { label: t("gallery"), href: "/gallery" },
    { label: t("projects"), href: "/projects" },
    { label: t("successStories"), href: "/success-stories" },
    { label: t("announcements"), href: "/announcements" },
    { label: t("faq"), href: "/faq" },
    { label: t("verifyCertificate"), href: "/verify-certificate" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-brand">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight tracking-tight">
              {tCommon("siteShortName")}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {tCommon("tagline")}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t("more")} <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {moreNav.map((item) => (
                <DropdownMenuItem key={item.href}>
                  <Link href={item.href} className="w-full">{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/login" className="hidden sm:block">
            <Button variant="outline" size="sm">
              {t("login")}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-muted">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-sm">{tCommon("siteShortName")}</span>
                  </div>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {[...mainNav, ...moreNav].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">{t("login")}</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
