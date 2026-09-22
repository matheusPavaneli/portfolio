import { describe, expect, it } from "vitest";

import { cases, ownProjects, productionCases } from "./cases";
import { profile, roles } from "./profile";
import { coreSkills, skillGroups, type SkillGroupId } from "./skills";


describe("contact facts", () => {
  it("carries the phone number exactly as the CV prints it", () => {
    expect(profile.phone).toBe("+55 44 99775-2680");
  });

  it("carries a phone number that survives being turned into a tel: href", () => {
    const dialable = profile.phone.replace(/[^\d+]/g, "");
    expect(dialable).toBe("+5544997752680");
    expect(dialable).toMatch(/^\+55\d{2}9\d{8}$/);
  });

  it("names the freelance engagement the way the CV does", () => {
    const freelance = roles.find((role) => role.id === "freelance");
    expect(freelance?.org).toBe("Independent Contractor via Workana");
  });
});

const CV_TERMS: Record<SkillGroupId, readonly string[]> = {
  languages: [
    "TypeScript",
    "JavaScript",
    "Python",
    "PHP",
    "React",
    "Next.js",
    "Vue.js",
    "Node.js",
    "NestJS",
    "FastAPI",
    "Django / DRF",
    "Fastify",
    "Express",
    "Laravel",
    "TailwindCSS",
  ],
  ai: [
    "LLM orchestration",
    "multi-agent routing",
    "provider failover",
    "response caching",
    "model evaluation",
    "MongoDB retrieval",
    "LangChain",
    "Pydantic structured output",
    "embeddings & vector search (pgvector)",
    "scikit-learn",
    "NumPy",
  ],
  data: [
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "DynamoDB",
    "Redis",
    "Firebase",
    "Kafka",
    "RabbitMQ",
    "BullMQ",
    "Celery",
    "SQLAlchemy / Alembic",
    "pandas",
  ],
  cloud: [
    "EC2",
    "Lambda",
    "S3",
    "SQS",
    "SNS",
    "API Gateway",
    "CloudFront",
    "RDS",
    "ECS",
    "Fargate",
    "App Service",
    "Functions",
    "Service Bus",
    "AKS",
    "Docker",
    "Kubernetes",
    "Nginx",
    "Linux",
    "Git",
    "CI/CD",
    "boto3",
  ],
  architecture: [
    "Clean Architecture",
    "DDD",
    "Event-Driven",
    "Microservices",
    "CQRS",
    "Hexagonal",
    "Serverless",
    "SOLID",
    "REST",
    "GraphQL",
    "Jest",
    "pytest",
    "mypy / Ruff",
  ],
};

describe("skills reference", () => {
  it("has no empty group", () => {
    for (const group of skillGroups) {
      expect(group.terms.length, `${group.id} is empty`).toBeGreaterThan(0);
    }
  });

  it("covers every group the CV has", () => {
    expect(skillGroups.map((group) => group.id).sort()).toEqual(
      Object.keys(CV_TERMS).sort(),
    );
  });

  it.each(Object.entries(CV_TERMS))("carries every %s term from the CV", (id, terms) => {
    const group = skillGroups.find((entry) => entry.id === id);
    const rendered = (group?.terms ?? []).join(" · ").toLowerCase();
    const missing = terms.filter((term) => !rendered.includes(term.toLowerCase()));
    expect(missing, `${id} is missing terms the CV lists`).toEqual([]);
  });

  it("keeps Azure Service Bus, which the page had dropped entirely", () => {
    const everything = skillGroups.flatMap((group) => group.terms).join(" · ");
    expect(everything).toContain("Service Bus");
  });
});

describe("working load", () => {
  it("states which roles were part-time, so overlapping dates read as what they were", () => {
    const load = new Map(roles.map((role) => [role.id, role.load]));
    expect(load.get("bernoulli")).toBe("full-time");
    expect(load.get("eicode")).toBe("full-time");
    expect(load.get("jorrovi")).toBe("part-time");
    expect(load.get("freelance")).toBe("part-time");
  });

  it("never has two full-time roles running in the same month", () => {
    const full = roles.filter((role) => role.load === "full-time");
    for (const a of full) {
      for (const b of full) {
        if (a === b) continue;
        const overlap = a.from <= (b.to ?? "9999-12") && b.from <= (a.to ?? "9999-12");
        expect(overlap, `${a.id} overlaps ${b.id}`).toBe(false);
      }
    }
  });
});

describe("production and own projects", () => {
  it("puts every case in exactly one set", () => {
    expect(productionCases.length + ownProjects.length).toBe(cases.length);
  });

  it("stamps the own projects with no public artifact as prototypes", () => {
    const status = new Map(
      ownProjects.map((entry) => [entry.id, entry.origin.kind === "own" ? entry.origin.status : null]),
    );
    expect(status.get("nanquim")).toBe("prototype");
    expect(status.get("anchor")).toBe("prototype");
    expect(status.get("artefacts")).toBe("prototype");
    expect(status.get("seal")).toBe("published");
    expect(status.get("rageval")).toBe("published");
  });

  it("gives every published project a public link", () => {
    for (const entry of ownProjects) {
      if (entry.origin.kind === "own" && entry.origin.status === "published") {
        expect(entry.links.length, entry.id).toBeGreaterThan(0);
      }
    }
  });
});

describe("the compact skills register", () => {
  it.each(Object.entries(coreSkills))("keeps only %s terms the full CV list carries", (id, terms) => {
    const full = skillGroups.find((group) => group.id === id)?.terms ?? [];
    expect(terms.filter((term) => !full.includes(term))).toEqual([]);
  });

  it("is a register a reader can take in, not the whole CV", () => {
    const core = Object.values(coreSkills).flat().length;
    const all = skillGroups.flatMap((group) => group.terms).length;
    expect(core).toBeLessThanOrEqual(30);
    expect(core).toBeLessThan(all / 2);
  });
});
