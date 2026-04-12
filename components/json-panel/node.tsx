import { countJsonLines } from "@/lib/utils";
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { JsonValue } from "./json-value";
import { KeyPrefix } from "./key-prefix";

interface JsonNodeProps {
  data: unknown;
  keyName?: string;
  depth: number;
  startLine: number;
  searchQuery: string;
  currentMatchLine: number | null;
  onLineCount: (count: number) => void;
  trailing?: string;
}

export const JsonNode: React.FC<JsonNodeProps> = ({
  data,
  keyName,
  depth,
  startLine,
  searchQuery,
  currentMatchLine,
  onLineCount,
  trailing = "",
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const isObject = data !== null && typeof data === "object";
  const isArray = Array.isArray(data);

  const totalLines = useMemo(() => countJsonLines(data), [data]);

  useEffect(() => {
    onLineCount(totalLines);
  }, [totalLines, onLineCount]);

  if (!isObject) {
    return (
      <div className="leading-5">
        <KeyPrefix keyName={keyName} searchQuery={searchQuery} />
        <JsonValue value={data} searchQuery={searchQuery} />
        {trailing && <span className="text-json-bracket">{trailing}</span>}
      </div>
    );
  }

  const entries = isArray
    ? data.map((v, i) => [String(i), v] as const)
    : Object.entries(data as Record<string, unknown>);
  const openBracket = isArray ? "[" : "{";
  const closeBracket = isArray ? "]" : "}";
  const itemCount = entries.length;

  if (itemCount === 0) {
    return (
      <div className="leading-5">
        <KeyPrefix keyName={keyName} searchQuery={searchQuery} />
        <span className="text-json-bracket">
          {openBracket}
          {closeBracket}
        </span>
        {trailing && <span className="text-json-bracket">{trailing}</span>}
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="flex items-center gap-0.5 leading-5">
        <Button
          value={"ghost"}
          size={"icon-xs"}
          onClick={() => setCollapsed(false)}
          className="inline-flex items-center bg-transparent rounded p-0.5 hover:bg-accent"
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
            className="h-3 w-3 text-muted-foreground"
          />
        </Button>
        <KeyPrefix keyName={keyName} searchQuery={searchQuery} />
        <span className="text-json-bracket">{openBracket}</span>
        <span
          className="mx-1 rounded bg-accent px-1.5 py-0 text-[10px] text-muted-foreground font-extrabold cursor-pointer"
          onClick={() => setCollapsed(false)}
        >
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="text-json-bracket">{closeBracket}</span>
        {trailing && <span className="text-json-bracket">{trailing}</span>}
      </div>
    );
  }

  let currentLine = startLine + 1;

  return (
    <div>
      <div className="flex items-center gap-0.5 leading-5">
        <Button
          value={"ghost"}
          size={"icon-xs"}
          onClick={() => setCollapsed(true)}
          className="inline-flex items-center bg-transparent rounded p-0.5 hover:bg-accent"
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
            className="h-3 w-3 text-muted-foreground"
          />
        </Button>
        <KeyPrefix keyName={keyName} searchQuery={searchQuery} />
        <span className="text-json-bracket">{openBracket}</span>
      </div>
      <div className="pl-5">
        {entries.map(([key, val], idx) => {
          const childStartLine = currentLine;
          const childLineCount = countJsonLines(val);
          currentLine += childLineCount;
          const isLast = idx === entries.length - 1;
          return (
            <JsonNode
              key={key}
              data={val}
              keyName={isArray ? undefined : key}
              depth={depth + 1}
              startLine={childStartLine}
              searchQuery={searchQuery}
              currentMatchLine={currentMatchLine}
              onLineCount={() => {}}
              trailing={isLast ? "" : ","}
            />
          );
        })}
      </div>
      <div className="leading-5">
        <span className="text-json-bracket">{closeBracket}</span>
        {trailing && <span className="text-json-bracket">{trailing}</span>}
      </div>
    </div>
  );
};
