import {
  ArrowDown02Icon,
  ArrowRight02Icon,
  ArrowUp02Icon,
  Cancel01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef } from "react";

interface SearchBarProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  matchCount: number;
  currentMatch: number;
  onNext: () => void;
  onPrev: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  visible,
  onClose,
  onSearch,
  matchCount,
  currentMatch,
  onNext,
  onPrev,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) inputRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="absolute top-2 right-4 z-20 flex items-center gap-1 rounded-md border bg-card px-2 py-1 shadow-sm">
      <HugeiconsIcon
        icon={Search01Icon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
        className="h-3.5 w-3.5 text-muted-foreground"
      />

      <input
        ref={inputRef}
        type="text"
        placeholder="Find..."
        className="w-48 bg-transparent px-1 py-0.5 font-mono text-xs outline-none placeholder:text-muted-foreground"
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter") {
            if (e.shiftKey) {
              onPrev();
            } else onNext();
          }
        }}
      />
      {matchCount > 0 && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {currentMatch + 1}/{matchCount}
        </span>
      )}
      <button
        onClick={onPrev}
        className="rounded p-0.5 hover:bg-accent"
        title="Previous"
      >
        <HugeiconsIcon
          icon={ArrowUp02Icon}
          size={24}
          color="currentColor"
          strokeWidth={1.5}
          className="h-3 w-3 text-muted-foreground"
        />
      </button>
      <button
        onClick={onNext}
        className="rounded p-0.5 hover:bg-accent"
        title="Next"
      >
        <HugeiconsIcon
          icon={ArrowDown02Icon}
          size={24}
          color="currentColor"
          strokeWidth={1.5}
          className="h-3 w-3 text-muted-foreground"
        />
      </button>
      <button onClick={onClose} className="rounded p-0.5 hover:bg-accent">
        <HugeiconsIcon
          icon={Cancel01Icon}
          size={24}
          color="currentColor"
          strokeWidth={1.5}
          className="h-3 w-3 text-muted-foreground"
        />
      </button>
    </div>
  );
};
