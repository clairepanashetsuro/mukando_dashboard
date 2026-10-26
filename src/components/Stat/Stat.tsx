import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import "./Stat.css";

export function StatGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className ? `stats ${className}` : "stats"}>{children}</div>
  );
}

export function Stat({
  label,
  value,
  tone,
  hint,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  tone?: string;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className={`stat ${tone || ""}`}>
      <div className="stat-head">
        <div className="stat-label">{label}</div>
        {Icon && (
          <span className="stat-icon">
            <Icon size={26} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}
