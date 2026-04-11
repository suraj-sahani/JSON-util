"use client";
import { JsonInputPanel } from "@/components/json-panel/json-input";
import { JsonOutputPanel } from "@/components/json-panel/json-output";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { INDENT_OPTIONS, SAMPLE_JSON } from "@/lib/constants";
import {
  ArrowShrink01Icon,
  Delete02Icon,
  Download01Icon,
  MagicWand01Icon,
  ThirdBracketSquareIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useMemo } from "react";

export default function Home() {
  const [input, setInput] = useState(SAMPLE_JSON);

  const { data, error } = useMemo(() => {
    if (!input.trim()) return { data: undefined, error: null };
    try {
      return { data: JSON.parse(input), error: null };
    } catch (e) {
      return { data: undefined, error: (e as Error).message };
    }
  }, [input]);
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b px-6 py-2.5">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={ThirdBracketSquareIcon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5 text-primary"
          />

          <h1 className="text-sm font-semibold text-foreground">
            JSON Formatter
          </h1>
          <span className="text-xs text-muted-foreground ml-1">
            — paste, format, explore
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Indent Group */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Indent</span>
            <ToggleGroup variant={"outline"} size={"sm"}>
              {INDENT_OPTIONS.map((option) => (
                <ToggleGroupItem key={option} value={option.toString()}>
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Button size={"sm"}>
            <HugeiconsIcon
              icon={MagicWand01Icon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
            />
            Format
          </Button>

          <Button size={"sm"} variant={"ghost"}>
            <HugeiconsIcon
              icon={ArrowShrink01Icon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
            />
            Minify
          </Button>

          <Button size={"icon-sm"} variant={"ghost"}>
            <HugeiconsIcon
              icon={Upload01Icon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
            />
          </Button>

          <Button size={"icon-sm"} variant={"ghost"}>
            <HugeiconsIcon
              icon={Download01Icon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
            />
          </Button>

          <Button size={"icon-sm"} variant={"ghost"}>
            <HugeiconsIcon
              icon={Delete02Icon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
            />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 gap-3 overflow-hidden p-3">
        <div className="flex-1 min-w-0">
          <JsonInputPanel value={input} onChange={setInput} />
        </div>
        <div className="flex-1 min-w-0">
          <JsonOutputPanel data={data} error={error} />
        </div>
      </main>
    </div>
  );
}
