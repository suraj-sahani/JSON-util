"use client";
import {
  ArrowShrink01Icon,
  Delete02Icon,
  Download01Icon,
  MagicWand01Icon,
  ThirdBracketSquareIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { INDENT_OPTIONS } from "@/lib/constants";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useJSONStore } from "@/lib/store";
import { useCallback, useMemo } from "react";

export default function Header() {
  const input = useJSONStore((state) => state.input);
  const setInput = useJSONStore((state) => state.setInput);
  const indent = useJSONStore((state) => state.indent);
  const setIndent = useJSONStore((state) => state.setIndent);

  const { data, error } = useMemo(() => {
    if (!input.trim()) return { data: undefined, error: null };
    try {
      const parsedInput = JSON.parse(input);
      const formattedIput = JSON.stringify(parsedInput, null, indent);
      return { data: JSON.parse(formattedIput), error: null };
    } catch (e) {
      return { data: undefined, error: (e as Error).message };
    }
  }, [input, indent]);

  const handleFormat = useCallback(() => {
    if (data !== undefined) {
      setInput(JSON.stringify(data, null, indent));
    }
  }, [data, indent]);

  const handleMinify = useCallback(() => {
    if (data !== undefined) {
      setInput(JSON.stringify(data));
    }
  }, [data]);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  return (
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
          <ToggleGroup
            variant={"outline"}
            size={"sm"}
            value={[indent.toString()]}
            onValueChange={(val) => setIndent(Number(val[0]))}
            className={""}
          >
            {INDENT_OPTIONS.map((option) => (
              <ToggleGroupItem
                key={option}
                value={option.toString()}
                className={
                  "aria-pressed:bg-black aria-pressed:text-muted dark:aria-pressed:bg-foreground dark:aria-pressed:text-muted"
                }
              >
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <Button size={"sm"} onClick={handleFormat}>
          <HugeiconsIcon
            icon={MagicWand01Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
          Format
        </Button>

        <Button size={"sm"} variant={"ghost"} onClick={handleMinify}>
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

        <Button size={"icon-sm"} variant={"ghost"} onClick={handleClear}>
          <HugeiconsIcon
            icon={Delete02Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
