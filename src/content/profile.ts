/** Facts that are the same in both languages. Everything readable lives in `src/i18n`. */

export const profile = {
  name: "Matheus Pavaneli",
  initials: "MP",
  email: "matheuspavaneli@proton.me",
  phone: "+55 44 9775-2680",
  github: "https://github.com/matheusPavaneli",
  linkedin: "https://www.linkedin.com/in/matheuspavaneli/",
  site: "https://matheusPavaneli.github.io/portfolio",
} as const;

export type RoleEntry = {
  readonly id: "bernoulli" | "eicode" | "jorrovi" | "freelance";
  readonly org: string;
  readonly period: string;
};

export const roles: readonly RoleEntry[] = [
  { id: "bernoulli", org: "Bernoulli Educação", period: "Nov 2025 —" },
  { id: "eicode", org: "Eicode", period: "Oct 2024 — Jun 2025" },
  { id: "freelance", org: "Workana", period: "Jan 2024 — Nov 2025" },
  { id: "jorrovi", org: "Jorrovi Calçados", period: "Apr 2023 — Jun 2025" },
];

export type RepoEntry = {
  readonly id: "depguard" | "envValidator" | "azthorize";
  readonly name: string;
  readonly href: string;
  readonly stack: readonly string[];
};

export const repos: readonly RepoEntry[] = [
  {
    id: "depguard",
    name: "depguard",
    href: "https://github.com/matheusPavaneli/depguard",
    stack: ["TypeScript", "OSV", "CLI"],
  },
  {
    id: "envValidator",
    name: "env-validator",
    href: "https://github.com/matheusPavaneli/env-validator",
    stack: ["TypeScript", "Zero deps"],
  },
  {
    id: "azthorize",
    name: "Azthorize-Auth",
    href: "https://github.com/matheusPavaneli/Azthorize-Auth",
    stack: ["Node.js", "AES", "JWT"],
  },
];
