import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { defineGlobalComponent } from "./define-global-component";

const GlobalCounter1 = defineGlobalComponent({
  share: { persist: { key: "counter1" } },
  getComponent: ({ useState }) => {
    return () => {
      const [count, setCount] = useState(0);
      const [input, setInput] = useState("");
      return (
        <div>
          <button onClick={() => setCount(count + 1)}>{count}</button>
          <input value={input} onChange={(e) => setInput(e.target.value)}></input>
        </div>
      );
    };
  },
});

const GlobalCounter2 = defineGlobalComponent({
  share: { rtc: { key: "counter2" } },
  getComponent: ({ useState }) => {
    return ({ uniqId }: { uniqId: string }) => {
      const [count, setCount] = useState(0);
      const doubled = useMemo(() => count * 2, [count]);
      return (
        <>
          <button onClick={() => setCount(count + 2)}>
            {uniqId}: {count}
          </button>
          <div>doubled is {doubled}</div>
        </>
      );
    };
  },
});

function App() {
  const [outerInput, setOuterInput] = useState("");
  return (
    <>
      <h3>Outer Input</h3>
      <input value={outerInput} onChange={(e) => setOuterInput(e.target.value)} />
      <h3>Persisted Counter and Input</h3>
      <GlobalCounter1 />
      <GlobalCounter1 />
      <h3>WebRTC shared counter</h3>
      <GlobalCounter2 uniqId={`${outerInput}1`} />
      <GlobalCounter2 uniqId={`${outerInput}2`} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
