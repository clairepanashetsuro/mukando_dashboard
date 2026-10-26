"use client";

import { Gauge, PiggyBank, Receipt, Wallet } from "lucide-react";
import { ErrorBox } from "@/components/ErrorBox/ErrorBox";
import { Illustration } from "@/components/Illustration/Illustration";
import { PageHead } from "@/components/PageHead/PageHead";
import { Stat, StatGrid } from "@/components/Stat/Stat";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import type { Group, MyReport, User } from "@/lib/types";
import "./OverviewPage.css";

export function OverviewPage({ user }: { user: User }) {
  const me = useFetch(() => api.get<MyReport>("/reports/me"), []);
  const group = useFetch(() => api.get<Group>("/groups/me"), []);
  const s = me.data;
  return (
    <>
      <PageHead
        title={`Welcome, ${user.full_name.split(" ")[0]}`}
        subtitle={group.data ? `Member of ${group.data.name}` : ""}
        action={<Illustration name="growth" className="member-overview-art" />}
      />
      <ErrorBox message={me.error} onRetry={me.reload} />
      <StatGrid className="member-overview-stats">
        <Stat
          icon={PiggyBank}
          label="Total contributed"
          value={s ? money(s.total_contributions) : "…"}
          tone="good"
        />
        <Stat
          icon={Receipt}
          label="Total repaid"
          value={s ? money(s.total_repayments) : "…"}
        />
        <Stat
          icon={Wallet}
          label="Outstanding balance"
          value={s ? money(s.outstanding_balance) : "…"}
          tone={s && s.outstanding_balance > 0 ? "warn" : ""}
          hint={
            s
              ? `${s.outstanding_loans} open loan${s.outstanding_loans === 1 ? "" : "s"}`
              : ""
          }
        />
        <Stat
          icon={Gauge}
          label="Borrowing limit"
          value={s ? money(s.total_contributions * 2) : "…"}
          hint="2× your contributions"
        />
      </StatGrid>
    </>
  );
}
