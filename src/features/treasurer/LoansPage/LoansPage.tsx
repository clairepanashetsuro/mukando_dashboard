"use client";

import { HandCoins, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { DataTable } from "@/components/DataTable/DataTable";
import { FormModal } from "@/components/FormModal/FormModal";
import { PageHead } from "@/components/PageHead/PageHead";
import { RowActions } from "@/components/RowActions/RowActions";
import { useList } from "@/hooks/useList";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import type { Loan } from "@/lib/types";
import { LoanBalance } from "../shared/LoanBalance/LoanBalance";
import { useMembers } from "../shared/useMembers";
import { LoanEdit } from "./LoanEdit";
import { LoanForm } from "./LoanForm";
import "./LoansPage.css";

export function LoansPage() {
  const list = useList<Loan>("/loans");
  const members = useMembers();
  const [modal, setModal] = useState<
    | { type: "add"; l?: undefined }
    | { type: "edit"; l: Loan }
    | { type: "del"; l: Loan }
    | null
  >(null);
  const close = (changed: boolean) => {
    setModal(null);
    if (changed) list.reload();
  };
  return (
    <>
      <PageHead
        title="Loans"
        subtitle="10% flat interest · borrowing capped at 2× contributions · 5% weekly penalty after the due date"
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setModal({ type: "add" })}
          >
            New loan
          </Button>
        }
      />
      <DataTable
        className="loans-table"
        list={list}
        empty="No loans yet."
        emptyIcon={HandCoins}
        columns={[
          { label: "Member", render: (l) => members.name(l.member_id) },
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
          {
            label: "",
            align: "right",
            render: (l) => (
              <RowActions>
                <Button small onClick={() => setModal({ type: "edit", l })}>
                  Edit
                </Button>
                <Button
                  small
                  variant="danger-outline"
                  onClick={() => setModal({ type: "del", l })}
                >
                  Delete
                </Button>
              </RowActions>
            ),
          },
        ]}
      />
      {modal?.type === "add" && <LoanForm members={members} onClose={close} />}
      {modal?.type === "edit" && <LoanEdit loan={modal.l} onClose={close} />}
      {modal?.type === "del" && (
        <FormModal
          title="Delete loan"
          submitLabel="Delete loan and repayments"
          danger
          onClose={close}
          onSubmit={async () => {
            await api.del(`/loans/${modal.l.id}`);
            return "Loan deleted";
          }}
        >
          <p>
            Delete this {money(modal.l.principal)} loan for{" "}
            {members.name(modal.l.member_id)}? All repayments recorded against
            it will also be deleted. This cannot be undone.
          </p>
        </FormModal>
      )}
    </>
  );
}
