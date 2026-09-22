import { en, type Messages } from "./messages/en";
import { pt } from "./messages/pt";
import type { Locale } from "./locales";

const catalogue: Record<Locale, Messages> = { en, pt };

export function getMessages(locale: Locale): Messages {
  return catalogue[locale];
}

export type { Messages };
export * from "./locales";
