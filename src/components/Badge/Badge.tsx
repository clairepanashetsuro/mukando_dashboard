import {
  CircleCheck,
  CircleDot,
  CircleX,
  Clock,
  Hourglass,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./Badge.css";

const BADGE_ICONS: Record<string, LucideIcon> = {
  active: CircleDot,
  paid: CircleCheck,
  overdue: Clock,
  pending: Hourglass,
  defaulted: CircleX,
};

export function Badge({ value }: { value: string }) {
  const key = String(value).toLowerCase();
  const Icon = BADGE_ICONS[key];
  return (
    <span className={`badge ${key}`}>
      {Icon && <Icon size={14} aria-hidden="true" />}
      {value}
    </span>
  );
}
