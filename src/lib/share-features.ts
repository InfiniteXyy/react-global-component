import { nanoid } from "nanoid";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";
import memoize from "memoize-one";
import { subscribe } from "valtio";
import { WebsocketProvider } from "y-websocket";

const initYjs = memoize(() => {
  const ydoc = new Y.Doc();
  let room = new URLSearchParams(location.search).get("room");
  if (!room) {
    room = nanoid();
    window.history.replaceState(null, "", "?room=" + room);
  }
  new WebsocketProvider("wss://yjs-backend.fly.dev", room, ydoc);
  return ydoc;
});

initYjs();

export function withYjs(store: Record<string, unknown>, key: string) {
  const ydoc = initYjs();
  bindProxyAndYMap(store, ydoc.getMap(key));
  return store;
}

export function withPersist(store: Record<string, unknown>, key: string) {
  Object.assign(store, JSON.parse(localStorage.getItem(key) || "{}"));
  subscribe(store, () => {
    localStorage.setItem(key, JSON.stringify(store));
  });
  return store;
}
