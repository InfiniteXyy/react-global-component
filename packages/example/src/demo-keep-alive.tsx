import { useState } from "react";
import { defineGlobalComponent } from "react-global-component";

const Tab1 = defineGlobalComponent({
  getComponent: ({ useState }) => {
    return () => {
      const [input, setInput] = useState("");
      return <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="type something" />;
    };
  },
});

const Tab2 = defineGlobalComponent({
  getComponent: ({ useState }) => {
    return () => {
      const [count, setCount] = useState(0);
      return <button onClick={() => setCount(count + 1)}>{count}</button>;
    };
  },
});

export function DemoKeepAlive() {
  const [tab, setTab] = useState<0 | 1>(0);
  return (
    <div>
      <h3>Keep alive tabs example</h3>
      <nav>
        <span style={{ fontWeight: tab === 0 ? "bolder" : undefined, cursor: "pointer" }} onClick={() => setTab(0)}>
          tab1
        </span>
        <span style={{ fontWeight: tab === 1 ? "bolder" : undefined, cursor: "pointer" }} onClick={() => setTab(1)}>
          tab2
        </span>
      </nav>
      <div>
        {tab === 0 && <Tab1 />}
        {tab === 1 && <Tab2 />}
      </div>
    </div>
  );
}
