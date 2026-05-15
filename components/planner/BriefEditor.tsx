"use client";

import { SectionCard } from "./SectionCard";
import { StarterPrompt } from "./StarterPrompt";
import type { ProjectBrief } from "@/app/types";

interface BriefEditorProps {
  brief: ProjectBrief;
  onUpdate: (brief: ProjectBrief) => void;
}

export function BriefEditor({ brief, onUpdate }: BriefEditorProps) {
  const updateField = <K extends keyof ProjectBrief>(key: K, value: ProjectBrief[K]) => {
    onUpdate({ ...brief, [key]: value });
  };

  return (
    <div className="space-y-5">
      <SectionCard
        title="App Title"
        content={brief.title}
        onChange={(v) => updateField("title", v as string)}
        type="text"
      />

      <SectionCard
        title="Summary"
        content={brief.summary}
        onChange={(v) => updateField("summary", v as string)}
        type="text"
      />

      <SectionCard
        title="Target Users"
        content={brief.targetUsers}
        onChange={(v) => updateField("targetUsers", v as string)}
        type="text"
      />

      <SectionCard
        title="Core Features"
        content={brief.coreFeatures}
        onChange={(v) => updateField("coreFeatures", v as string[])}
        type="list"
      />

      <SectionCard
        title="Tech Stack"
        content={brief.techStack}
        onChange={(v) => updateField("techStack", v as string[])}
        type="list"
      />

      <SectionCard
        title="Pages / Routes"
        content={brief.pagesRoutes}
        onChange={(v) => updateField("pagesRoutes", v as string[])}
        type="list"
      />

      <SectionCard
        title="Build Phases"
        content={brief.buildPhases}
        onChange={(v) => updateField("buildPhases", v as string[])}
        type="list"
      />

      <SectionCard
        title="Risks & Edge Cases"
        content={brief.risks}
        onChange={(v) => updateField("risks", v as string[])}
        type="list"
      />

      <StarterPrompt prompt={brief.starterPrompt} />
    </div>
  );
}
