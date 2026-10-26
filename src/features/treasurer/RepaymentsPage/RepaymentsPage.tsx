"use client";

import { Plus, Receipt } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { DataTable } from "@/components/DataTable/DataTable";
import { FormModal } from "@/components/FormModal/FormModal";
import { PageHead } from "@/components/PageHead/PageHead";
import { RowActions } from "@/components/RowActions/RowActions";
import { useList } from "@/hooks/useList";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import type { Repayment } from "@/lib/types";
import { useMembers } from "../shared/useMembers";
import { RepaymentEdit } from "./RepaymentEdit";
import { RepaymentForm } from "./RepaymentForm";
import "./RepaymentsPage.css";

export function RepaymentsPage() {
  const list = useList<Repayment>("/repayments");
  const members = useMembers();
  const [modal, setModal] = useState<
    | { type: "add"; r?: undefined }
    | { type: "edit"; r: Repayment }
    | { type: "del"; r: Repayment }
    | null
  >(null);
  const close = (changed: boolean) => {
    setModal(null);
    if (changed) list.reload();
  };
  return (
    <>
      <PageHead
        title="Repayments"
        subtitle="Payments received against loans"
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setModal({ type: "add" })}
          >
            Record repayment
          </Button>
        }
      />
      <DataTable
        className="repayments-table"
        list={list}
        empty="No repayments recorded yet."
        emptyIcon={Receipt}
        columns={[
          { label: "Date", render: (r) => r.paid_at },
          { label: "Member", render: (r) => members.name(r.member_id) },
          { label: "Loan", render: (r) => `#${r.loan_id}` },
          { label: "Amount", align: "right", render: (r) => money(r.amount) },
          {
            label: "",
            align: "right",
            render: (r) => (
              <RowActions>
                <Button small onClick={() => setModal({ type: "edit", r })}>
                  Edit
                </Button>
                <Button
                  small
                  variant="danger-outline"
                  onClick={() => setModal({ type: "del", r })}
                >
                  Delete
                </Button>
              </RowActions>
            ),
          },
        ]}
      />
      {modal?.type === "add" && (
        <RepaymentForm members={members} onClose={close} />
      )}
      {modal?.type === "edit" && (
        <RepaymentEdit repayment={modal.r} onClose={close} />
      )}
      {modal?.type === "del" && (
        <FormModal
          title="Delete repayment"
          submitLabel="Delete"
          danger
          onClose={close}
          onSubmit={async () => {
            await api.del(`/repayments/${modal.r.id}`);
            return "Repayment deleted";
          }}
        >
          <p>
            Delete the {money(modal.r.amount)} repayment on {modal.r.paid_at}?
            The loan balance and status will be recalculated.
          </p>
        </FormModal>
      )}
    </>
  );
}
