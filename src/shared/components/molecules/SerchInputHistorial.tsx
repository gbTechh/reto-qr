"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistorySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const HistorySearch = ({ value, onChange }: HistorySearchProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto px-4 ">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Filtrar por nombre o marca..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10 rounded-full bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/50 h-12 text-base"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
};
