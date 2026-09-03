import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function PageHeader({ title, description, breadcrumbs, actions, className, gradient }: PageHeaderProps) {
  return (
    <div className={cn("space-y-2 animate-fade-in", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="animate-slide-in-right">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <span key={item.label} className="contents">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href} className="hover:text-brand transition-colors">{item.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className={cn(
            "text-2xl font-bold tracking-tight lg:text-3xl",
            gradient && "gradient-text"
          )}>
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
