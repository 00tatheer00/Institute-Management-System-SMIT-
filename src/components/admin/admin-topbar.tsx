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
import { Bell, LogOut, Settings, User } from "lucide-react";

export function AdminTopbar() {
  const { user, logout } = useAuth();
  const t = useTranslations();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-20 h-16 bg-background/95 backdrop-blur-sm border-b flex items-center justify-between px-4 lg:px-6">
      {/* Left — spacer for mobile menu button */}
      <div className="lg:hidden w-10" />

      {/* Center — page context (breadcrumbs go in page, not here) */}
      <div className="flex-1" />

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        {/* Notifications */}
        <Link href="/admin/communications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white font-medium">
              3
            </span>
          </Button>
        </Link>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 px-2" />}>
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
              {user?.name || "Admin"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/admin/settings" className="flex items-center w-full"><User className="h-4 w-4 me-2" /> {t("student.nav.profile")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/settings" className="flex items-center w-full"><Settings className="h-4 w-4 me-2" /> {t("admin.nav.settings")}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 me-2" /> {t("auth.login.signIn") === "Sign In" ? "Logout" : "لاگ آؤٹ"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
