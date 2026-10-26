"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/components/Field/Field";
import { FormModal } from "@/components/FormModal/FormModal";
import { api } from "@/lib/api";
import type { Amount, Repayment } from "@/lib/types";

export function RepaymentEdit({
  repayment,
  onClose,
}: {
  repayment: Repayment;
  onClose: (changed: boolean) => void;
}) {
  const [f, setF] = useState<{ amount: Amount; paid_at: string }>({
    amount: repayment.amount,
    paid_at: repayment.paid_at,
  });
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });
  return (
    <FormModal
      title="Edit repayment"
      onClose={onClose}
      onSubmit={async () => {
        await api.patch(`/repayments/${repayment.id}`, {
          amount: String(f.amount),
          paid_at: f.paid_at,
        });
        return "Repayment updated";
      }}
    >
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
