"use client";

import { Menu, X } from "lucide-react";
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

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user.must_change_password) {
      setTab("account");
    }
  }, [user.must_change_password]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const selectTab = (nextTab: TabKey) => {
    setTab(nextTab);
    setMenuOpen(false);
  };

  return (
    <div className="shell">
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="dashboard-sidebar"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <span className="mobile-header-title">Mukando</span>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        roleLabel={roleLabel}
        tabs={tabs}
        active={tab}
        onSelect={selectTab}
        onLogout={onLogout}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="main" key={tab}>
        {renderPage(tab)}
      </main>
    </div>
  );
}
