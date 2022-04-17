import { subscribe } from "valtio";

type PersistOption = { persistKey: string; watch?: boolean };
function persist(options: PersistOption): (store: Record<string, unknown>) => void {
  return (store) => {
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
  };
}

export { persist, PersistOption };
