"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/context";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { NotificationsPopover } from "@/components/shared/notifications-popover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, CreditCard, Search, Command } from "lucide-react";

export function StudentTopbar() {
  const t = useTranslations();
  const { user, logout } = useAuth();

  const studentName = user?.name || "Muhammad Hamza";
  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/75 dark:bg-slate-950/75 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 lg:px-6 transition-all">
      {/* Mobile spacer */}
      <div className="lg:hidden w-10" />

      {/* Cohort & Student ID Card Quick Access Pill */}
      <div className="hidden sm:flex items-center gap-2.5 text-xs">
        <span className="inline-flex items-center rounded-xl bg-sky-50 dark:bg-sky-950/60 px-3 py-1 font-bold text-[#0284c7] dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs">
          Batch 2026 • Full Stack Web
        </span>
        <Link href="/student/card">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-xl gap-1.5 text-xs font-bold border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 cursor-pointer shadow-2xs"
          >
            <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
            <span>Digital ID Card</span>
          </Button>
        </Link>
      </div>

      {/* Center Spotlight Search */}
      <div className="flex-1 max-w-sm mx-4 hidden lg:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-[#0284c7] transition-colors" />
          <input
            type="text"
            placeholder="Search lectures, quizzes, projects..."
            className="w-full h-8 pl-8.5 pr-8 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 text-xs placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-[#0284c7]/40 focus:outline-none transition-all shadow-2xs"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-[9px] font-mono text-slate-400">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        {/* Notifications Popover */}
        <NotificationsPopover />

        {/* User Account Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="gap-2 px-2.5 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              />
            }
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#0284c7] to-[#10b981] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {initials}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block leading-tight truncate max-w-[110px]">
                {studentName}
              </span>
              <span className="text-[10px] text-sky-600 block leading-none font-mono">
                SMIT-2026
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl"
          >
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {studentName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || "student@smit.edu.pk"}</p>
            </div>
            <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuItem className="p-0 rounded-xl cursor-pointer">
              <Link href="/student/card" className="flex items-center gap-2 text-xs font-semibold p-2 w-full">
                <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                <span>My Student ID Card</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 rounded-xl cursor-pointer">
              <Link href="/student/profile" className="flex items-center gap-2 text-xs font-semibold p-2 w-full">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span>Student Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuItem
              onClick={async (e) => {
                e.preventDefault();
                await logout();
              }}
              className="rounded-xl cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 p-2 text-xs font-semibold flex items-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
