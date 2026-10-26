"use client";

import { Save, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/Button/Button";
import { ErrorBox } from "@/components/ErrorBox/ErrorBox";
import { Form, FormActions } from "@/components/Form/Form";
import { Modal } from "@/components/Modal/Modal";
import { useToast } from "@/components/Toast/Toast";

interface FormModalProps {
  title: string;
  onClose: (changed: boolean) => void;
  onSubmit: () => Promise<string | void>;
  submitLabel?: string;
  submitIcon?: LucideIcon;
  danger?: boolean;
  children: ReactNode;
}

export function FormModal({
  title,
  onClose,
  onSubmit,
  submitLabel = "Save",
  submitIcon,
  danger,
  children,
}: FormModalProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const message = await onSubmit();
      if (message) toast(message);
      onClose(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={title} onClose={() => onClose(false)}>
      <Form onSubmit={submit}>
        {children}
        <ErrorBox message={error} />
        <FormActions>
          <Button type="button" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            icon={submitIcon || (danger ? Trash2 : Save)}
            disabled={busy}
          >
            {busy ? "Working…" : submitLabel}
          </Button>
        </FormActions>
      </Form>
    </Modal>
  );
}
