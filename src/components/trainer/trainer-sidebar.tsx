"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { trainerNavItems } from "@/lib/config/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutDashboard, BookOpen, Layers, GraduationCap,
  Calendar, CheckSquare, FileText, HelpCircle, BarChart3,
  FolderOpen, Megaphone, UserCircle, Menu, ChevronLeft,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />,
  GraduationCap: <GraduationCap className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  CheckSquare: <CheckSquare className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  HelpCircle: <HelpCircle className="h-4 w-4" />,
  BarChart3: <BarChart3 className="h-4 w-4" />,
  FolderOpen: <FolderOpen className="h-4 w-4" />,
  Megaphone: <Megaphone className="h-4 w-4" />,
  UserCircle: <UserCircle className="h-4 w-4" />,
};

function TrainerSidebarContent({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === "/trainer") return pathname === fullPath;
    return pathname.startsWith(fullPath);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border shrink-0", collapsed && "justify-center px-2")}>
        <Link href="/trainer" className="flex items-center gap-2.5" onClick={onNavClick}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <BookOpen className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-sidebar-foreground leading-tight truncate">
                MHIT × SMIT
              </p>
              <p className="text-[10px] text-sidebar-foreground/60 leading-tight">
                Trainer Portal
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Items */}
      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-1 px-2">
          {trainerNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? t(item.titleKey) : undefined}
              >
                {item.icon && iconMap[item.icon]}
                {!collapsed && <span className="truncate">{t(item.titleKey)}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

export function TrainerSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 start-0 z-30 bg-sidebar text-sidebar-foreground border-e border-sidebar-border transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <TrainerSidebarContent collapsed={collapsed} />
        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <Sheet>
        <SheetTrigger className="lg:hidden fixed top-3 start-3 z-40 inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-muted">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground">
          <SheetTitle className="sr-only">Trainer Navigation</SheetTitle>
          <TrainerSidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Spacer */}
      <div className={cn("hidden lg:block shrink-0 transition-all duration-200", collapsed ? "w-16" : "w-64")} />
    </>
  );
}
