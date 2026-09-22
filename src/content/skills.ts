
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
