import { HugeiconsIcon } from "@hugeicons/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { countJsonLines } from "@/lib/utils";
import { CheckmarkSquare03Icon, Copy02Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { JsonNode } from "./node";
import { SearchBar } from "./searchbar";

export const JsonOutputPanel = () => {
  const output = useJSONStore((state) => state.output);
  const error = useJSONStore((state) => state.error);
  const indent = useJSONStore((state) => stat)

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatch, setCurrentMatch] = useState(0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);

  const totalLines = useMemo(() => {
    if (error || output === undefined) return 0;
    return countJsonLines(output);
  }, [output, error]);

  const formattedText = useMemo(() => {
    if (error || data === undefined) return "";
    return JSON.stringify(data, null, 2);
  }, [data, error]);

  const formattedLines = useMemo(
    () => formattedText.split("\n"),
    [formattedText],
  );

  const matches = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    const results: number[] = [];
    formattedLines.forEach((line, i) => {
      if (line.toLowerCase().includes(q)) results.push(i);
    });
    return results;
  }, [searchQuery, formattedLines]);

  useEffect(() => {
    if (currentMatch >= matches.length) setCurrentMatch(0);
  }, [matches, currentMatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "f") {
      e.preventDefault();
      setSearchVisible(true);
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentMatch((prev) => (prev + 1) % matches.length);
  }, [matches.length]);

  const handlePrev = useCallback(() => {
    setCurrentMatch((prev) => (prev - 1 + matches.length) % matches.length);
  }, [matches.length]);

  const handleScroll = () => {
    if (contentRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = contentRef.current.scrollTop;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-full flex-col overflow-hidden rounded-xl border-2 bg-card"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="flex items-center justify-between border-b-2 bg-muted/50 px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Output
        </span>
        <div className="flex items-center gap-2">
          {totalLines > 0 && (
            <span className="text-xs text-muted-foreground">
              {totalLines} lines
            </span>
          )}
          <Button
            size={"icon-xs"}
            variant={"ghost"}
            onClick={handleCopy}
            className="rounded p-1 hover:bg-accent"
            title="Copy"
          >
            {copied ? (
              <HugeiconsIcon
                icon={CheckmarkSquare03Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
                className="h-3.5 w-3.5 text-json-string"
              />
            ) : (
              <HugeiconsIcon
                icon={Copy02Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
                className="h-3.5 w-3.5 text-muted-foreground"
              />
            )}
          </Button>
        </div>
      </div>
      <SearchBar
        visible={searchVisible}
        onClose={() => {
          setSearchVisible(false);
          setSearchQuery("");
        }}
        onSearch={setSearchQuery}
        matchCount={matches.length}
        currentMatch={currentMatch}
        onNext={handleNext}
        onPrev={handlePrev}
      />
      {error ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <p className="text-sm text-destructive font-medium">Invalid JSON</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              {error}
            </p>
          </div>
        </div>
      ) : data === undefined ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-sm text-muted-foreground">
            Paste JSON on the left to see formatted output
          </p>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <div
            ref={lineNumberRef}
            className="shrink-0 overflow-hidden bg-editor-gutter select-none border-r-2 px-2 py-2 text-center"
            style={{
              width: `${Math.max(2, String(totalLines).length) * 0.6 + 1.2}rem`,
            }}
          >
            {Array.from({ length: totalLines }, (_, i) => (
              <div
                key={i}
                className={`font-mono text-xs leading-5 ${
                  matches.includes(i)
                    ? i === matches[currentMatch]
                      ? "text-foreground font-semibold"
                      : "text-json-key"
                    : "text-editor-line-number"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div
            ref={contentRef}
            className="flex-1 overflow-auto p-2 font-mono text-xs leading-5"
            onScroll={handleScroll}
          >
            <JsonNode
              data={data}
              depth={0}
              startLine={0}
              searchQuery={searchQuery}
              currentMatchLine={
                matches.length > 0 ? matches[currentMatch] : null
              }
              onLineCount={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
};
