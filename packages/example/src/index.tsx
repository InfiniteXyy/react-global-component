import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DemoKeepAlive } from "./demo-keep-alive";
import { DemoPersist } from "./demo-persist";
import { DemoProvider } from "./demo-provider";
import { DemoTodoYjs } from "./demo-todo-yjs";
import { DemoYjs } from "./demo-yjs";

function App() {
  return (
    <>
      <DemoPersist />
      <DemoYjs />
      <DemoTodoYjs />
      <DemoKeepAlive />
      <DemoProvider />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
