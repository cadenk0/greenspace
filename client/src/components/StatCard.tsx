import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ label, value, icon, className, trend }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-card rounded-3xl p-6 border border-border/50 shadow-sm",
        "hover:shadow-md transition-all duration-300 group",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        {icon}
      </div>
      
      <div className="relative z-10">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-display font-bold text-foreground">
            {value}
          </h3>
          {trend === "up" && (
            <span className="text-xs font-bold text-primary mb-1.5 bg-primary/10 px-1.5 py-0.5 rounded-full">
              +12%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
