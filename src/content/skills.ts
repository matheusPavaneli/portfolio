/**
 * The CV's five skill groups, verbatim.
 *
 * The cases are where the work is argued; this is the reference register beside them, so a
 * reader filtering on a term still finds the page. It is deliberately data rather than markup:
 * `content.test.ts` asserts every term the CV lists is here, which is the only thing keeping
 * the two from drifting.
 *
 * Source: Matheus_Pavaneli_Senior_Fullstack_Engineer.pdf, "Technical skills", read 2026-09-10.
 */

export type SkillGroupId = "languages" | "ai" | "data" | "cloud" | "architecture";

export type SkillGroup = {
  readonly id: SkillGroupId;
  readonly terms: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "languages",
    terms: [
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
  },
  {
    id: "ai",
    terms: [
      "LLM orchestration",
      "Multi-agent routing",
      "Provider failover",
      "Response caching",
      "Model evaluation",
      "MongoDB retrieval",
    ],
  },
  {
    id: "data",
    terms: [
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
  },
  {
    id: "cloud",
    terms: [
      "AWS EC2 · Lambda · S3",
      "SQS · SNS · API Gateway",
      "CloudFront · RDS",
      "ECS · Fargate",
      "Azure App Service · Functions",
      "Azure Service Bus · AKS",
      "Docker",
      "Kubernetes",
      "Nginx",
      "Linux",
      "Git",
      "CI/CD",
    ],
  },
  {
    id: "architecture",
    terms: [
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
  },
];
