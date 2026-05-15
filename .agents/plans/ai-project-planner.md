# AI Project Planner — Implementation Plan

## 1. Goal
A single-page Next.js app where a user enters a rough app idea, clicks **Generate Brief**, and gets an editable project brief with 9 sections — plus a React Flow visualization of the data model and a copyable OpenCode starter prompt.

---

## 2. Architecture

### Stack
- **Framework:** Next.js 16 App Router + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + `@theme inline` tokens
- **Components:** shadcn/ui primitives (manual install via copy-paste or shadcn CLI)
- **Icons:** Lucide React
- **Fonts:** Fraunces (display), IBM Plex Sans (body), IBM Plex Mono (labels/code)
- **State:** React state + `localStorage` (no auth, no DB)
- **AI:** Vercel AI SDK v6 + OpenRouter provider (`@openrouter/ai-sdk-provider`)
- **Model:** `anthropic/claude-sonnet-4.6` via OpenRouter
- **Graph:** `@xyflow/react` (React Flow v12) + `@dagrejs/dagre` for auto-layout
- **Theme:** Dark-first (class-based), default dark

---

## 3. Routes

| Route | Purpose |
|---|---|
| `/` | Landing + input form. On first visit, show a hero with an idea textarea and Generate button. |
| `/` (after generation) | Same page transforms into the **Planner Workspace** — a split layout with the brief on the right and a React Flow data model graph on the left. |
| `/api/generate` | **Optional** API route if we decide to stream progress. Primary approach will be a Server Action for simplicity. |

> **Decision:** Use a single route (`/`) with conditional UI. The brief editing workspace replaces the landing hero after generation. A "New Idea" button resets state.

---

## 4. Data Flow

```
┌─────────────────┐
│  User types idea│
│  in <textarea>  │
└────────┬────────┘
         ▼
┌─────────────────────────────┐
│  Click "Generate Brief"     │
│  → calls Server Action      │
│    generateProjectBrief()   │
└────────┬────────────────────┘
         ▼
┌─────────────────────────────┐
│  Server Action:             │
│  - builds a detailed prompt │
│  - calls generateText()     │
│    with Output.object()     │
│    + Zod schema             │
│  - returns structured brief │
└────────┬────────────────────┘
         ▼
┌─────────────────────────────┐
│  Client:                    │
│  - receives typed brief     │
│  - stores in React state    │
│  - persists to localStorage │
│  - renders all sections     │
│  - generates React Flow     │
│    nodes/edges from schema  │
└─────────────────────────────┘
```

---

## 5. File Structure

```
app/
  layout.tsx                    # Root layout with fonts + dark theme
  page.tsx                      # Main page: conditional landing vs workspace
  globals.css                   # Design tokens, utilities, React Flow styles
  actions.ts                    # Server Action: generateProjectBrief()
  types.ts                      # Shared TypeScript types

components/
  ui/                           # shadcn/ui primitives (Button, Card, Input, etc.)
  planner/
    IdeaInput.tsx               # Hero textarea + generate button
    BriefWorkspace.tsx          # Main workspace grid layout
    BriefEditor.tsx             # Right panel: all editable sections
    SectionCard.tsx             # Reusable editable section card
    DataModelGraph.tsx          # React Flow wrapper
    EntityNode.tsx              # Custom React Flow node component
    StarterPrompt.tsx           # Final copyable OpenCode prompt
    LoadingState.tsx            # Skeleton/generating UI
    EmptyState.tsx              # Before generation

lib/
  utils.ts                      # cn() helper
  schema.ts                     # Zod schema for project brief
  prompts.ts                    # System prompt template for the AI
  graph-builder.ts              # Converts data model → React Flow nodes/edges
  storage.ts                    # localStorage read/write helpers

public/
  (static assets if needed)
```

---

## 6. Component Inventory

| Component | Props | Notes |
|---|---|---|
| `IdeaInput` | `onSubmit: (idea: string) => void`, `isLoading` | Large textarea, amber CTA button, hero layout |
| `BriefWorkspace` | `brief: ProjectBrief`, `onUpdate: (b: ProjectBrief) => void` | Two-column grid: graph left, editor right |
| `BriefEditor` | `brief`, `onUpdate` | Scrollable right panel with all section cards |
| `SectionCard` | `title`, `content`, `onChange`, `type: 'text' \| 'list'` | Editable card. Text = textarea. List = array of strings with add/remove |
| `DataModelGraph` | `entities: DataEntity[]` | React Flow container with dagre layout |
| `EntityNode` | `data: { label, fields }` | Custom glass-card node with teal handles |
| `StarterPrompt` | `brief: ProjectBrief` | Generates and displays the final OpenCode prompt with copy button |
| `LoadingState` | — | Animated skeleton matching the workspace layout |

