"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import type { Analytics, AvailableFunds, Summary } from "@/lib/types";
import "./OverviewPage.css";

type Period = "all" | "month" | "3" | "6" | "12" | "custom";

const CHART_COLORS = [
  "#4776d0",
  "#23a58a",
  "#e6a23c",
  "#9566c5",
  "#dc6b72",
  "#4c9db8",
  "#8a9b45",
  "#d17c45",
];

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPeriodDates(period: Period) {
  const today = new Date();

  if (period === "all") {
    return { start: "", end: "" };
  }

  if (period === "custom") {
    return { start: "", end: "" };
  }

  const start =
    period === "month"
      ? new Date(today.getFullYear(), today.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth() - Number(period) + 1, 1);

  return {
    start: formatLocalDate(start),
    end: formatLocalDate(today),
  };
}

function DoughnutChart({
  title,
  data,
}: {
  title: string;
  data: { member_name: string; value: number }[];
}) {
  const chartData = data.filter((item) => item.value > 0);

  return (
    <Card>
      <h3>{title}</h3>
      {chartData.length === 0 ? (
        <EmptyState art="circleOfHands">
          No data available for this period.
        </EmptyState>
      ) : (
        <>
          <div className="donut-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="member_name"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.member_name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => money(Number(value ?? 0))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  );
}

export function OverviewPage() {
  const [period, setPeriod] = useState<Period>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const dates =
    period === "custom"
      ? { start: customStart, end: customEnd }
      : getPeriodDates(period);

  const queryParams = new URLSearchParams();

  if (dates.start) queryParams.set("start_date", dates.start);
  if (dates.end) queryParams.set("end_date", dates.end);

  const queryString = queryParams.toString();
  const analyticsUrl = `/reports/analytics${
    queryString ? `?${queryString}` : ""
  }`;

  const summary = useFetch(() => api.get<Summary>("/reports/summary"), []);

  const funds = useFetch(
    () => api.get<AvailableFunds>("/finance/available-funds"),
    [],
  );

  const analytics = useFetch(
    () => api.get<Analytics>(analyticsUrl),
    [analyticsUrl],
  );

  const s = summary.data;
  const a = analytics.data;

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

  const contributionData =
    a?.members.map((member) => ({
      member_name: member.member_name,
      value: member.contributions,
    })) ?? [];

  const loanData =
    a?.members.map((member) => ({
      member_name: member.member_name,
      value: member.loans_issued,
    })) ?? [];

  const repaymentData =
    a?.members.map((member) => ({
      member_name: member.member_name,
      value: member.repayments,
    })) ?? [];

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
        message={summary.error || funds.error || analytics.error}
        onRetry={() => {
          summary.reload();
          funds.reload();
          analytics.reload();
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

      <section className="analytics-section">
        <div className="analytics-heading">
          <div>
            <h2>Financial analytics</h2>
            <p>Explore your group's financial activity.</p>
          </div>

          <div className="period-filter">
            <label htmlFor="analytics-period">Reporting period</label>
            <select
              id="analytics-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
            >
              <option value="all">All time</option>
              <option value="month">This month</option>
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
        </div>

        {period === "custom" && (
          <div className="custom-date-filter">
            <label>
              From
              <input
                type="date"
                value={customStart}
                max={customEnd || undefined}
                onChange={(event) => setCustomStart(event.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={customEnd}
                min={customStart || undefined}
                onChange={(event) => setCustomEnd(event.target.value)}
              />
            </label>
          </div>
        )}

        {period === "custom" && (!customStart || !customEnd) ? (
          <Card>
            <p>Select both dates to view your custom reporting period.</p>
          </Card>
        ) : analytics.loading && !a ? (
          <Card>
            <p>Loading financial analytics...</p>
          </Card>
        ) : a ? (
          <>
            <div className="analytics-totals">
              <Card>
                <span>Total contributions</span>
                <strong>{money(a.totals.contributions)}</strong>
              </Card>
              <Card>
                <span>Loans issued</span>
                <strong>{money(a.totals.loans_issued)}</strong>
              </Card>
              <Card>
                <span>Repayments</span>
                <strong>{money(a.totals.repayments)}</strong>
              </Card>
            </div>

            <Card>
              <h3>Monthly financial activity</h3>
              {a.monthly.length === 0 ? (
                <EmptyState art="circleOfHands">
                  No financial activity for this period.
                </EmptyState>
              ) : (
                <div className="monthly-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={a.monthly}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => money(Number(value))} />
                      <Tooltip
                        formatter={(value) => money(Number(value ?? 0))}
                      />
                      <Legend />
                      <Bar
                        dataKey="contributions"
                        name="Contributions"
                        fill="#4776d0"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="loans_issued"
                        name="Loans issued"
                        fill="#e6a23c"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="repayments"
                        name="Repayments"
                        fill="#23a58a"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            <Card>
              <h3>Member financial comparison</h3>
              {a.members.length === 0 ? (
                <EmptyState art="circleOfHands">
                  No group members found.
                </EmptyState>
              ) : (
                <div className="member-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={a.members}
                      layout="vertical"
                      margin={{ left: 12, right: 24 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        tickFormatter={(value) => money(Number(value))}
                      />
                      <YAxis
                        type="category"
                        dataKey="member_name"
                        width={110}
                      />
                      <Tooltip
                        formatter={(value) => money(Number(value ?? 0))}
                      />
                      <Legend />
                      <Bar
                        dataKey="contributions"
                        name="Contributions"
                        fill="#4776d0"
                      />
                      <Bar
                        dataKey="loans_issued"
                        name="Loans issued"
                        fill="#e6a23c"
                      />
                      <Bar
                        dataKey="repayments"
                        name="Repayments"
                        fill="#23a58a"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            <div className="donut-grid">
              <DoughnutChart
                title="Contribution share by member"
                data={contributionData}
              />
              <DoughnutChart title="Loans issued by member" data={loanData} />
              <DoughnutChart
                title="Repayment share by member"
                data={repaymentData}
              />
            </div>

            <p className="outstanding-note">
              Current outstanding loan balance:{" "}
              <strong>{money(a.current_outstanding_balance)}</strong>
              <span>
                This is the current balance and is not limited by the selected
                reporting period.
              </span>
            </p>
          </>
        ) : null}
      </section>
    </>
  );
}
