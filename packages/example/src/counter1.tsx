import { defineGlobalComponent } from "react-global-component";

export const GlobalCounter1 = defineGlobalComponent({
  share: { persist: { persistKey: "counter1", watch: true } },
  getComponent({ useState }) {
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
