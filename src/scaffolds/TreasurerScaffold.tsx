"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell/AppShell";
import { AccountPage } from "@/features/account/AccountPage/AccountPage";
import { ContributionsPage } from "@/features/treasurer/ContributionsPage/ContributionsPage";
import { GroupPage } from "@/features/treasurer/GroupPage/GroupPage";
import { LoansPage } from "@/features/treasurer/LoansPage/LoansPage";
import { MembersPage } from "@/features/treasurer/MembersPage/MembersPage";
import { OverviewPage } from "@/features/treasurer/OverviewPage/OverviewPage";
import { RepaymentsPage } from "@/features/treasurer/RepaymentsPage/RepaymentsPage";
import type { ScaffoldProps, TabKey, TabTuple } from "./scaffold.types";

const TREASURER_TABS: readonly TabTuple[] = [
  ["overview", "Overview"],
  ["members", "Members"],
  ["contributions", "Contributions"],
  ["loans", "Loans"],
  ["repayments", "Repayments"],
  ["group", "Group"],
  ["account", "Account"],
];

export function TreasurerScaffold({ user, setUser, onLogout }: ScaffoldProps) {
  const renderPage = (tab: TabKey): ReactNode => {
    if (tab === "account")
      return (
        <AccountPage user={user} onUserChange={setUser} onLogout={onLogout} />
      );
    return (
      {
        overview: <OverviewPage />,
        members: <MembersPage />,
        contributions: <ContributionsPage />,
        loans: <LoansPage />,
        repayments: <RepaymentsPage />,
        group: <GroupPage />,
      } as Partial<Record<TabKey, ReactNode>>
    )[tab];
  };
  return (
    <AppShell
      user={user}
      roleLabel="Treasurer"
      tabs={TREASURER_TABS}
      renderPage={renderPage}
      onLogout={onLogout}
    />
  );
}
