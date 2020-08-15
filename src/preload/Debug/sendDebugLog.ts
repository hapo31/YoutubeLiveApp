import { ipcRenderer } from "electron";

export default function sendDebugLog(object: unknown) {
  console.log({ SendDebugLog: object });
  ipcRenderer.send("DEBUG.SHOW_LOG", object);
}
