"use client";

import { PiggyBank } from "lucide-react";
import { DataTable } from "@/components/DataTable/DataTable";
import { PageHead } from "@/components/PageHead/PageHead";
import { useList } from "@/hooks/useList";
import { money } from "@/lib/format";
import type { Contribution } from "@/lib/types";
import "./ContributionsPage.css";

export function ContributionsPage() {
  const list = useList<Contribution>("/contributions");
  return (
    <>
      <PageHead title="My contributions" />
      <DataTable
        className="my-contributions-table"
        list={list}
        empty="No contributions recorded yet."
        emptyIcon={PiggyBank}
        columns={[
          { label: "Date", render: (c) => c.paid_at },
          { label: "Amount", align: "right", render: (c) => money(c.amount) },
        ]}
      />
    </>
  );
}
