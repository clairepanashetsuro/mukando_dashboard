"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell/AppShell";
import { AccountPage } from "@/features/account/AccountPage/AccountPage";
import { ContributionsPage } from "@/features/member/ContributionsPage/ContributionsPage";
import { LoansPage } from "@/features/member/LoansPage/LoansPage";
import { OverviewPage } from "@/features/member/OverviewPage/OverviewPage";
import { RepaymentsPage } from "@/features/member/RepaymentsPage/RepaymentsPage";
import type { ScaffoldProps, TabKey, TabTuple } from "./scaffold.types";

const MEMBER_TABS: readonly TabTuple[] = [
  ["overview", "Overview"],
  ["loans", "My loans"],
  ["contributions", "Contributions"],
  ["repayments", "Repayments"],
  ["account", "Account"],
];

export function MemberScaffold({ user, setUser, onLogout }: ScaffoldProps) {
  const renderPage = (tab: TabKey): ReactNode => {
    if (tab === "account")
      return (
        <AccountPage user={user} onUserChange={setUser} onLogout={onLogout} />
      );
    return (
      {
        overview: <OverviewPage user={user} />,
        loans: <LoansPage />,
        contributions: <ContributionsPage />,
        repayments: <RepaymentsPage />,
      } as Partial<Record<TabKey, ReactNode>>
    )[tab];
  };
  return (
    <AppShell
      user={user}
      roleLabel="Member"
      tabs={MEMBER_TABS}
      renderPage={renderPage}
      onLogout={onLogout}
    />
  );
}
