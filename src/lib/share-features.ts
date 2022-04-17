import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";
import memoize from "memoize-one";
import { subscribe } from "valtio";
import { WebsocketProvider } from "y-websocket";
import { WebrtcProvider } from "y-webrtc";

export type YjsOption = { key: string; roomId: string; onYDocCreated?: (ydoc: Y.Doc) => void } & (
  | { type: "ws"; serverUrl: string; options?: ConstructorParameters<typeof WebsocketProvider>[3] }
  | { type: "rtc"; options?: ConstructorParameters<typeof WebrtcProvider>[2] }
);

const initYjs = memoize((options: YjsOption) => {
  const ydoc = new Y.Doc();
  if (options.type === "rtc") {
    new WebrtcProvider(options.roomId, ydoc, options.options);
  } else {
    new WebsocketProvider(options.serverUrl, options.roomId, ydoc, options.options);
  }
  options.onYDocCreated?.(ydoc);
  return ydoc;
});

export function withYjs(store: Record<string, unknown>, options: YjsOption) {
  const ydoc = initYjs(options);
  bindProxyAndYMap(store, ydoc.getMap(options.key));
  return store;
}

export type PersistOption = { persistKey: string; watch?: boolean };

export function withPersist(store: Record<string, unknown>, options: PersistOption) {
  function loadPersistData() {
    Object.assign(store, JSON.parse(localStorage.getItem(options.persistKey) || "{}"));
  }
  subscribe(store, () => {
    localStorage.setItem(options.persistKey, JSON.stringify(store));
  });

  loadPersistData();
  if (options.watch) {
    window.addEventListener("storage", loadPersistData);
  }

  return store;
}
