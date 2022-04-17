import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";
import memoize from "memoize-one";
import { WebsocketProvider } from "y-websocket";
import { WebrtcProvider } from "y-webrtc";

type YjsOption = { key: string; roomId: string; onYDocCreated?: (ydoc: Y.Doc) => void } & (
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

function yjs(options: YjsOption): (store: Record<string, unknown>) => void {
  const ydoc = initYjs(options);
  return (store) => {
    bindProxyAndYMap(store, ydoc.getMap(options.key));
  };
}

export { yjs, YjsOption };
