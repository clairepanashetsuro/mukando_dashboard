"use client";

import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  Send,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Brand } from "@/components/Brand/Brand";
import { Button } from "@/components/Button/Button";
import { ErrorBox } from "@/components/ErrorBox/ErrorBox";
import { Field } from "@/components/Field/Field";
import { Illustration } from "@/components/Illustration/Illustration";
import { LinkButton } from "@/components/LinkButton/LinkButton";
import { Notice } from "@/components/Notice/Notice";
import { api } from "@/lib/api";
import "./AuthPage.css";

type AuthMode = "login" | "signup" | "forgot" | "reset";

interface AuthForm {
  full_name: string;
  email: string;
  password: string;
  group_name: string;
  weekly_contribution: string;
  new_password: string;
}

export function AuthPage({
  onDone,
  resetToken,
}: {
  onDone: () => Promise<void>;
  resetToken: string | null;
}) {
  const [mode, setMode] = useState<AuthMode>(resetToken ? "reset" : "login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<AuthForm>({
    full_name: "",
    email: "",
    password: "",
    group_name: "",
    weekly_contribution: "0",
    new_password: "",
  });
  const set = (key: keyof AuthForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError("");
    setNotice("");
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "login") {
        await api.login(form.email.trim(), form.password);
        await onDone();
      } else if (mode === "signup") {
        await api.signup({
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          password: form.password,
          group_name: form.group_name.trim(),
          weekly_contribution: String(form.weekly_contribution || "0"),
        });
        await onDone();
      } else if (mode === "forgot") {
        await api.forgot(form.email.trim());
        setNotice("If that email is registered, a reset link has been sent.");
      } else {
        await api.reset(resetToken as string, form.new_password);
        window.history.replaceState({}, "", window.location.pathname);
        setMode("login");
        setNotice("Password updated. Sign in with your new password.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const titles: Record<AuthMode, string> = {
    login: "Sign in",
    signup: "Create a treasurer account",
    forgot: "Reset your password",
    reset: "Choose a new password",
  };

  return (
    <div className="auth-split">
      <div className="auth-form-panel">
        <form className="auth-card" onSubmit={submit}>
          <Brand large />
          <h2>{titles[mode]}</h2>
          {notice && <Notice>{notice}</Notice>}
          {mode === "signup" && (
            <>
              <Field label="Full name" icon={User}>
                <input
                  required
                  minLength={2}
                  value={form.full_name}
                  onChange={set("full_name")}
                />
              </Field>
              <Field label="Group name" icon={Users}>
                <input
                  required
                  minLength={2}
                  value={form.group_name}
                  onChange={set("group_name")}
                />
              </Field>
              <Field label="Weekly contribution">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.weekly_contribution}
                  onChange={set("weekly_contribution")}
                />
              </Field>
            </>
          )}
          {mode !== "reset" && (
            <Field label="Email" icon={Mail}>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
              />
            </Field>
          )}
          {(mode === "login" || mode === "signup") && (
            <Field
              label="Password"
              icon={Lock}
              hint={mode === "signup" ? "At least 8 characters" : undefined}
            >
              <input
                type="password"
                required
                minLength={mode === "signup" ? 8 : 1}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={form.password}
                onChange={set("password")}
              />
            </Field>
          )}
          {mode === "reset" && (
            <Field
              label="New password"
              icon={Lock}
              hint="At least 8 characters"
            >
              <input
                type="password"
                required
                minLength={8}
                value={form.new_password}
                onChange={set("new_password")}
              />
            </Field>
          )}
          <ErrorBox message={error} />
          <Button
            variant="primary"
            block
            icon={
              mode === "forgot"
                ? Send
                : mode === "signup"
                  ? UserPlus
                  : mode === "reset"
                    ? KeyRound
                    : LogIn
            }
            disabled={busy}
          >
            {busy
              ? "Please wait…"
              : mode === "forgot"
                ? "Send reset link"
                : titles[mode].split(" ")[0] === "Create"
                  ? "Create account"
                  : mode === "reset"
                    ? "Update password"
                    : "Sign in"}
          </Button>
          <div className="auth-links">
            {mode === "login" && (
              <>
                <LinkButton onClick={() => switchMode("forgot")}>
                  Forgot password?
                </LinkButton>
                <LinkButton onClick={() => switchMode("signup")}>
                  New group? Sign up as treasurer
                </LinkButton>
              </>
            )}
            {mode !== "login" && (
              <LinkButton onClick={() => switchMode("login")}>
                Back to sign in
              </LinkButton>
            )}
          </div>
          <p className="muted small-text">
            Members are added by their group treasurer and receive a temporary
            password.
          </p>
        </form>
      </div>
      <div className="auth-visual">
        <Illustration name="climb" priority className="auth-visual-art" />
        <p className="auth-visual-text">Saving together, growing together</p>
      </div>
    </div>
  );
}