---

## 7. State Management (localStorage)

**Key:** `planner-brief-v1`

```ts
interface ProjectBrief {
  idea: string;
  title: string;
  summary: string;
  targetUsers: string;
  coreFeatures: string[];
  techStack: string[];
  pagesRoutes: string[];
  dataModel: DataEntity[];
  buildPhases: string[];
  risks: string[];
  starterPrompt: string;
  generatedAt: string;
}

interface DataEntity {
  id: string;
  name: string;
  fields: string[];
  relations: { target: string; type: string }[];
}
```

**Persistence logic:**
- On generation success, write full `ProjectBrief` to `localStorage`.
- On mount (`useEffect`), read from `localStorage`. If found, restore state and skip the landing.
- Provide a "Clear & Start Over" button that wipes `localStorage` and resets state.

---

## 8. AI Integration

### Server Action: `app/actions.ts`

```ts
'use server';

import { generateText, Output } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import { projectBriefSchema } from '@/lib/schema';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateProjectBrief(idea: string) {
  const { output } = await generateText({
    model: openrouter.chat('anthropic/claude-sonnet-4.6'),
    system: SYSTEM_PROMPT,
    prompt: idea,
    output: Output.object({
      name: 'ProjectBrief',
      description: 'A structured project brief based on a user idea.',
      schema: projectBriefSchema,
    }),
  });

  return output;
}
```

### Zod Schema: `lib/schema.ts`

```ts
export const dataEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  fields: z.array(z.string()),
  relations: z.array(z.object({
    target: z.string(),
    type: z.string(),
  })),
});

export const projectBriefSchema = z.object({
  title: z.string(),
  summary: z.string(),
  targetUsers: z.string(),
  coreFeatures: z.array(z.string()),
  techStack: z.array(z.string()),
  pagesRoutes: z.array(z.string()),
  dataModel: z.array(dataEntitySchema),
  buildPhases: z.array(z.string()),
  risks: z.array(z.string()),
  starterPrompt: z.string(),
});
```

### Prompt Engineering
The `system` prompt in `lib/prompts.ts` will instruct the model to:
- Think like a senior technical product manager + architect
- Output concise, actionable content
- Use simple data types in the data model (no enums, no complex types)
- Generate a final `starterPrompt` tailored for **OpenCode** — i.e., a prompt that an OpenCode agent could consume to build the app described in the brief.

---

## 9. Data Model Visualization (React Flow)

### Graph Builder: `lib/graph-builder.ts`

Converts `ProjectBrief.dataModel` into React Flow nodes/edges, then runs dagre auto-layout:

```ts
import { type Node, type Edge } from '@xyflow/react';
import dagre from '@dagrejs/dagre';

export function buildGraph(entities: DataEntity[]) {
  // Create nodes (glass cards showing entity name + fields)
  // Create edges from entity.relations
  // Run dagre layout (TB direction)
  // Return { nodes, edges }
}
```

### Custom Node: `components/planner/EntityNode.tsx`

```tsx
'use client';
import { Handle, Position } from '@xyflow/react';

export function EntityNode({ data }: { data: { label: string; fields: string[] } }) {
  return (
    <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl p-3 min-w-[160px] shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-accent" />
      <div className="font-code text-sm font-bold text-primary">{data.label}</div>
      <div className="mt-1 space-y-0.5">
        {data.fields.map(f => (
          <div key={f} className="font-code text-xs text-muted-foreground">{f}</div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-accent" />
    </div>
  );
}
```

### Container: `DataModelGraph.tsx`

- Wraps `<ReactFlow>` inside a `.blueprint-surface` container.
- Uses `fitView` on mount.
- Read-only graph (no connect/edit).

---

## 10. Starter Prompt for OpenCode

The AI generates a `starterPrompt` string. The UI renders it in a code block with a **Copy** button.

