import "./Logo.css";

export function Logo({
  size = 64,
  animated,
}: {
  size?: number;
  animated?: boolean;
}) {
  return (
    <svg
      className={animated ? "logo logo-animated" : "logo"}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="logo-a" cx="22" cy="40" r="14" />
      <circle className="logo-b" cx="42" cy="40" r="14" />
      <circle className="logo-c" cx="32" cy="23" r="14" />
    </svg>
  );
}
