"use client";

import { useState, useEffect, useCallback } from "react";
import { IdeaInput } from "@/components/planner/IdeaInput";
import { BriefWorkspace } from "@/components/planner/BriefWorkspace";
import { LoadingState } from "@/components/planner/LoadingState";
import { generateProjectBrief } from "@/app/actions";
import { saveBrief, loadBrief, clearBrief } from "@/lib/storage";
import type { ProjectBrief } from "@/app/types";

export default function Home() {
  const [brief, setBrief] = useState<ProjectBrief | null>(() => {
    if (typeof window === "undefined") return null;
    return loadBrief();
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage whenever brief changes
  useEffect(() => {
    if (brief) {
      saveBrief(brief);
    }
  }, [brief]);

  const handleSubmit = useCallback(async (idea: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateProjectBrief(idea);
      setBrief(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate brief. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdate = useCallback((updated: ProjectBrief) => {
    setBrief(updated);
  }, []);

  const handleReset = useCallback(() => {
    setBrief(null);
    clearBrief();
    setError(null);
  }, []);

  return (
    <main className="planner-bg min-h-screen flex-1 overflow-hidden">
      {isLoading ? (
        <LoadingState />
      ) : brief ? (
        <BriefWorkspace brief={brief} onUpdate={handleUpdate} onReset={handleReset} />
      ) : (
        <>
          <IdeaInput onSubmit={handleSubmit} isLoading={isLoading} />
          {error && (
            <div className="container mx-auto max-w-2xl px-4 pb-8">
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
