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
      <div className="rounded-plate p-6 ring-1 ring-edge">
        <p className="m-0 max-w-[46ch] text-sm text-dim">{t.formDisabled}</p>
        <a
          href={`mailto:${email}`}
          className="mt-5 inline-flex h-11 items-center rounded-recess bg-signal px-5 text-on-signal legend"
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
      <p role="status" className="rounded-recess bg-plate p-4 text-base text-ink ring-1 ring-edge">
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
          className="legend flex items-baseline gap-2 text-dim"
        >
          {t.formMessage}
          <span className="text-dim">{t.required}</span>
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
          className="mt-2 w-full resize-y rounded-recess bg-page px-3 py-2 text-base text-ink ring-1 ring-edge placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-signal disabled:opacity-60"
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
        className="mt-7 inline-flex h-11 items-center rounded-recess bg-signal px-6 text-on-signal legend disabled:opacity-60"
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
        className="legend flex items-baseline gap-2 text-dim"
      >
        {label}
        <span className="text-dim">{required}</span>
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
        className="mt-2 h-11 w-full rounded-recess bg-page px-3 text-base text-ink ring-1 ring-edge placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-signal disabled:opacity-60"
      />
    </div>
  );
}
