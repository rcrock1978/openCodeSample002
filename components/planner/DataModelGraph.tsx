"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
} from "@xyflow/react";
import { EntityNode } from "./EntityNode";
import { buildGraph } from "@/lib/graph-builder";
import type { DataEntity } from "@/app/types";

const nodeTypes: NodeTypes = {
  entityNode: EntityNode,
};

interface DataModelGraphProps {
  entities: DataEntity[];
}

export function DataModelGraph({ entities }: DataModelGraphProps) {
  const { nodes, edges } = useMemo(() => buildGraph(entities), [entities]);

  return (
    <div className="blueprint-surface h-[500px] lg:h-auto lg:min-h-[600px] rounded-xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
        proOptions={{ hideAttribution: true }}
      >
        <Background color="oklch(0.77 0.134 178 / 0.15)" gap={24} size={1} />
        <Controls className="!bg-card/80 !border-border !text-foreground" />
        <MiniMap
          className="!bg-card/80 !border-border"
          nodeColor={() => "oklch(0.78 0.16 61)"}
          maskColor="oklch(0.15 0.038 252 / 0.6)"
        />
      </ReactFlow>
    </div>
  );
}
