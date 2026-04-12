import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SAMPLE_JSON } from "./constants";

type JSONStoreState = {
  input: string;
  indent: number;
  output: string;
  error: string | null;
};

type JSONStoreActions = {
  setInput: (
    newInput:
      | JSONStoreState["input"]
      | ((currentJSON: JSONStoreState["input"]) => JSONStoreState["input"]),
  ) => void;
  setIndent: (
    newIndent:
      | JSONStoreState["indent"]
      | ((currentJSON: JSONStoreState["indent"]) => JSONStoreState["indent"]),
  ) => void;
  setOutput: (
    newOutput:
      | JSONStoreState["output"]
      | ((currentOutput: JSONStoreState["output"]) => JSONStoreState["output"]),
  ) => void;
  setError: (
    newError:
      | JSONStoreState["error"]
      | ((currentError: JSONStoreState["error"]) => JSONStoreState["error"]),
  ) => void;
};

type JSONStore = JSONStoreState & JSONStoreActions;

export const useJSONStore = create<JSONStore>()(
  persist(
    (set) => ({
      input: SAMPLE_JSON,
      setInput: (newInput) => {
        set((state) => ({
          input:
            typeof newInput === "function" ? newInput(state.input) : newInput,
        }));
      },
      indent: 2,
      setIndent: (newIndent) => {
        set((state) => ({
          indent:
            typeof newIndent === "function"
              ? newIndent(state.indent)
              : newIndent,
        }));
      },
      output: "",
      setOutput: (newOutput) => {
        set((state) => ({
          output:
            typeof newOutput === "function"
              ? newOutput(state.output)
              : newOutput,
        }));
      },
      error: null,
      setError: (newError) => {
        set((state) => ({
          error:
            typeof newError === "function" ? newError(state.error) : newError,
        }));
      },
    }),
    {
      name: "json-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
