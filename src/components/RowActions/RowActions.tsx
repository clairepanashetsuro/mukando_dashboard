import type { ReactNode } from "react";
import "./RowActions.css";

export function RowActions({ children }: { children: ReactNode }) {
  return <div className="row-actions">{children}</div>;
}
