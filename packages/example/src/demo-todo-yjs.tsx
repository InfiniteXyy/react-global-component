import { useState } from "react";
import { defineGlobalComponent } from "react-global-component";
import { yjs } from "react-global-component/plugin-yjs";

function Input(props: { onInsert: (value: string) => void }) {
  const { onInsert } = props;
  const [input, setInput] = useState("");
  return (
    <div style={{ display: "flex", gap: 1 }}>
      <input value={input} onChange={(e) => setInput(e.target.value)}></input>
      <button
        onClick={() => {
          onInsert(input);
          setInput("");
        }}
      >
        Add
      </button>
    </div>
  );
}

const GlobalTodo = defineGlobalComponent({
  plugins: [yjs({ key: "todo", roomId: "@react-shared-components/todolist", type: "rtc" })],
  getComponent({ useState }) {
    return () => {
      type Todo = { title: string; completed: boolean };
      const [todos, setTodos] = useState<Todo[]>([]);
      return (
        <div>
          <Input
            onInsert={(title) => {
              if (todos.length > 10) {
                alert("too many todos, delete some first");
                return;
              }
              setTodos([...todos, { title, completed: false }]);
            }}
          />
          <ul>
            {todos.map((todo, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onClick={() => setTodos(todos.map((i) => (i === todo ? { ...todo, completed: !todo.completed } : i)))}
                />
                {todo.title}
                <span
                  onClick={() => setTodos(todos.filter((i) => i !== todo))}
                  style={{ marginLeft: 3, fontSize: 12, cursor: "pointer" }}
                >
                  ❌
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    };
  },
});

export function DemoTodoYjs() {
  return (
    <div>
      <h3>Yjs(over webrtc) shared TodoList</h3>
      <GlobalTodo />
    </div>
  );
}
