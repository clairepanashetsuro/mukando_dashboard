"use client";

import { HandCoins, PiggyBank, Receipt, Users, Wallet } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorBox } from "@/components/ErrorBox/ErrorBox";
import { Illustration } from "@/components/Illustration/Illustration";
import { PageHead } from "@/components/PageHead/PageHead";
import { Stat, StatGrid } from "@/components/Stat/Stat";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import type { AvailableFunds, Summary } from "@/lib/types";
import "./OverviewPage.css";

export function OverviewPage() {
  const summary = useFetch(() => api.get<Summary>("/reports/summary"), []);
  const funds = useFetch(
    () => api.get<AvailableFunds>("/finance/available-funds"),
    [],
  );
  const s = summary.data;
  const total = s
    ? s.active_loans + s.overdue_loans + s.defaulted_loans + s.paid_loans
    : 0;
  const bar = (n: number, cls: string) =>
    total ? (
      <div
        className={`seg ${cls}`}
        style={{ width: `${(n / total) * 100}%` }}
        title={`${cls}: ${n}`}
      />
    ) : null;
  return (
    <>
      <PageHead
        title="Overview"
        subtitle="Your group's finances at a glance"
        action={
          <Illustration name="gathering" className="treasurer-overview-art" />
        }
      />
      <ErrorBox
        message={summary.error || funds.error}
        onRetry={() => {
          summary.reload();
          funds.reload();
        }}
      />
      <StatGrid>
        <Stat icon={Users} label="Members" value={s ? s.members : "…"} />
        <Stat
          icon={PiggyBank}
          label="Total contributions"
          value={s ? money(s.total_contributions) : "…"}
        />
        <Stat
          icon={Receipt}
          label="Total repayments"
          value={s ? money(s.total_repayments) : "…"}
        />
        <Stat
          icon={HandCoins}
          label="Outstanding loans"
          value={s ? money(s.outstanding_loans) : "…"}
          tone="warn"
        />
        <Stat
          icon={Wallet}
          label="Available to lend"
          value={funds.data ? money(funds.data.available_funds) : "…"}
          tone="good"
          hint="Contributions + repayments − principal lent"
        />
      </StatGrid>
      <Card>
        <h3>Loan portfolio</h3>
        {s && total === 0 && (
          <EmptyState art="circleOfHands">No loans yet.</EmptyState>
        )}
        {s && total > 0 && (
          <>
            <div className="bar">
              {bar(s.paid_loans, "paid")}
              {bar(s.active_loans, "active")}
              {bar(s.overdue_loans, "overdue")}
              {bar(s.defaulted_loans, "defaulted")}
            </div>
            <div className="legend">
              <span>
                <i className="dot paid" /> Paid {s.paid_loans}
              </span>
              <span>
                <i className="dot active" /> Active {s.active_loans}
              </span>
              <span>
                <i className="dot overdue" /> Overdue {s.overdue_loans}
              </span>
              <span>
                <i className="dot defaulted" /> Defaulted {s.defaulted_loans}
              </span>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
