"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/context";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, LogOut, BookOpen, CheckSquare, Award } from "lucide-react";

export function StudentTopbar() {
  const t = useTranslations();
  const { user, logout } = useAuth();

  const studentName = user?.name || "Muhammad Khan";
  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 h-16 glass-header flex items-center justify-between px-4 lg:px-6">
      {/* Mobile spacer */}
      <div className="lg:hidden w-10" />

      {/* Cohort Info Pill */}
      <div className="hidden sm:flex items-center gap-2 text-xs">
        <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1.5 font-semibold text-blue-700 border border-blue-100 shadow-sm">
          Web Development • WD-01 (Morning)
        </span>
        <span className="text-muted-foreground hidden md:inline">
          Roll No: MH-C1-2026-0001
        </span>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        {/* Notifications */}
        <Link href="/student/notifications">
          <Button variant="ghost" size="icon" className="relative h-8 w-8 group transition-all duration-200 hover:bg-blue-50">
            <Bell className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-medium shadow-sm">
              <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-30" />
              <span className="relative">3</span>
            </span>
          </Button>
        </Link>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 px-2 h-8 hover:bg-blue-50 transition-all duration-200" />}>
            <Avatar className="h-8 w-8 ring-2 ring-blue-200 transition-all duration-200 hover:ring-blue-400">
              <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium max-w-[130px] truncate">
              {studentName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card border-0 shadow-depth">
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold">{studentName}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "muhammad.khan@student.mhit.edu.pk"}</p>
              <div className="mt-1.5 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-100">
                Enrolled Student • Active
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="transition-colors hover:bg-blue-50/50">
              <Link href="/student/progress" className="flex items-center w-full">
                <CheckSquare className="h-4 w-4 me-2 text-muted-foreground" /> Academic Progress
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="transition-colors hover:bg-blue-50/50">
              <Link href="/student/results" className="flex items-center w-full">
                <Award className="h-4 w-4 me-2 text-muted-foreground" /> Grade Transcript
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="transition-colors hover:bg-blue-50/50">
              <Link href="/student/profile" className="flex items-center w-full">
                <User className="h-4 w-4 me-2 text-muted-foreground" /> Student Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="transition-colors hover:bg-blue-50/50">
              <Link href="/student/settings" className="flex items-center w-full">
                <User className="h-4 w-4 me-2 text-muted-foreground" /> Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive transition-colors">
              <LogOut className="h-4 w-4 me-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
