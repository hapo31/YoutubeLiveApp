import { Middleware, Action } from "redux";
import { ipcMain, app } from "electron";
import App from "@mainprocess/App";

export default function MainProcessMiddleware(): Middleware {
  return (store) => (next) => (action: Action) => {
    if (!ipcMain.eventNames().some((name) => name === "stateChanged")) {
      ipcMain.addListener("stateChanged", (_, action: Action) => {
        next(action);
      });
    }

    next(action);
    const state = store.getState();
    App.windows.forEach((window) =>
      window.webContents.send("stateChanged", { type: action.type, state })
    );
  };
}
