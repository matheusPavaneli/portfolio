import { describe, expect, it } from "vitest";

import { profile, roles } from "./profile";
import { skillGroups, type SkillGroupId } from "./skills";


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
