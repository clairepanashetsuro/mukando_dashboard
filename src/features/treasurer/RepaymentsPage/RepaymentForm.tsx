"use client";

import { useState } from "react";
import { Field } from "@/components/Field/Field";
import { FormModal } from "@/components/FormModal/FormModal";
import { useFetch } from "@/hooks/useFetch";
import { api, fetchAll } from "@/lib/api";
import { money, today } from "@/lib/format";
import type { FieldEvent, Loan, LoanBalance } from "@/lib/types";
import type { MembersState } from "../shared/useMembers";

export function RepaymentForm({
  members,
  onClose,
}: {
  members: MembersState;
  onClose: (changed: boolean) => void;
}) {
  const loans = useFetch(() => fetchAll<Loan>("/loans"), []);
  const open = (loans.data || []).filter(
    (l) =>
      l.status === "ACTIVE" ||
      l.status === "OVERDUE" ||
      l.status === "DEFAULTED",
  );
  const [f, setF] = useState({ loan_id: "", amount: "", paid_at: today() });
  const set = (k: keyof typeof f) => (e: FieldEvent) =>
    setF({ ...f, [k]: e.target.value });
  const balance = useFetch<LoanBalance | null>(
    () =>
      f.loan_id
        ? api.get<LoanBalance>(`/loans/${f.loan_id}/balance`)
        : Promise.resolve(null),
    [f.loan_id],
  );
  return (
    <FormModal
      title="Record repayment"
      onClose={onClose}
      onSubmit={async () => {
        await api.post("/repayments", {
          loan_id: Number(f.loan_id),
          amount: String(f.amount),
          paid_at: f.paid_at,
        });
        return "Repayment recorded";
      }}
    >
      <Field label="Loan">
        <select required value={f.loan_id} onChange={set("loan_id")}>
          <option value="">Select a loan…</option>
          {open.map((l) => (
            <option key={l.id} value={l.id}>
              #{l.id} · {members.name(l.member_id)} · {l.status} · due{" "}
              {l.due_date}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label="Amount"
        hint={
          balance.data
            ? `Current balance: ${money(balance.data.balance)}`
            : undefined
        }
      >
        <input
          type="number"
          required
          min="0.01"
          step="0.01"
          max={balance.data ? balance.data.balance : undefined}
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
