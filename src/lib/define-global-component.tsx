import type { ComponentType } from "react";
import React from "react";
import { proxy, useSnapshot } from "valtio";
import { withPersist, withYjs } from "./share-features";
import { withCustomApi } from "./override-react";

type GlobalComponentOption<Props> = {
  share?: { yjs?: { key: string }; persist?: { key: string } };
  render: (props: Props) => JSX.Element;
};

export function defineGlobalComponent<Props = {}>(option: GlobalComponentOption<Props>): ComponentType<Props> {
  const { share, render } = option;
  let store = proxy<Record<string, unknown>>({});
  if (share?.persist) store = withPersist(store, share.persist?.key);
  if (share?.yjs) store = withYjs(store, share.yjs.key);

  let maxStateIndex: number;
  return React.memo(function (props: Props) {
    let stateIndex = 0;

    const [customApi] = React.useState(() => {
      const useState = (initialState: unknown) => {
        if (maxStateIndex !== undefined) stateIndex = stateIndex % maxStateIndex;
        const id = stateIndex;
        if (!(id in store)) {
          store[id] = typeof initialState === "function" ? initialState() : initialState;
        }
        stateIndex++;
        return [
          useSnapshot(store)[id],
          React.useCallback((payload: unknown) => {
            store[id] = typeof payload === "function" ? payload(store[id]) : payload;
          }, []),
        ];
      };

      const useReducer = (reducer: any, initialArg: any, init: any) => {
        const [state, setState] = useState(() => {
          return init ? init(initialArg) : initialArg;
        }) as any;
        return [
          state,
          React.useCallback((payload: any) => setState((prevState: unknown) => reducer(prevState, payload)), [reducer]),
        ];
      };

      return { useState, useReducer };
    });

    React.useEffect(() => void (maxStateIndex ??= stateIndex), []);

    return withCustomApi(() => render(props), customApi);
  }) as unknown as ComponentType<Props>;
}
