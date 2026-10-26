"use client";

import { useState } from "react";
import { Field } from "@/components/Field/Field";
import { FormModal } from "@/components/FormModal/FormModal";
import { api } from "@/lib/api";
import { today } from "@/lib/format";
import type { Amount, Contribution, FieldEvent } from "@/lib/types";
import { MemberSelect } from "../shared/MemberSelect/MemberSelect";
import type { MembersState } from "../shared/useMembers";

export function ContributionForm({
  contribution,
  members,
  onClose,
}: {
  contribution?: Contribution;
  members: MembersState;
  onClose: (changed: boolean) => void;
}) {
  const [f, setF] = useState<{
    member_id: string | number;
    amount: Amount;
    paid_at: string;
  }>({
    member_id: contribution?.member_id || "",
    amount: contribution?.amount || "",
    paid_at: contribution?.paid_at || today(),
  });
  const set = (k: keyof typeof f) => (e: FieldEvent) =>
    setF({ ...f, [k]: e.target.value });
  return (
    <FormModal
      title={contribution ? "Edit contribution" : "Record contribution"}
      onClose={onClose}
      onSubmit={async () => {
        if (contribution) {
          await api.patch(`/contributions/${contribution.id}`, {
            amount: String(f.amount),
            paid_at: f.paid_at,
          });
          return "Contribution updated";
        }
        await api.post("/contributions", {
          member_id: Number(f.member_id),
          amount: String(f.amount),
          paid_at: f.paid_at,
        });
        return "Contribution recorded";
      }}
    >
      {!contribution && (
        <Field label="Member">
          <MemberSelect
            members={members}
            value={f.member_id}
            onChange={set("member_id")}
          />
        </Field>
      )}
      <Field label="Amount">
        <input
          type="number"
          required
          min="0.01"
          step="0.01"
          value={f.amount}
          onChange={set("amount")}
        />
      </Field>
      <Field label="Date paid">
        <input
          type="date"
          required
          value={f.paid_at}
          onChange={set("paid_at")}
        />
      </Field>
    </FormModal>
  );
}
