import Header from "@/components/header";
import { JsonInputPanel } from "@/components/json-panel/json-input";
import { JsonOutputPanel } from "@/components/json-panel/json-output";

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 gap-3 overflow-hidden p-3">
        <div className="flex-1 min-w-0">
          <JsonInputPanel />
        </div>
        <div className="flex-1 min-w-0">
          <JsonOutputPanel />
        </div>
      </main>
    </div>
  );
}
