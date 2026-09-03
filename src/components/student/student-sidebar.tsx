"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { studentNavItems } from "@/lib/config/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutDashboard, BookOpen, Calendar, CheckSquare,
  FileText, HelpCircle, BarChart3, FolderOpen, Rocket,
  Award, Megaphone, UserCircle, Settings, Menu, ChevronLeft,
  GraduationCap
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  CheckSquare: <CheckSquare className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  HelpCircle: <HelpCircle className="h-4 w-4" />,
  BarChart3: <BarChart3 className="h-4 w-4" />,
  FolderOpen: <FolderOpen className="h-4 w-4" />,
  Rocket: <Rocket className="h-4 w-4" />,
  Award: <Award className="h-4 w-4" />,
  Megaphone: <Megaphone className="h-4 w-4" />,
  UserCircle: <UserCircle className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
};

function StudentSidebarContent({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === "/student") return pathname === fullPath;
    return pathname.startsWith(fullPath);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border/50 shrink-0", collapsed && "justify-center px-2")}>
        <Link href="/student" className="flex items-center gap-2.5 group" onClick={onNavClick}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-sidebar-foreground leading-tight truncate">
                MHIT × SMIT
              </p>
              <p className="text-[10px] text-sidebar-foreground/50 leading-tight">
                Student Portal
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Items */}
      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-1 px-2">
          {studentNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  "group/item flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 relative",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm nav-active-indicator"
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
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

export function StudentSidebar() {
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
        <StudentSidebarContent collapsed={collapsed} />
        {/* Collapse Toggle */}
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

      {/* Mobile Drawer */}
      <Sheet>
        <SheetTrigger className="lg:hidden fixed top-3 start-3 z-40 inline-flex items-center justify-center rounded-lg h-9 w-9 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-muted transition-all">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 glass-sidebar text-sidebar-foreground border-0 shadow-depth">
          <SheetTitle className="sr-only">Student Navigation</SheetTitle>
          <StudentSidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Spacer */}
      <div className={cn("hidden lg:block shrink-0 transition-all duration-300", collapsed ? "w-16" : "w-64")} />
    </>
  );
}
