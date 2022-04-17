import { ComponentType, createContext } from "react";
import { defineGlobalComponent } from "react-global-component";

interface Props {
  count: number;
  setCount: (v: number) => void;
}

const Provider = defineGlobalComponent({
  getComponent({ useState }) {
    return ({ component: C }: { component: ComponentType<Props> }) => {
      const [value, setValue] = useState(3);
      return <C count={value} setCount={setValue} />;
    };
  },
});

const Component1 = (props: Props) => {
  return <input type="range" value={props.count} onChange={(e) => props.setCount(e.target.valueAsNumber)} />;
};

const Component2 = (props: Props) => {
  return <input type="number" value={props.count} onChange={(e) => props.setCount(e.target.valueAsNumber)} />;
};

export function DemoProvider() {
  return (
    <div>
      <h3>Provider Example</h3>
      <Provider component={Component1} />
      <Provider component={Component2} />
    </div>
  );
}
