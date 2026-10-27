"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { ErrorBox } from "@/components/ErrorBox/ErrorBox";
import { Field } from "@/components/Field/Field";
import { FormActions, FormCard } from "@/components/Form/Form";
import { PageHead } from "@/components/PageHead/PageHead";
import { useToast } from "@/components/Toast/Toast";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import type { Amount, Group } from "@/lib/types";
import "./GroupPage.css";

export function GroupPage() {
  const group = useFetch(() => api.get<Group>("/groups/me"), []);
  const toast = useToast();
  const [f, setF] = useState<{
    name: string;
    weekly_contribution: Amount;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const value =
    f ||
    (group.data
      ? {
          name: group.data.name,
          weekly_contribution: group.data.weekly_contribution,
        }
      : null);
  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    setBusy(true);
    setError("");
    try {
      await api.patch("/groups/me", {
        name: value.name.trim(),
        weekly_contribution: String(value.weekly_contribution),
      });
      toast("Group updated");
      setF(null);
      group.reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHead title="Group settings" />
      <ErrorBox message={group.error} onRetry={group.reload} />
      {value && (
        <FormCard className="group-form" onSubmit={save}>
          <Field label="Group name">
            <input
              required
              minLength={2}
              value={value.name}
              onChange={(e) => setF({ ...value, name: e.target.value })}
            />
          </Field>
          <Field label="Weekly contribution">
            <input
              type="number"
              min="0"
              step="10"
              required
              value={value.weekly_contribution}
              onChange={(e) =>
                setF({ ...value, weekly_contribution: e.target.value })
              }
            />
          </Field>
          <ErrorBox message={error} />
          <FormActions>
            <Button variant="primary" icon={Save} disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </Button>
          </FormActions>
        </FormCard>
      )}
    </>
  );
}
