"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoadingState() {
  return (
    <div className="container mx-auto max-w-[1500px] px-4 py-8 lg:py-12">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]">
        {/* Left: Graph skeleton */}
        <div className="blueprint-surface h-[500px] lg:h-auto lg:min-h-[600px] animate-pulse rounded-xl" />

        {/* Right: Editor skeleton */}
        <div className="space-y-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <CardHeader>
                <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
