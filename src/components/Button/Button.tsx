import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type ButtonVariant = "default" | "primary" | "danger" | "danger-outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  small?: boolean;
  block?: boolean;
  icon?: LucideIcon;
}

export function Button({
  variant = "default",
  small,
  block,
  icon: Icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    "btn",
    variant === "default" ? "" : variant,
    small ? "small" : "",
    block ? "block" : "",
    Icon ? "has-icon" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...rest}>
      {Icon && <Icon size={small ? 18 : 20} aria-hidden="true" />}
      {children}
    </button>
  );
}
