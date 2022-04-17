import { defineGlobalComponent } from "react-global-component";
import { yjs } from "react-global-component/plugin-yjs";

function init() {
  return { count: 2 };
}

function reducer(state: { count: number }, action: { type: string; payload?: number }) {
  switch (action.type) {
    case "increment":
      return { count: state.count + (action.payload ?? 1) };
    case "decrement":
      return { count: state.count - (action.payload ?? 1) };
    case "reset":
      return init();
    default:
      return state;
  }
}

const GlobalCounter2 = defineGlobalComponent({
  plugins: [yjs({ key: "counter2", roomId: "default", type: "ws", serverUrl: "wss://yjs-backend.fly.dev" })],
  getComponent({ useReducer }) {
    return ({ uniqId }: { uniqId: string }) => {
      const [state, dispatch] = useReducer(reducer, null, init);
      return (
        <>
          <div>[{uniqId}] simple calculator</div>
          <button onClick={() => dispatch({ type: "decrement" })}>-</button>
          <b>{state.count}</b>
          <button onClick={() => dispatch({ type: "increment" })}>+</button>
          <button onClick={() => dispatch({ type: "increment", payload: 2 })}>+2</button>
          <button onClick={() => dispatch({ type: "reset" })}>reset</button>
        </>
      );
    };
  },
});

export function DemoYjs() {
  return (
    <div>
      <h3>Yjs(over websocket) shared counter</h3>
      <GlobalCounter2 uniqId={`1`} />
      <GlobalCounter2 uniqId={`2`} />
    </div>
  );
}
