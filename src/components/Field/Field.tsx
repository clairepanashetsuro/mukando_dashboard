import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import "./Field.css";

export function Field({
  label,
  children,
  hint,
  icon: Icon,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {Icon ? (
        <span className="field-control">
          <Icon size={20} aria-hidden="true" />
          {children}
        </span>
      ) : (
        children
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}
