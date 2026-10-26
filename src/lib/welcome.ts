import { hasTokens } from "./api";

const WELCOME_KEY = "mukando_welcome_seen";

function readSeen(): boolean {
  try {
    return localStorage.getItem(WELCOME_KEY) === "1";
  } catch {
    return false;
  }
}

function clearSeen() {
  try {
    localStorage.removeItem(WELCOME_KEY);
  } catch {
    return;
  }
}

export function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_KEY, "1");
  } catch {
    return;
  }
}

export function shouldShowWelcome(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.get("token")) return false;
  if (params.get("welcome") === "reset") {
    clearSeen();
    params.delete("welcome");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (query ? `?${query}` : ""),
    );
    return true;
  }
  if (hasTokens()) {
    markWelcomeSeen();
    return false;
  }
  return !readSeen();
}
