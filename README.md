# react-shared-components

## Intro
You may heard about lots of react global state libs, `redux`, `mobx`, etc.

But have you thought about creating a global stateful `component` in React?

This tools allows you to define a global component, wherever you use it, all components will share the same state, even over different browser tabs, over internet(with Yjs).

**Note**: This tools is not production ready, it is just a demo, and lack of tests.

## Try

```bash
npm install
npm run dev
```

## How
The principle is very simple, this lib will provide a custom useState/useReducer function, which use valtio in the back, instead of the default React hooks function.

So every component will be connected to the global state, and will trigger rerender when state changes.

All the other features are base on the global state, like persist, or rtc share

## Todo
[] why not create a (babel) plugin, to overwrite the useState function implicitly
[] add tests
[] yjs/persist more options