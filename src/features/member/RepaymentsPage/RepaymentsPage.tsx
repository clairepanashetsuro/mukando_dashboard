"use client";

import { Receipt } from "lucide-react";
import { DataTable } from "@/components/DataTable/DataTable";
import { PageHead } from "@/components/PageHead/PageHead";
import { useList } from "@/hooks/useList";
import { money } from "@/lib/format";
import type { Repayment } from "@/lib/types";
import "./RepaymentsPage.css";

export function RepaymentsPage() {
  const list = useList<Repayment>("/repayments");
  return (
    <>
      <PageHead title="My repayments" />
      <DataTable
        className="my-repayments-table"
        list={list}
        empty="No repayments yet."
        emptyIcon={Receipt}
        columns={[
          { label: "Date", render: (r) => r.paid_at },
          { label: "Loan", render: (r) => `#${r.loan_id}` },
          { label: "Amount", align: "right", render: (r) => money(r.amount) },
        ]}
      />
    </>
  );
}
