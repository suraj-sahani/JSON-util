import { HighlightText } from "./highlight-text";

export const JsonValue: React.FC<{ value: unknown; searchQuery: string }> = ({
  value,
  searchQuery,
}) => {
  if (value === null)
    return (
      <span className="text-json-null">
        <HighlightText text={"null"} query={searchQuery} />
      </span>
    );
  if (typeof value === "boolean")
    return (
      <span className="text-json-boolean">
        <HighlightText text={String(value)} query={searchQuery} />
      </span>
    );
  if (typeof value === "number")
    return (
      <span className="text-json-number">
        <HighlightText text={String(value)} query={searchQuery} />
      </span>
    );
  if (typeof value === "string")
    return (
      <span className="text-json-string">
        &quot;
        <HighlightText text={value} query={searchQuery} />
        &quot;
      </span>
    );
  return null;
};
