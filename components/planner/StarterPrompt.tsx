"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface StarterPromptProps {
  prompt: string;
}

export function StarterPrompt({ prompt }: StarterPromptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="animate-fade-up border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>OpenCode Starter Prompt</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="font-code text-xs leading-6 bg-background/50 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words border border-border">
          {prompt}
        </pre>
      </CardContent>
    </Card>
  );
}
