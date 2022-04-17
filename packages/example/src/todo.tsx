import { defineGlobalComponent } from "react-global-component";

export const GlobalTodo = defineGlobalComponent({
  share: { yjs: { key: "todo", roomId: "@react-shared-components/todolist", type: "rtc" } },
  getComponent({ useState }) {
    return () => {
      type Todo = { title: string; completed: boolean };
      const [todos, setTodos] = useState<Todo[]>([]);
      const [input, setInput] = useState("");
      return (
        <div>
          <div style={{ display: "flex", gap: 1 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)}></input>
            <button
              onClick={() => {
                if (todos.length > 10) {
                  alert("too many todos, delete some first");
                  return;
                }
                setTodos([...todos, { title: input, completed: false }]);
              }}
            >
              Add
            </button>
          </div>
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
