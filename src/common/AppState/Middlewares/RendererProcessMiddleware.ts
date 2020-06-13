import { Middleware, Action } from "redux";
import { ipcRenderer } from "electron";
import AppState from "../States/AppState";
export default function RendererProcessMiddleware(): Middleware<
  unknown,
  unknown,
  any
> {
  return (store) => (next) => (action: Action) => {
    if (!ipcRenderer.eventNames().some((name) => name === "stateChanged")) {
      ipcRenderer.addListener("stateChanged", (_, action: Action) => {
        next(action);
      });
    }
    next(action);
    const state = store.getState();
    ipcRenderer.send("stateChanged", { type: action.type, state });
  };
}

async function getInitialState() {
  return new Promise<AppState>((res, error) => {
    ipcRenderer.on("INITIAL_STATE.RESPONSE", (_, payload: AppState) => {
      res(payload);
    });

    ipcRenderer.send("INITIAL_STATE.REQUEST");
  });
}
