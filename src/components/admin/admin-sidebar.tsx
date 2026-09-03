"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { adminNavGroups } from "@/lib/config/navigation";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, GraduationCap, ClipboardList, BookOpen, Layers,
  Calendar, CheckSquare, FileText, HelpCircle, BarChart3, Award,
  Users, UserCog, DoorOpen, CalendarDays, Image, Megaphone,
  PieChart, Settings, Menu, ChevronLeft, Upload, History, Send,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  GraduationCap: <GraduationCap className="h-4 w-4" />,
  ClipboardList: <ClipboardList className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  CheckSquare: <CheckSquare className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  HelpCircle: <HelpCircle className="h-4 w-4" />,
  BarChart3: <BarChart3 className="h-4 w-4" />,
  Award: <Award className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  UserCog: <UserCog className="h-4 w-4" />,
  DoorOpen: <DoorOpen className="h-4 w-4" />,
  CalendarDays: <CalendarDays className="h-4 w-4" />,
  Image: <Image className="h-4 w-4" />,
  Megaphone: <Megaphone className="h-4 w-4" />,
  PieChart: <PieChart className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
  Upload: <Upload className="h-4 w-4" />,
  History: <History className="h-4 w-4" />,
  Send: <Send className="h-4 w-4" />,
};

function SidebarContent({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const { user } = useAuth();
  const isStaff = user?.role === "staff";

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === "/admin") return pathname === fullPath;
    return pathname.startsWith(fullPath);
  };

  // Role-based navigation scoping: Staff sees only operational modules
  const visibleGroups = adminNavGroups
    .map((group) => {
      if (!isStaff) return group;

      const filteredItems = group.items.filter((item) => {
        if (item.href === "/admin/roles") return false;
        if (item.href === "/admin/audit-logs") return false;
        if (item.href === "/admin/data-management") return false;
        if (item.href === "/admin/settings") return false;
        if (item.href === "/admin/finance") return false;
        if (item.href === "/admin/import" || item.href === "/admin/imports") return false;
        return true;
      });

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border/50 shrink-0", collapsed && "justify-center px-2")}>
        <Link href="/admin" className="flex items-center gap-2.5 group" onClick={onNavClick}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-brand transition-all duration-300 group-hover:shadow-lifted group-hover:scale-105">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-sidebar-foreground leading-tight truncate">MHIT × SMIT</p>
              <p className="text-[10px] text-sidebar-foreground/50 leading-tight">
                {isStaff ? "Staff Operations" : "Admin Panel"}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-5 px-2">
          {visibleGroups.map((group) => (
            <div key={group.titleKey}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
                  {t(group.titleKey)}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavClick}
                      className={cn(
                        "group/item flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 relative",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm nav-active-indicator"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? t(item.titleKey) : undefined}
                    >
                      <span className={cn(
                        "transition-all duration-200",
                        active ? "text-sidebar-primary" : "group-hover/item:text-sidebar-primary",
                        !active && "group-hover/item:scale-110"
                      )}>
                        {item.icon && iconMap[item.icon]}
                      </span>
                      {!collapsed && <span className="truncate">{t(item.titleKey)}</span>}
                      {!collapsed && item.badge && (
                        <span className="ms-auto text-[10px] font-medium bg-sidebar-primary text-sidebar-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center shadow-sm animate-pulse-glow">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 start-0 z-30 glass-sidebar text-sidebar-foreground border-e border-sidebar-border/30 transition-all duration-300 ease-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent collapsed={collapsed} />
        <div className="border-t border-sidebar-border/30 p-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-8 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 transition-all duration-200"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger className="lg:hidden fixed top-3 start-3 z-40 inline-flex items-center justify-center rounded-lg h-9 w-9 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-muted transition-all">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 glass-sidebar text-sidebar-foreground border-0 shadow-depth">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Spacer for main content */}
      <div className={cn("hidden lg:block shrink-0 transition-all duration-300", collapsed ? "w-16" : "w-64")} />
    </>
  );
}
