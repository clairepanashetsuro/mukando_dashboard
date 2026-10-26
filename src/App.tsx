"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthPage } from "@/features/auth/AuthPage/AuthPage";
import { BootScreen } from "@/components/BootScreen/BootScreen";
import { WelcomePage } from "@/features/welcome/WelcomePage/WelcomePage";
import { ToastProvider } from "@/components/Toast/Toast";
import { api, hasTokens, setAuthLostHandler } from "@/lib/api";
import type { User } from "@/lib/types";
import { markWelcomeSeen, shouldShowWelcome } from "@/lib/welcome";
import { RoleScaffold } from "@/scaffolds/RoleScaffold";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [booting, setBooting] = useState(hasTokens());
  const [welcome, setWelcome] = useState(() => shouldShowWelcome());
  const resetToken = new URLSearchParams(window.location.search).get("token");

  const loadUser = useCallback(async () => {
    setUser(await api.get<User>("/users/me"));
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    setAuthLostHandler(() => setUser(null));
    if (hasTokens()) {
      loadUser()
        .catch(() => setUser(null))
        .finally(() => setBooting(false));
    }
  }, [loadUser]);

  if (booting) return <BootScreen />;

  if (!user && welcome) {
    return (
      <WelcomePage
        onDone={() => {
          markWelcomeSeen();
          setWelcome(false);
        }}
      />
    );
  }

  return (
    <ToastProvider>
      {user ? (
        <RoleScaffold user={user} setUser={setUser} onLogout={logout} />
      ) : (
        <AuthPage onDone={loadUser} resetToken={resetToken} />
      )}
    </ToastProvider>
  );
}
