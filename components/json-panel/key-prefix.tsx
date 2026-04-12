import { HighlightText } from "./highlight-text";

export const KeyPrefix: React.FC<{ keyName?: string; searchQuery: string }> = ({
  keyName,
  searchQuery,
}) => {
  if (keyName === undefined) return null;
  return (
    <>
      <span className="text-json-key">
        &quot;
        <HighlightText text={keyName} query={searchQuery} />
        &quot;
      </span>
      <span className="text-json-bracket">: </span>
    </>
  );
};
