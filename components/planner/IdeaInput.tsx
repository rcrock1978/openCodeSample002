"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export function IdeaInput({ onSubmit, isLoading }: IdeaInputProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;
    onSubmit(idea.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center mb-10 animate-fade-up">
        <div className="micro-label mb-4">AI Project Planner</div>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
          Turn Ideas Into Plans
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-8">
          Describe your app idea in a sentence or two. We will generate a complete project brief with tech stack, data model, and a starter prompt.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <Textarea
            placeholder="e.g., A habit tracker app where users can log daily habits, streaks, and get reminders..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="min-h-[120px] text-base leading-7"
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!idea.trim() || isLoading}
              size="lg"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Brief
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
