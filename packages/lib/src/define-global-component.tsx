import type { ComponentType } from "react";
import React from "react";
import { proxy, useSnapshot } from "valtio";
import { withPersist, withYjs, YjsOption, PersistOption } from "./share-features";

type GlobalComponentOption<Props> = {
  share?: { yjs?: YjsOption; persist?: PersistOption };
  getComponent: (api: Pick<typeof React, "useState" | "useReducer">) => (props: Props) => JSX.Element;
};

export function defineGlobalComponent<Props = {}>(option: GlobalComponentOption<Props>): ComponentType<Props> {
  const { share, getComponent } = option;
  let store = proxy<Record<string, unknown>>({});
  if (share?.persist) store = withPersist(store, share.persist);
  if (share?.yjs) store = withYjs(store, share.yjs);

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

    return getComponent(customApi as any)(props);
  }) as unknown as ComponentType<Props>;
}
