"use server";

import { generateText, Output } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { projectBriefSchema } from "@/lib/schema";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import type { ProjectBrief } from "@/app/types";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateProjectBrief(idea: string): Promise<ProjectBrief> {
  const { output } = await generateText({
    model: openrouter.chat("anthropic/claude-sonnet-4.6"),
    system: SYSTEM_PROMPT,
    prompt: idea,
    output: Output.object({
      name: "ProjectBrief",
      description: "A structured project brief based on a user idea.",
      schema: projectBriefSchema,
    }),
  });

  const brief: ProjectBrief = {
    idea,
    title: output.title,
    summary: output.summary,
    targetUsers: output.targetUsers,
    coreFeatures: output.coreFeatures,
    techStack: output.techStack,
    pagesRoutes: output.pagesRoutes,
    dataModel: output.dataModel,
    buildPhases: output.buildPhases,
    risks: output.risks,
    starterPrompt: output.starterPrompt,
    generatedAt: new Date().toISOString(),
  };

  return brief;
}
