import { en, type Messages } from "./messages/en";
import { pt } from "./messages/pt";
import type { Locale } from "./locales";

const catalogue: Record<Locale, Messages> = { en, pt };

/**
 * Resolved at build time by a server component, so only the requested locale's strings reach
 * the HTML and neither catalogue reaches the JS bundle. The outgoing build shipped both, in
 * one 11 KB gz chunk, to every reader.
 */
export function getMessages(locale: Locale): Messages {
  return catalogue[locale];
}

export type { Messages };
export * from "./locales";
