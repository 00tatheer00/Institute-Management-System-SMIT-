"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { studentNavItems } from "@/lib/config/navigation";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  FileText,
  HelpCircle,
  BarChart3,
  FolderOpen,
  Rocket,
  Award,
  Megaphone,
  UserCircle,
  Settings,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  CreditCard,
  LogOut,
  Briefcase,
  LifeBuoy,
  HeartHandshake,
  Bell,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  CheckSquare: <CheckSquare className="h-4 w-4" />,
  CreditCard: <CreditCard className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  HelpCircle: <HelpCircle className="h-4 w-4" />,
  BarChart3: <BarChart3 className="h-4 w-4" />,
  FolderOpen: <FolderOpen className="h-4 w-4" />,
  Rocket: <Rocket className="h-4 w-4" />,
  Award: <Award className="h-4 w-4" />,
  Briefcase: <Briefcase className="h-4 w-4" />,
  LifeBuoy: <LifeBuoy className="h-4 w-4" />,
  HeartHandshake: <HeartHandshake className="h-4 w-4" />,
  Bell: <Bell className="h-4 w-4" />,
  Megaphone: <Megaphone className="h-4 w-4" />,
  UserCircle: <UserCircle className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
};

function StudentSidebarContent({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === "/student") return pathname === fullPath;
    return pathname.startsWith(fullPath);
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* ─── Apple macOS Header ─── */}
      <div className={cn("px-4 pt-4 pb-3 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0", collapsed && "px-2 text-center")}>
        {!collapsed && (
          <div className="flex items-center gap-2 mb-3">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-xs" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-xs" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-xs" />
            <span className="text-[10px] font-mono font-semibold text-slate-400 ml-auto uppercase tracking-wider">
              Student Space
            </span>
          </div>
        )}

        <Link href="/student" className="flex items-center gap-2.5 group cursor-pointer" onClick={onNavClick}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284c7] via-[#0ea5e9] to-[#10b981] text-white shadow-md shadow-[#0284c7]/20 transition-all duration-300 group-hover:scale-105">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  SMIT
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-[#0284c7] dark:text-sky-300">
                  STUDENT
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 leading-tight pt-0.5 truncate">
                Learner Portal
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* ─── Navigation Items with Visible macOS Scrollbar ─── */}
      <div className="flex-1 min-h-0 overflow-y-auto mac-scrollbar py-3 px-2">
        <nav className="space-y-1">
          {studentNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  "group/item flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer relative",
                  active
                    ? "bg-white dark:bg-slate-800 text-[#0284c7] dark:text-sky-400 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white",
                  item.href === "/student/card" && !active && "text-[#0284c7] dark:text-sky-400 font-bold",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? t(item.titleKey) : undefined}
              >
                <span className={cn(
                  "transition-transform duration-200",
                  active ? "text-[#0284c7] dark:text-sky-400" : "text-slate-400 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-200",
                  !active && "group-hover/item:scale-105"
                )}>
                  {item.icon && iconMap[item.icon]}
                </span>
                {!collapsed && <span className="truncate">{t(item.titleKey)}</span>}
                {!collapsed && item.href === "/student/card" && (
                  <span className="ml-auto text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Smart ID
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ─── Bottom Profile Footer Card ─── */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0284c7] to-[#10b981] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "ST"}
                </div>
                <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">
                  {user?.name || "Hamza Khan"}
                </p>
                <p className="text-[10px] text-sky-600 font-mono font-semibold leading-tight">
                  SMIT-2026-84920
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StudentSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 start-0 z-30 bg-slate-100/70 dark:bg-slate-950/70 backdrop-blur-2xl border-r border-slate-200/70 dark:border-slate-800/70 transition-all duration-300 ease-out shadow-[0_4px_24px_rgba(0,0,0,0.03)] h-screen overflow-hidden",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <StudentSidebarContent collapsed={collapsed} />
        <div className="border-t border-slate-200/60 dark:border-slate-800/60 p-2 flex justify-center shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer rounded-xl"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger className="lg:hidden fixed top-3.5 start-3.5 z-40 inline-flex items-center justify-center rounded-xl h-9 w-9 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-100 transition-all cursor-pointer">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-2xl border-0 shadow-2xl h-screen overflow-hidden flex flex-col">
          <SheetTitle className="sr-only">Student Navigation</SheetTitle>
          <StudentSidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>

      <div className={cn("hidden lg:block shrink-0 transition-all duration-300", collapsed ? "w-16" : "w-64")} />
    </>
  );
}
