"use client";

import { useId, useState } from "react";
import type { Messages } from "@/i18n";

const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`
  : null;

const MAX = { name: 120, email: 254, message: 5000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Illegal states unrepresentable: there is no "sending and failed", and no bare error flag. */
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed"; reason: "network" | "invalid" | "email" };

/** Collapse whitespace, drop control characters, and bound the length before it leaves. */
function clean(value: string, max: number): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

export function ContactForm({ t, email }: { t: Messages["contact"]; email: string }) {
  const ids = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fields, setFields] = useState({ name: "", email: "", message: "" });

  const endpoint = ENDPOINT;

  if (!endpoint) {
    return (
      <div className="border border-rule p-6">
        <p className="m-0 max-w-[46ch] text-sm text-muted">{t.formDisabled}</p>
        <a
          href={`mailto:${email}`}
          className="mt-5 inline-flex h-11 items-center bg-accent px-5 font-mono text-xs uppercase tracking-[0.08em] text-on-accent"
        >
          {t.formDisabledCta}
        </a>
      </div>
    );
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = clean(fields.name, MAX.name);
    const address = clean(fields.email, MAX.email);
    const message = clean(fields.message, MAX.message);

    if (!name || !address || !message) {
      setStatus({ kind: "failed", reason: "invalid" });
      return;
    }
    if (!EMAIL.test(address)) {
      setStatus({ kind: "failed", reason: "email" });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email: address, message }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) {
        setStatus({ kind: "failed", reason: "network" });
        return;
      }
      setStatus({ kind: "sent" });
      setFields({ name: "", email: "", message: "" });
    } catch {
      setStatus({ kind: "failed", reason: "network" });
    }
  };

  if (status.kind === "sent") {
    return (
      <p role="status" className="border-t-2 border-accent pt-5 text-base text-text">
        {t.formSuccess}
      </p>
    );
  }

  const errorId = `${ids}-error`;
  const failed = status.kind === "failed";
  const errorText = !failed
    ? null
    : status.reason === "network"
      ? t.formErrorNetwork
      : status.reason === "email"
        ? t.formErrorEmail
        : t.formErrorInvalid;

  return (
    <form onSubmit={submit} noValidate className="max-w-[46ch]">
      <Field
        id={`${ids}-name`}
        label={t.formName}
        required={t.required}
        placeholder={t.formNamePlaceholder}
        autoComplete="name"
        value={fields.name}
        maxLength={MAX.name}
        disabled={status.kind === "sending"}
        describedBy={failed ? errorId : undefined}
        onChange={(value) => setFields((f) => ({ ...f, name: value }))}
      />
      <Field
        id={`${ids}-email`}
        label={t.formEmail}
        required={t.required}
        placeholder={t.formEmailPlaceholder}
        autoComplete="email"
        inputMode="email"
        type="email"
        value={fields.email}
        maxLength={MAX.email}
        disabled={status.kind === "sending"}
        describedBy={failed ? errorId : undefined}
        onChange={(value) => setFields((f) => ({ ...f, email: value }))}
      />

      <div className="mt-6">
        <label
          htmlFor={`${ids}-message`}
          className="flex items-baseline gap-2 font-mono text-xs uppercase tracking-[0.08em] text-muted"
        >
          {t.formMessage}
          <span className="text-muted">{t.required}</span>
        </label>
        <textarea
          id={`${ids}-message`}
          rows={5}
          maxLength={MAX.message}
          value={fields.message}
          placeholder={t.formMessagePlaceholder}
          disabled={status.kind === "sending"}
          aria-describedby={failed ? errorId : undefined}
          onChange={(event) => setFields((f) => ({ ...f, message: event.target.value }))}
          className="mt-2 w-full resize-y border-0 border-b border-edge bg-transparent py-2 text-base text-text placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
        />
      </div>

      {errorText ? (
        <p id={errorId} role="alert" className="mt-5 max-w-[46ch] text-sm text-alarm">
          {errorText}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="mt-7 inline-flex h-11 items-center bg-accent px-6 font-mono text-xs uppercase tracking-[0.08em] text-on-accent disabled:opacity-60"
      >
        {status.kind === "sending" ? t.formSending : t.formSend}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  placeholder,
  value,
  maxLength,
  disabled,
  describedBy,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  required: string;
  placeholder: string;
  value: string;
  maxLength: number;
  disabled: boolean;
  describedBy: string | undefined;
  onChange: (value: string) => void;
  type?: "text" | "email";
  autoComplete?: string;
  inputMode?: "email";
}) {
  return (
    <div className="mt-6 first:mt-0">
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 font-mono text-xs uppercase tracking-[0.08em] text-muted"
      >
        {label}
        <span className="text-muted">{required}</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full border-0 border-b border-edge bg-transparent text-base text-text placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
      />
    </div>
  );
}
