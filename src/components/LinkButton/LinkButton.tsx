import type { ButtonHTMLAttributes } from "react";
import "./LinkButton.css";

export function LinkButton({
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className="link" {...rest} />;
}
