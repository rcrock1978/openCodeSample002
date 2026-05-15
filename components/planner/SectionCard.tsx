"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface SectionCardProps {
  title: string;
  content: string | string[];
  onChange: (value: string | string[]) => void;
  type: "text" | "list";
}

export function SectionCard({ title, content, onChange, type }: SectionCardProps) {
  const [newItem, setNewItem] = useState("");

  if (type === "text") {
    return (
      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content as string}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    );
  }

  const items = content as string[];

  const addItem = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem("");
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <div className="flex-1 bg-background/30 border border-border rounded-lg px-3 py-2 text-sm">
              {item}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
            placeholder="Add an item..."
            className="flex-1 h-9 rounded-lg border border-border bg-background/30 px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
          <Button variant="outline" size="sm" onClick={addItem} className="h-9 px-3">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
