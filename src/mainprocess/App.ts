import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { BrowserWindow, App, app, Menu, ipcMain } from "electron";
import menuTemplate from "./MenuTemplate";
import { compose, applyMiddleware, createStore, StoreCreator, Action, Store } from "redux";
import MainProcessMiddleware from "@common/Middlewares/MainProcessMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import IPCEvent from "@common/events/IPCEvent";
import { Actions as AppStateAction, ChangeURLAction } from "@common/AppState/Actions/AppStateAction";
import AppState from "@common/AppState/AppState";
import openBrowser from "./NativeBridge/OpenBrowser";
import resumeAppState from "./resumeAppState";
import { exit } from "process";

const isDebug = process.env.NODE_ENV == "development";

class MyApp {
  private appStore?: Store<AppState, AppStateAction>;
  public window?: BrowserWindow;
  public chatBox?: BrowserWindow;

  private app: App;

  constructor(app: App) {
    this.app = app;
    this.app = this.app.on("ready", this.onReady);
    this.app.on("window-all-closed", this.onWindowAllClosed);
  }

  private onReady = () => {
    const myCreateStore: StoreCreator = compose(applyMiddleware(MainProcessMiddleware()))(createStore);

    const state = resumeAppState("./config.json", ".save/app.json");
    this.appStore = myCreateStore(createAppReducer(state));

    Menu.setApplicationMenu(menuTemplate);

    const windowOption: Electron.BrowserWindowConstructorOptions = {
      title: "YoutubeLiveApp",
      acceptFirstMouse: true,
      alwaysOnTop: true,
      width: 1400,
      height: 900,
      webPreferences: {
        webviewTag: true,
        nodeIntegration: true,
      },
    };

    ipcMain.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_PRELOAD, (event) => {
      event.sender.send(IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN, this.appStore?.getState());
    });
    ipcMain.on(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, (_, action: Action<AppState>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.appStore?.dispatch(action as any);
    });

    ipcMain.on(IPCEvent.NavigationChange.NAVIGATION_PAGE_FROM_PRELOAD, (_, url) => {
      console.log({ "IPCEvent.NavigationChange.NAVIGATION_PAGE_FROM_PRELOAD": url });
      this.appStore?.dispatch(ChangeURLAction(url));
    });

    const preloadBasePath = isDebug ? "./dist/scripts/" : "/scripts/";
    this.window = new BrowserWindow(windowOption);

    this.window.loadURL(state.nowUrl);

    const preloadJSCode = readFileSync(path.resolve(preloadBasePath, "preload.js")).toString("utf-8");
    console.log("Loaded preload.js");
    this.window?.webContents.executeJavaScript(preloadJSCode);

    this.window.webContents.on("new-window", (event, url) => {
      event.preventDefault();
      console.log({ url });

      // 開こうとしているURLが外部だったらブラウザで開く
      if (!/^https?:\/\/studio\.youtube.com/.test(url)) {
        openBrowser(url);
        return;
      }

      if (url.indexOf("live_chat?") < 0) {
        return;
      }
      this.chatBox = new BrowserWindow({
        ...windowOption,
        width: 600,
        height: 700,
        minWidth: undefined,
        minHeight: undefined,
        show: isDebug,
      });

      this.chatBox.once("ready-to-show", () => {
        const chatboxJSCode = readFileSync(path.resolve(preloadBasePath, "chatbox.js")).toString("utf-8");
        console.log("Loaded chatbox.js");
        this.chatBox?.webContents.executeJavaScript(chatboxJSCode);
      });
      this.chatBox.loadURL(url);

      if (isDebug) {
        this.chatBox.webContents.openDevTools();
      }
    });

    if (isDebug) {
      this.window.webContents.openDevTools();
    }
  };

  private onWindowAllClosed = () => {
    const state = this.appStore?.getState();
    const JSONstring = JSON.stringify(state);
    writeFileSync(".save/app.json", JSONstring);
    this.app.quit();
  };
}

export default new MyApp(app);
