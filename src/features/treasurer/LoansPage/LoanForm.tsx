"use client";

import { useState } from "react";
import { Field } from "@/components/Field/Field";
import { FormModal } from "@/components/FormModal/FormModal";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import type { AvailableFunds, FieldEvent } from "@/lib/types";
import { MemberSelect } from "../shared/MemberSelect/MemberSelect";
import type { MembersState } from "../shared/useMembers";

export function LoanForm({
  members,
  onClose,
}: {
  members: MembersState;
  onClose: (changed: boolean) => void;
}) {
  const funds = useFetch(
    () => api.get<AvailableFunds>("/finance/available-funds"),
    [],
  );
  const [f, setF] = useState({ member_id: "", principal: "", due_date: "" });
  const set = (k: keyof typeof f) => (e: FieldEvent) =>
    setF({ ...f, [k]: e.target.value });
  const interest = f.principal ? Math.round(Number(f.principal) * 10) / 100 : 0;
  return (
    <FormModal
      title="New loan"
      onClose={onClose}
      onSubmit={async () => {
        await api.post("/loans", {
          member_id: Number(f.member_id),
          principal: String(f.principal),
          due_date: f.due_date,
        });
        return "Loan created";
      }}
    >
      <Field label="Member">
        <MemberSelect
          members={members}
          value={f.member_id}
          onChange={set("member_id")}
        />
      </Field>
      <Field
        label="Principal"
        hint={
          funds.data
            ? `Available to lend: ${money(funds.data.available_funds)}${interest ? ` · Interest: ${money(interest)} · Total due: ${money(Number(f.principal) + interest)}` : ""}`
            : undefined
        }
      >
        <input
          type="number"
          required
          min="0.01"
          step="10"
          value={f.principal}
          onChange={set("principal")}
        />
      </Field>
      <Field label="Due date">
        <input
          type="date"
          required
          min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
          value={f.due_date}
          onChange={set("due_date")}
        />
      </Field>
    </FormModal>
  );
}
