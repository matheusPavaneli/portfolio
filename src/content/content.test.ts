import { describe, expect, it } from "vitest";

import { profile, roles } from "./profile";
import { skillGroups, type SkillGroupId } from "./skills";

/**
 * The page's facts against the CV they come from.
 *
 * Source: Matheus_Pavaneli_Senior_Fullstack_Engineer.pdf, read 2026-09-10. The site had been
 * carrying a phone number one digit short of the CV's, which meant the number on the contact
 * block did not dial. Nothing here is a style check — every assertion is a fact that was wrong
 * or could silently go wrong again.
 */

describe("contact facts", () => {
  it("carries the phone number exactly as the CV prints it", () => {
    // Regression: the previous value was "+55 44 9775-2680" — one 9 short, and undiallable.
    expect(profile.phone).toBe("+55 44 99775-2680");
  });

  it("carries a phone number that survives being turned into a tel: href", () => {
    const dialable = profile.phone.replace(/[^\d+]/g, "");
    expect(dialable).toBe("+5544997752680");
    // Brazilian mobile: country code, two-digit area code, nine digits starting with 9.
    expect(dialable).toMatch(/^\+55\d{2}9\d{8}$/);
  });

  it("names the freelance engagement the way the CV does", () => {
    const freelance = roles.find((role) => role.id === "freelance");
    expect(freelance?.org).toBe("Independent Contractor via Workana");
  });
});

/**
 * Every term the CV's "Technical skills" section lists. The redesign dissolved the old
 * keyword grid into the cases, which cost keyword findability; this list is what the
 * reference block in `Record` puts back, and this test is what stops it drifting from the CV.
 */
const CV_TERMS: Record<SkillGroupId, readonly string[]> = {
  languages: [
    "TypeScript",
    "JavaScript",
    "PHP",
    "React",
    "Next.js",
    "Vue.js",
    "Node.js",
    "NestJS",
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
