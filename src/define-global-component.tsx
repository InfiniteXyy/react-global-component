import {
  Dispatch,
  SetStateAction,
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  ReducerStateWithoutAction,
  ReducerWithoutAction,
  DispatchWithoutAction,
  memo,
} from "react";
import { proxy, useSnapshot, subscribe } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { nanoid } from "nanoid";

type UseState = <S>(initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>];
type UseReducer = <R extends ReducerWithoutAction<any>, I>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerStateWithoutAction<R>
) => [ReducerStateWithoutAction<R>, DispatchWithoutAction];

type OverwriteApi = { useState: UseState; useReducer: UseReducer };

type GlobalComponentFactory<Props> = (api: OverwriteApi) => ComponentType<Props>;
type GlobalComponentOption<Props> = {
  share?: { rtc?: { key: string }; persist?: { key: string } };
  getComponent: GlobalComponentFactory<Props>;
};

const ydoc = new Y.Doc();
location.hash ||= nanoid();
new WebrtcProvider(location.hash, ydoc);

export function defineGlobalComponent<Props = {}>(option: GlobalComponentOption<Props>): ComponentType<Props> {
  const { share, getComponent } = option;
  let store = proxy<Record<string, unknown>>({});
  if (share?.persist) {
    const key = share.persist.key;
    store = proxy(JSON.parse(localStorage.getItem(key) || "{}"));
    subscribe(store, () => {
      localStorage.setItem(key, JSON.stringify(store));
    });
  }
  if (share?.rtc) {
    bindProxyAndYMap(store, ydoc.getMap(share.rtc.key));
  }

  let maxStateIndex: number;
  return memo((props: Props) => {
    let stateIndex = 0;

    const useState: UseState = useCallback(<S extends unknown>(initialState: S | (() => S)) => {
      if (maxStateIndex !== undefined) stateIndex = stateIndex % maxStateIndex;
      const id = stateIndex;
      if (!(id in store)) {
        store[id] = typeof initialState === "function" ? (initialState as () => S)() : initialState;
      }
      stateIndex++;
      return [
        useSnapshot(store)[id] as S,
        useCallback((payload) => {
          if (typeof payload === "function") {
            store[id] = (payload as unknown as (prevState: S) => S)(store[id] as S);
          } else {
            store[id] = payload;
          }
        }, []),
      ];
    }, []);

    const useReducer: UseReducer = useCallback(() => {
      throw new Error("useReducer is not supported");
    }, []);

    useEffect(() => void (maxStateIndex ??= stateIndex), []);

    const Component = useMemo(() => getComponent({ useState, useReducer }), []);

    return <Component {...props} />;
  }) as unknown as ComponentType<Props>;
}
