"use client";
import { CheckmarkSquare03Icon, Copy02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchBar } from "./searchbar";
import { Button } from "../ui/button";
import { useJSONStore } from "@/lib/store";

export const JsonInputPanel = () => {
  const input = useJSONStore((state) => state.input);
  const indent = useJSONStore((state) => state.indent);
  const setInput = useJSONStore((state) => state.setInput);
  const setError = useJSONStore((state) => state.setError);
  const setOutput = useJSONStore((state) => state.setOutput);

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatch, setCurrentMatch] = useState(0);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);

  const lines = input.split("\n");
  const lineCount = lines.length;

  const matches = useMemo(() => {
    if (!searchQuery) return [];
    const results: number[] = [];
    const q = searchQuery.toLowerCase();
    lines.forEach((line, i) => {
      if (line.toLowerCase().includes(q)) results.push(i);
    });
    return results;
  }, [searchQuery, lines]);

  useEffect(() => {
    if (currentMatch >= matches.length) setCurrentMatch(0);
  }, [matches, currentMatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "f") {
      e.preventDefault();
      setSearchVisible(true);
    }
  }, []);

  const scrollToMatch = useCallback(
    (idx: number) => {
      if (matches.length === 0 || !textareaRef.current) return;
      const lineIdx = matches[idx];
      const lineHeight = 20;
      textareaRef.current.scrollTop = lineIdx * lineHeight - 60;
    },
    [matches],
  );

  const handleNext = useCallback(() => {
    const next = (currentMatch + 1) % matches.length;
    setCurrentMatch(next);
    scrollToMatch(next);
  }, [currentMatch, matches.length, scrollToMatch]);

  const handlePrev = useCallback(() => {
    const prev = (currentMatch - 1 + matches.length) % matches.length;
    setCurrentMatch(prev);
    scrollToMatch(prev);
  }, [currentMatch, matches.length, scrollToMatch]);

  const handleScroll = () => {
    if (textareaRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // --- NEW: Paste Handler ---
  const handlePaste = () => {
    // We use setTimeout 0 to wait for the 'onChange' to finish and the
    // textarea value to be updated with the pasted content.
    setTimeout(() => {
      const currentVal = textareaRef.current?.value || "";
      try {
        if (currentVal.trim() === "") return;

        const parsed = JSON.parse(currentVal);
        // If parsing succeeds, we automatically update the output
        const indentedJSON = JSON.stringify(parsed, null, indent);

        setOutput(JSON.parse(indentedJSON));
        setError(null);
      } catch (err) {
        // If it's a paste but invalid JSON, show the error
        setError((err as Error).message);
      }
    }, 0);
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
          Input
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {lineCount} lines
          </span>
          <Button
            variant={"ghost"}
            size={"icon-xs"}
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
      <div className="flex flex-1 overflow-hidden">
        <div
          ref={lineNumberRef}
          className="shrink-0 overflow-hidden bg-editor-gutter select-none border-r-2 px-2 py-2 text-center"
          style={{
            width: `${Math.max(2, String(lineCount).length) * 0.6 + 1.2}rem`,
          }}
        >
          {lines.map((_, i) => (
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
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onScroll={handleScroll}
          onPaste={handlePaste}
          spellCheck={false}
          className="flex-1 resize-none bg-editor-bg p-2 font-mono text-xs leading-5 text-foreground outline-none"
          placeholder="Paste your JSON here..."
        />
      </div>
    </div>
  );
};
