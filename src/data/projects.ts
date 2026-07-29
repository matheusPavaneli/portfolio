export type SideProject = {
  name: string;
  href: string;
  descKey: string;
  stack: readonly string[];
  meta?: string;
};

/** Repositórios menores — renderizados como lista abaixo dos destaques. */
export const sideProjects: readonly SideProject[] = [
  {
    name: "depguard",
    href: "https://github.com/matheusPavaneli/depguard",
    descKey: "projects.side.depguard",
    stack: ["TypeScript", "OSV", "CLI"],
    meta: "OSS",
  },
  {
    name: "env-validator",
    href: "https://github.com/matheusPavaneli/env-validator",
    descKey: "projects.side.envValidator",
    stack: ["TypeScript", "Zero deps"],
    meta: "OSS",
  },
  {
    name: "Azthorize-Auth",
    href: "https://github.com/matheusPavaneli/Azthorize-Auth",
    descKey: "projects.side.azthorize",
    stack: ["Node.js", "AES", "JWT"],
    meta: "API",
  },
] as const;
