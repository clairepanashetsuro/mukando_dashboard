import "./ProgressDots.css";

export function ProgressDots({
  count,
  current,
}: {
  count: number;
  current: number;
}) {
  return (
    <div
      className="progress-dots"
      role="img"
      aria-label={`Slide ${current + 1} of ${count}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={i === current ? "progress-dot active" : "progress-dot"}
        />
      ))}
    </div>
  );
}
