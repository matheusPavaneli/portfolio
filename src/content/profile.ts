export const profile = {
  name: "Matheus Pavaneli",
  initials: "MP",
  email: "matheuspavaneli@proton.me",
  phone: "+55 44 99775-2680",
  github: "https://github.com/matheusPavaneli",
  linkedin: "https://www.linkedin.com/in/matheuspavaneli/",
  cv: "https://drive.google.com/file/d/1d23kox6oNXPHlDxqFH84jkN9Px5Z5cDf/view?usp=drive_link",
} as const;

export type RoleEntry = {
  readonly id: "bernoulli" | "eicode" | "jorrovi" | "freelance";
  readonly org: string;
  readonly from: string;
  readonly to: string | null;
};

export const roles: readonly RoleEntry[] = [
  { id: "bernoulli", org: "Bernoulli Educação", from: "2025-11", to: null },
  { id: "eicode", org: "Eicode", from: "2024-10", to: "2025-06" },
  { id: "freelance", org: "Independent Contractor via Workana", from: "2024-01", to: "2025-11" },
  { id: "jorrovi", org: "Jorrovi Calçados", from: "2023-04", to: "2025-06" },
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
