import { Button } from "@/components/Button/Button";
import "./ErrorBox.css";

export function ErrorBox({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  if (!message) return null;
  return (
    <div className="error-box" role="alert">
      <span>{message}</span>
      {onRetry && (
        <Button small onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
