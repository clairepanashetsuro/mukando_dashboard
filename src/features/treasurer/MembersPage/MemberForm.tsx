"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/components/Field/Field";
import { FormModal } from "@/components/FormModal/FormModal";
import { api } from "@/lib/api";
import type { Member } from "@/lib/types";

export function MemberForm({
  member,
  onClose,
}: {
  member?: Member;
  onClose: (changed: boolean) => void;
}) {
  const [f, setF] = useState({
    full_name: member?.full_name || "",
    email: member?.email || "",
    temporary_password: "",
  });
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });
  return (
    <FormModal
      title={member ? "Edit member" : "Add member"}
      onClose={onClose}
      onSubmit={async () => {
        if (member) {
          await api.patch(`/users/members/${member.id}`, {
            full_name: f.full_name.trim(),
            email: f.email.trim(),
          });
          return "Member updated";
        }
        await api.post("/users/members", {
          ...f,
          full_name: f.full_name.trim(),
          email: f.email.trim(),
        });
        return "Member added";
      }}
    >
      <Field label="Full name">
        <input
          required
          minLength={2}
          value={f.full_name}
          onChange={set("full_name")}
        />
      </Field>
      <Field label="Email">
        <input type="email" required value={f.email} onChange={set("email")} />
      </Field>
      {!member && (
        <Field
          label="Temporary password"
          hint="At least 8 characters. Share it with the member; they should change it after signing in."
        >
          <input
            required
            minLength={8}
            value={f.temporary_password}
            onChange={set("temporary_password")}
          />
        </Field>
      )}
    </FormModal>
  );
}