**Target format example:**
```
Build a [type] app with Next.js and Tailwind CSS.

## Summary
[summary]

## Target Users
[targetUsers]

## Core Features
- [feature 1]
- [feature 2]

## Tech Stack
[techStack]

## Pages/Routes
[pagesRoutes]

## Data Model
[dataModel as bullet list]

## Build Phases
[phases]

## Risks
[risks]

No auth, no database, no payments. Keep it lightweight.
```

This ensures the prompt is directly consumable by an OpenCode agent.

---

## 11. Design System Alignment

- **Background:** Use `.planner-bg` with blueprint grid + colored orbs.
- **Cards:** `.paper-card` for section cards, `.glass-panel` for the hero input area.
- **Graph:** `.blueprint-surface` for the React Flow container.
- **Buttons:** Primary CTA uses `.command-strip` (amber gradient), pill shape.
- **Inputs:** Textarea uses `rounded-xl`, translucent bg, teal focus ring.
- **Typography:** Fraunces for hero headings, IBM Plex Sans for body, IBM Plex Mono for labels and code.

> **Note:** The current `layout.tsx` uses Geist fonts. We'll replace with the design-specified fonts.

---

## 12. Implementation Steps (Phased)

### Phase 1: Foundation (infrastructure + design system)
1. Install dependencies: `ai`, `zod`, `@openrouter/ai-sdk-provider`, `@xyflow/react`, `@dagrejs/dagre`, `lucide-react`, `next-themes`
2. Set up fonts in `layout.tsx` (Fraunces, IBM Plex Sans/Mono via `next/font/google`)
3. Update `globals.css` with full design tokens and utilities from `DESIGN.md`
4. Add React Flow stylesheet import to `globals.css`
5. Create `lib/utils.ts` with `cn()` helper
6. Set up dark mode with `next-themes` (dark default)

### Phase 2: Types, Schema, and Storage
7. Define `ProjectBrief` and `DataEntity` types in `app/types.ts`
8. Create Zod schema in `lib/schema.ts`
9. Create `lib/storage.ts` for `localStorage` read/write
10. Write the system prompt template in `lib/prompts.ts`

### Phase 3: AI Backend
11. Create Server Action `app/actions.ts` with `generateProjectBrief`
12. Add `.env.local` with `OPENROUTER_API_KEY`
13. Test the action with a hardcoded idea to verify structured output works

### Phase 4: UI Components (Landing → Workspace)
14. Create `IdeaInput.tsx` — hero landing with textarea + generate button
15. Create `SectionCard.tsx` — reusable editable card
16. Create `BriefEditor.tsx` — assembles all section cards
17. Create `StarterPrompt.tsx` — code block with copy button
18. Create `LoadingState.tsx` — skeleton while generating

### Phase 5: Data Model Visualization
19. Create `EntityNode.tsx` — custom React Flow node
20. Create `lib/graph-builder.ts` — dagre layout logic
21. Create `DataModelGraph.tsx` — React Flow container
22. Wire graph into `BriefWorkspace`

### Phase 6: Integration and Polish
23. Update `page.tsx` to conditionally render landing vs workspace based on state/localStorage
24. Add "New Idea" / "Clear" button to reset state
25. Add subtle animations (fade-up, scale-in) for section entrance
26. Run `next build` and fix any type/lint errors

---

## 13. Dependencies to Install

```bash
npm install ai zod @openrouter/ai-sdk-provider @xyflow/react @dagrejs/dagre lucide-react next-themes
```

---

## 14. Environment Variables

```env
# .env.local
OPENROUTER_API_KEY=your_key_here
```

---

## 15. Open Questions / Trade-offs

1. **Streaming vs one-shot:** The plan uses a Server Action with `generateText` (one-shot). If the brief generation feels slow, we could switch to a streaming API route + `streamText` with `Output.object()` and show partial sections as they arrive. For now, one-shot is simpler.

2. **shadcn/ui installation:** We don't have shadcn/ui set up yet. Should we initialize it (`npx shadcn@latest init`) or manually create primitives? For a tutorial, manual primitives in `components/ui/` are simpler and avoid the registry setup.

3. **React Flow license:** `@xyflow/react` is MIT for non-commercial use. For a tutorial, this is fine. If the tutorial is for a commercial product later, we'd need to consider the Pro license.
