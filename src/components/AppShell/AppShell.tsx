"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import type { User } from "@/lib/types";
import type { TabKey, TabTuple } from "@/scaffolds/scaffold.types";
import "./AppShell.css";

interface AppShellProps {
  user: User;
  roleLabel: string;
  tabs: readonly TabTuple[];
  renderPage: (tab: TabKey) => ReactNode;
  onLogout: () => Promise<void>;
}

export function AppShell({
  user,
  roleLabel,
  tabs: allTabs,
  renderPage,
  onLogout,
}: AppShellProps) {
  const tabs = user.must_change_password
    ? allTabs.filter(([key]) => key === "account")
    : allTabs;
  const [tab, setTab] = useState<TabKey>(
    user.must_change_password ? "account" : "overview",
  );
  useEffect(() => {
    if (user.must_change_password) setTab("account");
  }, [user.must_change_password]);

  return (
    <div className="shell">
      <Sidebar
        user={user}
        roleLabel={roleLabel}
        tabs={tabs}
        active={tab}
        onSelect={setTab}
        onLogout={onLogout}
      />
      <main className="main" key={tab}>
        {renderPage(tab)}
      </main>
    </div>
  );
}
