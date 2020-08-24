import { Middleware, Action, compose, applyMiddleware, createStore, Reducer } from "redux";
import { ipcRenderer } from "electron";
import IPCEvent from "@events/IPCEvent";
import { RendererInitialize } from "@common/AppState/Actions/AppStateAction";

function WebcontentsPreloadMiddleware(): Middleware {
  return (store) => (next) => (action: Action) => {
    if (ipcRenderer.eventNames().every((name) => name !== IPCEvent.StateChanged.CHANNEL_NAME_FROM_MAIN)) {
      ipcRenderer.on(IPCEvent.StateChanged.CHANNEL_NAME_FROM_MAIN, (_, action: Action) => {
        console.log({ WebcontentsPreloadMiddleware: action });
        next(action);
        console.log(action);
      });
    }
    next(action);
    ipcRenderer.send(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, action);
  };
}

export async function requestInitialState<State extends Record<string, unknown>>() {
  return new Promise<State>((res) => {
    ipcRenderer.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN, (_, payload: State) => {
      res(payload);
    });

    ipcRenderer.send(IPCEvent.InitialState.CHANNEL_NAME_FROM_PRELOAD);
  });
}

export default function createSharedStore<State>(reducer: Reducer<State>) {
  const myCreateStore = compose(applyMiddleware(WebcontentsPreloadMiddleware()))(createStore);
  const store = myCreateStore(reducer);
  store.dispatch(RendererInitialize());
  return store;
}
