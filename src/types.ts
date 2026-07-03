/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TaskCategory {
  AI_AUTOMATION = "ai-automation",
  SAAS_MVP = "saas-mvp",
  MARKETING_LANDING = "marketing-landing",
  CUSTOM_DEV = "custom-dev"
}

export enum TaskStatus {
  BACKLOG = "backlog",
  IN_PROGRESS = "in-progress",
  DELIVERED = "delivered",
  APPROVED = "approved"
}

export interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  priority: "low" | "medium" | "high";
  dateUploaded: string;
  feedback?: string;
}

export interface PlaybookLesson {
  id: string;
  title: string;
  category: "business-model" | "operations" | "monetization" | "case-studies";
  brief: string;
  content: string;
  takeaways: string[];
  checklist: string[];
}

export interface SprintInfo {
  week: number;
  title: string;
  tasks: string[];
  deliverable: string;
  difficulty: "Simple" | "Moderate" | "Complex";
}

export interface MonetizationStrategy {
  modelName: string;
  pricingTier: string;
  fitExplanation: string;
}

export interface ArchitectProposal {
  appName: string;
  tagline: string;
  targetMarket: string;
  mvpCoreScope: string;
  sprints: SprintInfo[];
  techStack: string[];
  monetizationModels: MonetizationStrategy[];
  opcValue: {
    agencyCostEstimate: number;
    agencyDurationMonths: number;
    opcDurationWeeks: number;
    clientSavingsPercent: number;
    leveragedToolsAdvice: string;
  };
}
