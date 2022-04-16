import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlobalCounter1 } from "./counter1";
import { GlobalCounter2 } from "./counter2";

function App() {
  return (
    <>
      <h3>Persisted Counter and Input</h3>
      <GlobalCounter1 />
      <GlobalCounter1 />
      <h3>Yjs(over websocket) shared counter</h3>
      <GlobalCounter2 uniqId={`1`} />
      <GlobalCounter2 uniqId={`2`} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
