import type { ReactNode } from "react";
import "./Notice.css";

export function Notice({
  tone,
  children,
}: {
  tone?: "warn";
  children: ReactNode;
}) {
  return <div className={tone ? `notice ${tone}` : "notice"}>{children}</div>;
}
