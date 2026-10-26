"use client";

import { useState } from "react";
import { Field } from "@/components/Field/Field";
import { FormModal } from "@/components/FormModal/FormModal";
import { api } from "@/lib/api";
import type { FieldEvent, Loan } from "@/lib/types";

export function LoanEdit({
  loan,
  onClose,
}: {
  loan: Loan;
  onClose: (changed: boolean) => void;
}) {
  const [f, setF] = useState<{ due_date: string; status: string }>({
    due_date: loan.due_date,
    status: loan.status,
  });
  const set = (k: keyof typeof f) => (e: FieldEvent) =>
    setF({ ...f, [k]: e.target.value });
  return (
    <FormModal
      title="Edit loan"
      onClose={onClose}
      onSubmit={async () => {
        const body: { due_date?: string; status?: string } = {};
        if (f.due_date !== loan.due_date) body.due_date = f.due_date;
        if (f.status !== loan.status) body.status = f.status;
        if (Object.keys(body).length)
          await api.patch(`/loans/${loan.id}`, body);
        return "Loan updated";
      }}
    >
      <Field label="Due date">
        <input
          type="date"
          required
          value={f.due_date}
          onChange={set("due_date")}
        />
      </Field>
      <Field
        label="Status"
        hint="Overdue is set automatically when a loan passes its due date."
      >
        <select value={f.status} onChange={set("status")}>
          {["ACTIVE", "OVERDUE", "PAID", "DEFAULTED"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
    </FormModal>
  );
}
