import { cn } from "@/lib/utils";
import { SearchX, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center animate-fade-in", className)}>
      <div className="rounded-2xl bg-gradient-to-br from-muted to-muted/50 p-5 mb-4 animate-float-slow shadow-sm">
        {icon || <FolderOpen className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="glow" className="mt-4" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function NoSearchResults({ query, className }: { query?: string; className?: string }) {
  return (
    <EmptyState
      icon={<SearchX className="h-10 w-10 text-muted-foreground" />}
      title="No results found"
      description={query ? `No results matching "${query}". Try adjusting your search or filters.` : "Try adjusting your search or filters."}
      className={className}
    />
  );
}
