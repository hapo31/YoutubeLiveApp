import { Middleware, Action, Dispatch, AnyAction, compose, applyMiddleware, createStore } from "redux";
import { ipcRenderer } from "electron";
import AppState from "@common/AppState/AppState";
import IPCEvent from "@events/IPCEvent";
import createAppReducer from "@common/AppState/AppStateReducer";
import { RendererInitialize } from "@common/AppState/Actions/AppStateAction";
function WebcontentsPreloadMiddleware(): Middleware {
  return (store) => (next) => (action: Action) => {
    console.log(ipcRenderer.eventNames());
    if (ipcRenderer.eventNames().every((name) => name !== IPCEvent.StateChanged.CHANNEL_NAME_FROM_MAIN)) {
      ipcRenderer.on(IPCEvent.StateChanged.CHANNEL_NAME_FROM_MAIN, (_, action: Action) => {
        next(action);
        console.log(action);
      });
    }
    next(action);
    ipcRenderer.send(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, action);
  };
}

export async function requestInitialState() {
  return new Promise<AppState>((res, error) => {
    ipcRenderer.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN, (_, payload: AppState) => {
      res(payload);
    });

    ipcRenderer.send(IPCEvent.InitialState.CHANNEL_NAME_FROM_PRELOAD);
  });
}

export default async function createSharedStore() {
  const myCreateStore = compose(applyMiddleware(WebcontentsPreloadMiddleware()))(createStore);
  const store = myCreateStore(createAppReducer(await requestInitialState()));
  store.dispatch(RendererInitialize());

  return store;
}
