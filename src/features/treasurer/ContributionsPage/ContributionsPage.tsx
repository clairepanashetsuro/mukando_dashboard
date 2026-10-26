"use client";

import { PiggyBank, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { DataTable } from "@/components/DataTable/DataTable";
import { FormModal } from "@/components/FormModal/FormModal";
import { PageHead } from "@/components/PageHead/PageHead";
import { RowActions } from "@/components/RowActions/RowActions";
import { useList } from "@/hooks/useList";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import type { Contribution } from "@/lib/types";
import { useMembers } from "../shared/useMembers";
import { ContributionForm } from "./ContributionForm";
import "./ContributionsPage.css";

export function ContributionsPage() {
  const list = useList<Contribution>("/contributions");
  const members = useMembers();
  const [modal, setModal] = useState<
    | { type: "add"; c?: undefined }
    | { type: "edit"; c: Contribution }
    | { type: "del"; c: Contribution }
    | null
  >(null);
  const close = (changed: boolean) => {
    setModal(null);
    if (changed) list.reload();
  };
  return (
    <>
      <PageHead
        title="Contributions"
        subtitle="Savings recorded for each member"
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setModal({ type: "add" })}
          >
            Record contribution
          </Button>
        }
      />
      <DataTable
        className="contributions-table"
        list={list}
        empty="No contributions recorded yet."
        emptyIcon={PiggyBank}
        columns={[
          { label: "Date", render: (c) => c.paid_at },
          { label: "Member", render: (c) => members.name(c.member_id) },
          { label: "Amount", align: "right", render: (c) => money(c.amount) },
          {
            label: "",
            align: "right",
            render: (c) => (
              <RowActions>
                <Button small onClick={() => setModal({ type: "edit", c })}>
                  Edit
                </Button>
                <Button
                  small
                  variant="danger-outline"
                  onClick={() => setModal({ type: "del", c })}
                >
                  Delete
                </Button>
              </RowActions>
            ),
          },
        ]}
      />
      {modal && modal.type !== "del" && (
        <ContributionForm
          contribution={modal.c}
          members={members}
          onClose={close}
        />
      )}
      {modal?.type === "del" && (
        <FormModal
          title="Delete contribution"
          submitLabel="Delete"
          danger
          onClose={close}
          onSubmit={async () => {
            await api.del(`/contributions/${modal.c.id}`);
            return "Contribution deleted";
          }}
        >
          <p>
            Delete the {money(modal.c.amount)} contribution from{" "}
            {members.name(modal.c.member_id)} on {modal.c.paid_at}? This changes
            the member's borrowing limit.
          </p>
        </FormModal>
      )}
    </>
  );
}
