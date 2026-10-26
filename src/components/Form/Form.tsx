import type { FormEventHandler, ReactNode } from "react";
import "@/components/Card/Card.css";
import "./Form.css";

export function Form({
  onSubmit,
  className,
  children,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={className ? `form ${className}` : "form"}
    >
      {children}
    </form>
  );
}

export function FormCard({
  onSubmit,
  title,
  className,
  children,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`card form narrow${className ? ` ${className}` : ""}`}
    >
      {title && <h3>{title}</h3>}
      {children}
    </form>
  );
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div className="form-actions">{children}</div>;
}
