import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  clean: true,
  externals: ["valtio", "valtio-yjs", "yjs", "y-webrtc", "y-websocket", "react", "memoize-one"],
});
