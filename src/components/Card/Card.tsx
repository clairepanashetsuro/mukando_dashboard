import type { ReactNode } from "react";
import "./Card.css";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className ? `card ${className}` : "card"}>{children}</div>
  );
}
