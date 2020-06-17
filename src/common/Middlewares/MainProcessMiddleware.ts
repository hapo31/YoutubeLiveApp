import { Middleware, Action } from "redux";
import { ipcMain } from "electron";
import App from "@mainprocess/App";

import IPCEvent from "@events/IPCEvent";
import { EventType } from "../events/EventBase";
import AppState from "../AppState/AppState";

export default function MainProcessMiddleware(): Middleware {
  return (store) => (next) => (action: Action) => {
    if (!ipcMain.eventNames().some((name) => name === IPCEvent.InitialState.CHANNEL_NAME_FROM_RENDERER)) {
      ipcMain.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_RENDERER, (_, data: EventType<AppState>) => {
        const state = store.getState();
        App.windows.forEach((window) =>
          window.webContents.send(IPCEvent.StateChanged.CHANNEL_NAME_FROM_MAIN, {
            type: IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN,
            payload: state,
          })
        );
      });
    }
    if (!ipcMain.eventNames().some((name) => name === IPCEvent.StateChanged.CHANNEL_NAME_FROM_RENDERER)) {
      ipcMain.addListener(IPCEvent.StateChanged.CHANNEL_NAME_FROM_RENDERER, (_, action: Action) => {
        next(action);
      });
    }

    next(action);
    App.windows.forEach((window) => window.webContents.send(IPCEvent.StateChanged.CHANNEL_NAME_FROM_MAIN, action));
    console.log(`state changed:${JSON.stringify(store.getState())}`);
  };
}
