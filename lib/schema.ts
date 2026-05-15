import { z } from "zod";

export const dataEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  fields: z.array(z.string()),
  relations: z.array(
    z.object({
      target: z.string(),
      type: z.string(),
    })
  ),
});

export const projectBriefSchema = z.object({
  title: z.string().describe("A short, catchy title for the app"),
  summary: z.string().describe("1-2 paragraph summary of what the app does"),
  targetUsers: z.string().describe("Description of the target audience"),
  coreFeatures: z.array(z.string()).describe("List of core features"),
  techStack: z.array(z.string()).describe("Recommended technologies"),
  pagesRoutes: z.array(z.string()).describe("Key pages or routes"),
  dataModel: z.array(dataEntitySchema).describe("Data entities and their relationships"),
  buildPhases: z.array(z.string()).describe("Phases to build the project"),
  risks: z.array(z.string()).describe("Risks and edge cases to consider"),
  starterPrompt: z.string().describe("A detailed starter prompt for an AI coding agent (OpenCode) to build this app"),
});

export type ProjectBriefOutput = z.infer<typeof projectBriefSchema>;
export type DataEntityOutput = z.infer<typeof dataEntitySchema>;
