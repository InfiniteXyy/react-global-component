import { useState } from "react";
import { defineGlobalComponent } from "./lib";

export const GlobalCounter1 = defineGlobalComponent({
  share: { persist: { key: "counter1" } },
  render: () => {
    const [count, setCount] = useState(0);
    const [input, setInput] = useState("");
    return (
      <div>
        <button onClick={() => setCount(count + 1)}>{count}</button>
        <input value={input} onChange={(e) => setInput(e.target.value)}></input>
      </div>
    );
  },
});
