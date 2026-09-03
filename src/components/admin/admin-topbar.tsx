"use client";

import { useAuth } from "@/lib/auth/context";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
import { Bell, LogOut, Settings, User, Search } from "lucide-react";

export function AdminTopbar() {
  const { user, logout } = useAuth();
  const t = useTranslations();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-20 h-16 glass-header flex items-center justify-between px-4 lg:px-6">
      {/* Left — spacer for mobile menu button */}
      <div className="lg:hidden w-10" />

      {/* Center — search (visual enhancement) */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-brand" />
          <input
            type="text"
            placeholder="Search students, courses, batches..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-transparent text-sm placeholder:text-muted-foreground/40 transition-all duration-200 focus:bg-background focus:border-brand/30 focus:shadow-glow-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        {/* Notifications */}
        <Link href="/admin/communications">
          <Button variant="ghost" size="icon" className="relative group transition-all duration-200 hover:bg-brand/5">
            <Bell className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110" />
            <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white font-medium shadow-sm">
              <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-30" />
              <span className="relative">3</span>
            </span>
          </Button>
        </Link>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 px-2 hover:bg-brand/5 transition-all duration-200" />}>
            <Avatar className="h-8 w-8 ring-2 ring-brand/20 transition-all duration-200 hover:ring-brand/40">
              <AvatarFallback className="text-[10px] font-bold gradient-brand text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
              {user?.name || "Admin"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 glass-card border-0 shadow-depth">
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="transition-colors hover:bg-brand/5">
              <Link href="/admin/settings" className="flex items-center w-full"><User className="h-4 w-4 me-2" /> {t("student.nav.profile")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="transition-colors hover:bg-brand/5">
              <Link href="/admin/settings" className="flex items-center w-full"><Settings className="h-4 w-4 me-2" /> {t("admin.nav.settings")}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive transition-colors">
              <LogOut className="h-4 w-4 me-2" /> {t("auth.login.signIn") === "Sign In" ? "Logout" : "لاگ آؤٹ"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
