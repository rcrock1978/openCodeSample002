import { type Node, type Edge, Position } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import type { DataEntity } from "@/app/types";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 100;

export function buildGraph(entities: DataEntity[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = entities.map((ent) => ({
    id: ent.id,
    type: "entityNode",
    data: {
      label: ent.name,
      fields: ent.fields,
    },
    position: { x: 0, y: 0 },
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  }));

  const edges: Edge[] = [];
  entities.forEach((ent) => {
    ent.relations.forEach((rel, idx) => {
      edges.push({
        id: `e-${ent.id}-${rel.target}-${idx}`,
        source: ent.id,
        target: rel.target,
        label: rel.type,
        animated: true,
        style: { stroke: "oklch(0.77 0.134 178)", strokeWidth: 2 },
        labelStyle: { fill: "oklch(0.73 0.042 88)", fontSize: 10, fontFamily: "var(--font-ibm-plex-mono)" },
      });
    });
  });

  return runDagreLayout(nodes, edges);
}

function runDagreLayout(nodes: Node[], edges: Edge[], direction: "TB" | "LR" = "TB") {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === "LR";

  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 100, edgesep: 20 });

  nodes.forEach((n) => {
    g.setNode(n.id, { width: n.width ?? NODE_WIDTH, height: n.height ?? NODE_HEIGHT });
  });

  edges.forEach((e) => {
    g.setEdge(e.source, e.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((n) => {
    const nodeWithPosition = g.node(n.id);
    return {
      ...n,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - (n.width ?? NODE_WIDTH) / 2,
        y: nodeWithPosition.y - (n.height ?? NODE_HEIGHT) / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
