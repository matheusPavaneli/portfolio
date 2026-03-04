"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { profile } from "@/data/profile";

const FORMSPREE_URL = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`
  : null;

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

function sanitize(str: string, maxLen: number): string {
  return str
    .replace(/\s+/g, " ")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLen);
}

export function ContactForm() {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_URL) {
      setStatus("error");
      return;
    }
    const name = sanitize(formData.name, MAX_NAME);
    const email = sanitize(formData.email, MAX_EMAIL);
    const message = sanitize(formData.message, MAX_MESSAGE);
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!FORMSPREE_URL) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 p-6 rounded-2xl bg-surface-elevated/80 border border-fg-muted/10"
      >
        <p className="text-fg-muted text-sm mb-4">
          Configure <code className="text-accent">NEXT_PUBLIC_FORMSPREE_FORM_ID</code> no .env para ativar o formulário.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-on-accent font-medium hover:bg-accent-dim transition-colors"
        >
          {profile.email}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg"
    >
      <h3 className="font-mono text-xs text-accent uppercase tracking-wider mb-4">
        {t("contact.formTitle")}
      </h3>
      {status === "success" ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-accent font-medium py-6"
        >
          {t("contact.formSuccess")}
        </motion.p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-fg-muted mb-1.5">
              {t("contact.formName")}
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              maxLength={MAX_NAME + 50}
              autoComplete="name"
              value={formData.name}
              onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
              className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-surface border border-fg-muted/20 text-fg placeholder:text-fg-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-shadow"
              placeholder="John Doe"
              disabled={status === "sending"}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-fg-muted mb-1.5">
              {t("contact.formEmail")}
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              maxLength={MAX_EMAIL + 10}
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
              className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-surface border border-fg-muted/20 text-fg placeholder:text-fg-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-shadow"
              placeholder="you@example.com"
              disabled={status === "sending"}
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-fg-muted mb-1.5">
              {t("contact.formMessage")}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              maxLength={MAX_MESSAGE + 500}
              value={formData.message}
              onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-fg-muted/20 text-fg placeholder:text-fg-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-shadow resize-none"
              placeholder="Your message…"
              disabled={status === "sending"}
            />
          </div>
          {status === "error" && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {t("contact.formError")}
            </p>
          )}
          <motion.button
            type="submit"
            disabled={status === "sending"}
            className="w-full min-h-[44px] px-6 py-3 rounded-xl bg-accent text-on-accent font-medium hover:bg-accent-dim focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-70 disabled:cursor-not-allowed transition-colors hover-shine relative overflow-hidden"
            whileHover={status !== "sending" ? { scale: 1.01 } : {}}
            whileTap={status !== "sending" ? { scale: 0.99 } : {}}
          >
            {status === "sending" ? t("contact.formSending") : t("contact.formSend")}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
}
