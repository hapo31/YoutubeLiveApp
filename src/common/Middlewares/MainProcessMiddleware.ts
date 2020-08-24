import { Middleware, Action } from "redux";
import { ipcMain } from "electron";
import App from "@mainprocess/App";

import IPCEvent from "@events/IPCEvent";

export default function MainProcessMiddleware(): Middleware {
  return (store) => (next) => (action: Action) => {
    // イベントリスナが未登録なら登録する
    if (!ipcMain.eventNames().some((name) => name === IPCEvent.InitialState.CHANNEL_NAME_FROM_PRELOAD)) {
      // state の初期値要求
      ipcMain.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_PRELOAD, (event) => {
        const state = store.getState();
        event.sender.send(IPCEvent.StateChanged.CHANNEL_NAME_FROM_MAIN, {
          type: IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN,
          payload: state,
        });
      });
    }
    // イベントリスナが未登録なら登録する
    if (!ipcMain.eventNames().some((name) => name === IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD)) {
      ipcMain.on(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, (event, action: Action) => {
        console.log({ MainProcessMiddleWare: action });
        App.childWindows.forEach(
          (value) => event.sender != value.webContents && value.webContents.send(IPCEvent.StateChanged.CHANNEL_NAME_FROM_MAIN, action)
        );
        next(action);
      });
    }

    next(action);
    App.childWindows.forEach((value) => value.webContents.send(IPCEvent.StateChanged.CHANNEL_NAME_FROM_MAIN, action));
    console.log({ action });
  };
}
