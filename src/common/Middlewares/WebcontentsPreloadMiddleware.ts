import { Middleware, Action } from "redux";
import { ipcRenderer } from "electron";
import AppState from "@common/AppState/AppState";
import IPCEvent from "@events/IPCEvent";
export default function RendererProcessMiddleware(): Middleware {
  return (store) => (next) => (action: Action) => {
    if (!ipcRenderer.eventNames().some((name) => name === IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD)) {
      ipcRenderer.addListener(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, (_, action: Action) => {
        next(action);
      });
    }
    next(action);
    ipcRenderer.send(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, action);
    console.log(`state changed:${JSON.stringify(store.getState())}`);
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
