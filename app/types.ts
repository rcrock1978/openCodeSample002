export interface DataEntity {
  id: string;
  name: string;
  fields: string[];
  relations: { target: string; type: string }[];
}

export interface ProjectBrief {
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
