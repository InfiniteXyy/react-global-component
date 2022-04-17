# react-global-component

## Intro

You may heard about lots of react global state libs, `redux`, `mobx`, etc.

But have you thought about creating a global stateful `component` in React?

This tools allows you to define a global component, wherever you use it, all components will share the same state, even over different browser tabs, over internet(with Yjs).

**Note**: This tools is not production ready, it is just a demo, and lack of tests.

Try the example App on [codesandbox](https://codesandbox.io/s/react-global-component-example-wldiep)
## Example

```bash
npm install react-global-component valtio

# Optional dependencies, install if you want to use the yjs shared features
npm install yjs valtio-yjs y-websocket y-webrtc
```

```tsx
const GlobalCounter2 = defineGlobalComponent({
  getComponent({ useState }) {
    return ({ prefix }: { prefix: string }) => {
      const [count, setCount] = useState(0);
      return (
        <button onClick={() => setCount(count + 2)}>
          {prefix}: {count}
        </button>
      );
    }
  },
});

// Use in anywhere, it will share the same state
<GlobalCounter prefix="1" />
<GlobalCounter prefix="2" />
```

## Use Cases

### 1. keep-alive

Use it to prevent your component state from being destroyed. For example, in a tab switch case.

### 2. Global state provider

Use this lib as a global state provider. Your cans share the state between different components.

And with the support of Yjs, you can easily share you global state over WebSocket or WebRTC

```tsx
const Provider = defineGlobalComponent({
  getComponent({ useState }) {
    return ({ component: Comp }) => {
      const [count, setCount] = useState(0);
      return <Comp count={count} />;
    };
  },
});

<Provider component={YourComponent} />;
```

### 3. Persist your component

Use the persist plugin, It's so easy to persist a component, without any special api, just use `useState` or `useReducer`

```tsx
const Provider = defineGlobalComponent({
  plugins: [persist({ key: "xxx" })],
  getComponent({ useState }) {
    ...
  },
});

<Provider component={YourComponent} />;
```

## How

The principle is very simple, this lib will provide a custom useState/useReducer function, which use `valtio` in the back, instead of the default React hooks function.

So every component will be connected to the global state, and will trigger rerender when state changes.

All the other features are base on the global state, like persist, or rtc share

## Todo

- [ ] use babel etc to override the default react hooks implicitly
- [ ] add tests
- [x] yjs/persist more options
