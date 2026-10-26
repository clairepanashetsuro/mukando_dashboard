"use client";

import { HandCoins } from "lucide-react";
import { Badge } from "@/components/Badge/Badge";
import { DataTable } from "@/components/DataTable/DataTable";
import { PageHead } from "@/components/PageHead/PageHead";
import { useList } from "@/hooks/useList";
import { money } from "@/lib/format";
import type { Loan } from "@/lib/types";
import { LoanBalance } from "../shared/LoanBalance/LoanBalance";
import "./LoansPage.css";

export function LoansPage() {
  const list = useList<Loan>("/loans");
  return (
    <>
      <PageHead
        title="My loans"
        subtitle="Loans are managed by your treasurer. Balances include any late penalty."
      />
      <DataTable
        className="my-loans-table"
        list={list}
        empty="You have no loans."
        emptyIcon={HandCoins}
        columns={[
          {
            label: "Principal",
            align: "right",
            render: (l) => money(l.principal),
          },
          {
            label: "Interest",
            align: "right",
            render: (l) => money(l.interest_amount),
          },
          {
            label: "Balance now",
            align: "right",
            render: (l) => <LoanBalance loan={l} />,
          },
          { label: "Due", render: (l) => l.due_date },
          { label: "Status", render: (l) => <Badge value={l.status} /> },
        ]}
      />
    </>
  );
}
