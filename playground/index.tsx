import ReactDOM from "react-dom";
import { defineGlobalComponent } from "../packages/lib/src/index";

const Counter = defineGlobalComponent({
  getComponent({ useState }) {
    return () => {
      const [count, setCount] = useState(0);
      return <button onClick={() => setCount(count + 1)}>{count}</button>;
    };
  },
});

function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
