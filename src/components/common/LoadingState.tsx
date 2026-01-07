import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  variant?: "spinner" | "skeleton" | "dots";
  text?: string;
  className?: string;
}

export function LoadingState({ 
  variant = "spinner", 
  text = "Loading...",
  className 
}: LoadingStateProps) {
  if (variant === "spinner") {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center py-12 gap-3",
        className
      )}>
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn(
        "flex items-center justify-center py-12 gap-2",
        className
      )}>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 py-4", className)}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

// Skeleton variants for specific content types
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-lg p-4 space-y-4", className)}>
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      
      {/* Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
