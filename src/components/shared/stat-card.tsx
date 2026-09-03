import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
  className,
  accentColor,
}: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden group hover-lift", className)}>
      {/* Gradient accent bar */}
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-1 transition-all duration-500 group-hover:h-1.5",
          accentColor || "gradient-brand"
        )}
      />

      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1.5 text-sm">
                {trend === "up" && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-xs font-semibold">+{change}%</span>
                  </div>
                )}
                {trend === "down" && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-50 text-red-500">
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span className="text-xs font-semibold">{change}%</span>
                  </div>
                )}
                {trend === "neutral" && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted">
                    <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground">{change}%</span>
                  </div>
                )}
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className="rounded-xl bg-gradient-to-br from-brand/10 to-brand/5 p-3 text-brand transition-all duration-300 group-hover:shadow-glow-sm group-hover:scale-110">
            {icon}
          </div>
        </div>
      </CardContent>

      {/* Subtle background decoration */}
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-brand/3 transition-transform duration-500 group-hover:scale-150" />
    </Card>
  );
}
