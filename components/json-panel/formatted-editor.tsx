"use client";
import { useJSONStore } from "@/lib/store";
import { Editor, type Monaco, OnMount } from "@monaco-editor/react";
import { useRef } from "react";

export default function FormattedEditor() {
  const editorRef = useRef<Monaco>(null);
  const output = useJSONStore((store) => store.output);
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border-2 bg-card">
      <Editor
        defaultLanguage="json"
        defaultValue={JSON.stringify(output)}
        onMount={handleEditorDidMount}
        theme="vs-dark"
      />
    </div>
  );
}
