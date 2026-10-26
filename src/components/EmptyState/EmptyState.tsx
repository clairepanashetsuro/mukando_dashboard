import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Illustration } from "@/components/Illustration/Illustration";
import type { IllustrationKey } from "@/lib/illustrations";
import "./EmptyState.css";

export function EmptyState({
  icon: Icon,
  art,
  children,
}: {
  icon?: LucideIcon;
  art?: IllustrationKey;
  children: ReactNode;
}) {
  return (
    <div className="empty-state">
      {art && <Illustration name={art} className="empty-state-art" />}
      {Icon && (
        <Icon className="empty-state-icon" size={28} aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
}
