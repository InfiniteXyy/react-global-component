import { Dispatch, SetStateAction, ComponentType, memo, useCallback, useEffect, useMemo } from "react";
import { proxy, useSnapshot } from "valtio";

type GetComponent<T> = (api: {
  useState: <S>(initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>];
}) => ComponentType<T>;

export function defineGlobalComponent<T = {}>(getComponent: GetComponent<T>): ComponentType<T> {
  const store = proxy([] as any[]);
  return memo((props) => {
    let stateIndex = 0;
    let maxStateIndex: number;
    const useState = useCallback((s: any) => {
      if (maxStateIndex !== undefined) stateIndex = stateIndex % maxStateIndex;
      const id = stateIndex;
      if (!(id in store)) {
        console.log(store);
        store[id] = typeof s === "function" ? s() : s;
      }
      stateIndex++;
      return [useSnapshot(store)[id], (v: any) => (store[id] = v)];
    }, []);
    useEffect(() => void (maxStateIndex = stateIndex), []);
    const Component: any = useMemo(() => getComponent({ useState: useState as any }), []);

    return <Component {...props} />;
  }) as any;
}
