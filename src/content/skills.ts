
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
      "LangChain",
      "Pydantic structured output",
      "Embeddings & vector search (pgvector)",
      "scikit-learn",
      "NumPy",
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
      "Celery",
      "SQLAlchemy / Alembic",
      "pandas",
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
      "boto3",
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
      "pytest",
      "mypy / Ruff",
    ],
  },
];

export const coreSkills: Readonly<Record<SkillGroupId, readonly string[]>> = {
  languages: ["TypeScript", "Python", "Node.js", "NestJS", "FastAPI", "React", "Next.js"],
  ai: [
    "LLM orchestration",
    "Multi-agent routing",
    "Provider failover",
    "Model evaluation",
    "Embeddings & vector search (pgvector)",
    "LangChain",
  ],
  data: ["PostgreSQL", "MongoDB", "Redis", "RabbitMQ", "BullMQ"],
  cloud: ["AWS EC2 · Lambda · S3", "Azure App Service · Functions", "Docker", "Kubernetes", "CI/CD"],
  architecture: ["Event-Driven", "Microservices", "REST", "GraphQL", "Jest", "pytest"],
};
