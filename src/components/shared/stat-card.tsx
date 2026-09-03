import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type StatVariant = "blue" | "emerald" | "purple" | "amber" | "rose" | "indigo" | "default";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  accentColor?: string;
  variant?: StatVariant;
}

const variantStyles: Record<StatVariant, { card: string; iconBg: string; textAccent: string; pill: string }> = {
  blue: {
    card: "bg-gradient-to-br from-sky-500/10 via-white to-blue-500/5 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-slate-900 border-sky-200/70 dark:border-sky-800/40",
    iconBg: "bg-sky-500/15 text-[#0071e3] dark:text-sky-400 ring-1 ring-sky-500/20",
    textAccent: "text-[#0071e3] dark:text-sky-400",
    pill: "bg-sky-500/15 text-[#0071e3] dark:text-sky-300",
  },
  emerald: {
    card: "bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900 border-emerald-200/70 dark:border-emerald-800/40",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  purple: {
    card: "bg-gradient-to-br from-purple-500/10 via-white to-indigo-500/5 dark:from-purple-950/40 dark:via-slate-900/60 dark:to-slate-900 border-purple-200/70 dark:border-purple-800/40",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20",
    textAccent: "text-purple-600 dark:text-purple-400",
    pill: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  },
  amber: {
    card: "bg-gradient-to-br from-amber-500/10 via-white to-orange-500/5 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-slate-900 border-amber-200/70 dark:border-amber-800/40",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20",
    textAccent: "text-amber-600 dark:text-amber-400",
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  rose: {
    card: "bg-gradient-to-br from-rose-500/10 via-white to-pink-500/5 dark:from-rose-950/40 dark:via-slate-900/60 dark:to-slate-900 border-rose-200/70 dark:border-rose-800/40",
    iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20",
    textAccent: "text-rose-600 dark:text-rose-400",
    pill: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
  indigo: {
    card: "bg-gradient-to-br from-indigo-500/10 via-white to-sky-500/5 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-slate-900 border-indigo-200/70 dark:border-indigo-800/40",
    iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20",
    textAccent: "text-indigo-600 dark:text-indigo-400",
    pill: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
  default: {
    card: "bg-gradient-to-br from-slate-100/60 via-white to-slate-50/40 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950 border-slate-200/70 dark:border-slate-800/70",
    iconBg: "bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    textAccent: "text-slate-700 dark:text-slate-300",
    pill: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  },
};

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
  className,
  accentColor,
  variant,
}: StatCardProps) {
  // Infer variant from accentColor if variant is not explicitly provided
  let selectedVariant: StatVariant = variant || "default";
  if (!variant && accentColor) {
    if (accentColor.includes("blue") || accentColor.includes("sky")) selectedVariant = "blue";
    else if (accentColor.includes("emerald") || accentColor.includes("teal") || accentColor.includes("green")) selectedVariant = "emerald";
    else if (accentColor.includes("purple") || accentColor.includes("violet")) selectedVariant = "purple";
    else if (accentColor.includes("amber") || accentColor.includes("orange") || accentColor.includes("yellow")) selectedVariant = "amber";
    else if (accentColor.includes("rose") || accentColor.includes("red")) selectedVariant = "rose";
    else if (accentColor.includes("indigo")) selectedVariant = "indigo";
  }

  const v = variantStyles[selectedVariant] || variantStyles.default;

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group",
        v.card,
        className
      )}
    >
      {/* Decorative Apple Soft Blur Glow in Corner */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/40 dark:bg-white/5 blur-2xl pointer-events-none" />

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
              {value}
            </p>

            {change !== undefined && (
              <div className="flex items-center gap-1.5 pt-0.5">
                {trend === "up" && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{change}%</span>
                  </div>
                )}
                {trend === "down" && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 font-bold text-[11px]">
                    <TrendingDown className="h-3 w-3" />
                    <span>{change}%</span>
                  </div>
                )}
                {trend === "neutral" && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[11px]">
                    <Minus className="h-3 w-3" />
                    <span>{change}%</span>
                  </div>
                )}
                {changeLabel && (
                  <span className="text-[10.5px] text-slate-400 truncate font-medium">{changeLabel}</span>
                )}
              </div>
            )}
          </div>

          {/* Apple Glass Icon Pill */}
          <div
            className={cn(
              "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110",
              v.iconBg
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
