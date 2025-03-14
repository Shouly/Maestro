import { useState } from "react";
import { MainLayout } from "./components/layout/main-layout";
import { ChatInterface } from "./components/chat/chat-interface";
import { ToolOutput } from "./components/tools/tool-output";

function App() {
  const [toolOutput, setToolOutput] = useState<{
    type: "screenshot" | "command" | "text" | "none";
    content: string;
  }>({
    type: "none",
    content: "",
  });

  return (
    <MainLayout>
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-full overflow-hidden rounded-lg border">
          <ChatInterface />
        </div>
        <div className="h-full overflow-hidden rounded-lg border">
          <ToolOutput output={toolOutput.content} type={toolOutput.type} />
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
