"use client";

import { Handle, Position } from "@xyflow/react";

interface EntityNodeData {
  label: string;
  fields: string[];
}

export function EntityNode({ data }: { data: EntityNodeData }) {
  return (
    <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl p-3 min-w-[160px] shadow-lg">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-accent !border-2 !border-background"
      />
      <div className="font-code text-sm font-bold text-primary">{data.label}</div>
      <div className="mt-1.5 space-y-0.5">
        {data.fields.map((f) => (
          <div key={f} className="font-code text-xs text-muted-foreground">
            {f}
          </div>
        ))}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-accent !border-2 !border-background"
      />
    </div>
  );
}
