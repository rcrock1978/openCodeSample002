"use client";

import { BriefEditor } from "./BriefEditor";
import { DataModelGraph } from "./DataModelGraph";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { ProjectBrief } from "@/app/types";

interface BriefWorkspaceProps {
  brief: ProjectBrief;
  onUpdate: (brief: ProjectBrief) => void;
  onReset: () => void;
}

export function BriefWorkspace({ brief, onUpdate, onReset }: BriefWorkspaceProps) {
  return (
    <div className="container mx-auto max-w-[1500px] px-4 py-8 lg:py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="micro-label mb-1">Project Brief</div>
          <h2 className="font-display text-2xl font-bold tracking-tight">{brief.title}</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          New Idea
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]">
        <div className="space-y-4">
          <div className="micro-label">Data Model</div>
          <DataModelGraph entities={brief.dataModel} />
        </div>

        <div className="space-y-4">
          <div className="micro-label">Brief Editor</div>
          <BriefEditor brief={brief} onUpdate={onUpdate} />
        </div>
      </div>
    </div>
  );
}
