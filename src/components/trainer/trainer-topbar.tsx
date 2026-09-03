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
import { Bell, User, LogOut, BookOpen, CheckSquare, Plus } from "lucide-react";

export function TrainerTopbar() {
  const t = useTranslations();
  const { user, logout } = useAuth();

  const trainerName = user?.name || "Ahmed Hassan";
  const initials = trainerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 h-16 bg-background/95 backdrop-blur-sm border-b flex items-center justify-between px-4 lg:px-6">
      {/* Mobile spacer */}
      <div className="lg:hidden w-10" />

      {/* Quick Action Badges */}
      <div className="hidden md:flex items-center gap-3">
        <Link href="/trainer/attendance">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
            Take Attendance
          </Button>
        </Link>
        <Link href="/trainer/assignments">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5 text-blue-600" />
            New Assignment
          </Button>
        </Link>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        {/* Notifications */}
        <Link href="/trainer">
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white font-medium">
              4
            </span>
          </Button>
        </Link>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 px-2 h-8" />}>
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] font-bold bg-emerald-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium max-w-[130px] truncate">
              {trainerName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{trainerName}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "ahmed.hassan@mhit.edu.pk"}</p>
              <div className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                Senior Faculty Trainer
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/trainer" className="flex items-center w-full">
                <BookOpen className="h-4 w-4 me-2 text-muted-foreground" /> My Assigned Batches
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/trainer/profile" className="flex items-center w-full">
                <User className="h-4 w-4 me-2 text-muted-foreground" /> Faculty Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 me-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
