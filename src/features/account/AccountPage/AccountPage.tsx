"use client";

import { KeyRound, Save } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { ErrorBox } from "@/components/ErrorBox/ErrorBox";
import { Field } from "@/components/Field/Field";
import { FormActions, FormCard } from "@/components/Form/Form";
import { Notice } from "@/components/Notice/Notice";
import { PageHead } from "@/components/PageHead/PageHead";
import { useToast } from "@/components/Toast/Toast";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";
import "./AccountPage.css";

export function AccountPage({
  user,
  onUserChange,
  onLogout,
}: {
  user: User;
  onUserChange: (user: User) => void;
  onLogout: () => Promise<void>;
}) {
  const toast = useToast();
  const [profile, setProfile] = useState({
    full_name: user.full_name,
    email: user.email,
  });
  const [pw, setPw] = useState({ current_password: "", new_password: "" });
  const [profileError, setProfileError] = useState("");
  const [pwError, setPwError] = useState("");
  const [busy, setBusy] = useState("");

  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy("profile");
    setProfileError("");
    try {
      const updated = await api.patch<User>("/users/me", {
        full_name: profile.full_name.trim(),
        email: profile.email.trim(),
      });
      onUserChange(updated);
      toast("Profile updated");
    } catch (err) {
      setProfileError((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy("pw");
    setPwError("");
    try {
      await api.post("/users/me/change-password", pw);
      toast("Password changed. Please sign in again.");
      await onLogout();
    } catch (err) {
      setPwError((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <PageHead title="My account" />
      {user.must_change_password && (
        <Notice tone="warn">
          You are using a temporary password. Please change it below.
        </Notice>
      )}
      <FormCard className="account-form" title="Profile" onSubmit={saveProfile}>
        <Field label="Full name">
          <input
            required
            minLength={2}
            value={profile.full_name}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            required
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </Field>
        <ErrorBox message={profileError} />
        <FormActions>
          <Button variant="primary" icon={Save} disabled={busy === "profile"}>
            Save profile
          </Button>
        </FormActions>
      </FormCard>
      <FormCard
        className="account-form"
        title="Change password"
        onSubmit={changePassword}
      >
        <Field label="Current password">
          <input
            type="password"
            required
            autoComplete="current-password"
            value={pw.current_password}
            onChange={(e) => setPw({ ...pw, current_password: e.target.value })}
          />
        </Field>
        <Field
          label="New password"
          hint="At least 8 characters. You will be signed out everywhere."
        >
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={pw.new_password}
            onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
          />
        </Field>
        <ErrorBox message={pwError} />
        <FormActions>
          <Button variant="primary" icon={KeyRound} disabled={busy === "pw"}>
            Change password
          </Button>
        </FormActions>
      </FormCard>
    </>
  );
}
