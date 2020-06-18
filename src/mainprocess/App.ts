import { BrowserWindow, App, app, Menu, ipcMain, WebContents } from "electron";
import ParseString from "./ParseString";
import config from "@src/../config.json";
import menuTemplate from "./MenuTemplate";
import { compose, applyMiddleware, createStore, StoreCreator, Action, Store } from "redux";
import MainProcessMiddleware from "@common/Middlewares/MainProcessMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import IPCEvent from "@common/events/IPCEvent";
import { Actions as AppStateAction } from "@common/AppState/Actions/AppStateAction";
import AppState from "@common/AppState/AppState";
import createInitialState from "./getInitialState";
import { readFileSync } from "fs";
import path from "path";

const isDebug = process.env.NODE_ENV == "development";

class MyApp {
  private appStore: Store<AppState, AppStateAction>;

  public window?: BrowserWindow;
  public chatBox?: BrowserWindow;

  private app: App;

  constructor(app: App) {
    const myCreateStore: StoreCreator = compose(applyMiddleware(MainProcessMiddleware()))(createStore);

    this.appStore = myCreateStore(createAppReducer(createInitialState(ParseString(config.firstView, config))));

    this.app = app;
    this.app = this.app.on("ready", this.onReady);
    this.app.on("activate", this.onActivated);
    this.app.on("window-all-closed", this.onWindowAllClosed);
  }

  private onReady = () => {
    const state = this.appStore.getState();

    Menu.setApplicationMenu(menuTemplate);

    const windowOption: Electron.BrowserWindowConstructorOptions = {
      title: "YoutubeLiveApp",
      acceptFirstMouse: true,
      alwaysOnTop: true,
      width: 1400,
      height: 900,
      minWidth: 1400,
      minHeight: 900,
      webPreferences: {
        webviewTag: true,
        nodeIntegration: true,
      },
    };

    ipcMain.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_PRELOAD, (event) => {
      event.sender.send(IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN, this.appStore.getState());
    });
    ipcMain.on(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, (_, action: Action<AppState>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.appStore.dispatch(action as any);
    });

    const preloadBasePath = isDebug ? "./dist/scripts/" : "/scripts/";

    this.window = new BrowserWindow(windowOption);

    this.window.loadURL(state.url);
    this.window.webContents.on("new-window", (event, url) => {
      if (url.indexOf("live_chat?") < 0) {
        return;
      }
      event.preventDefault();
      this.chatBox = new BrowserWindow({
        ...windowOption,
        width: 600,
        height: 700,
        minWidth: undefined,
        minHeight: undefined,
        show: isDebug,
      });

      this.chatBox.loadURL(url);
      this.chatBox.once("ready-to-show", () => {
        console.log("hpge");
        const chatboxJSCode = readFileSync(path.resolve(preloadBasePath, "chatbox.js")).toString("utf-8");
        console.log("Loaded chatbox.js");
        this.chatBox?.webContents.executeJavaScript(chatboxJSCode);
      });

      if (isDebug) {
        this.chatBox.webContents.openDevTools();
      }
    });

    this.window.on("ready-to-show", () => {
      const preloadJSCode = readFileSync(path.resolve(preloadBasePath, "preload.js")).toString("utf-8");
      console.log("Loaded preload.js");
      this.window?.webContents.executeJavaScript(preloadJSCode);
    });

    if (isDebug) {
      this.window.webContents.openDevTools();
    }
  };

  private onActivated = () => {
    console.log("Activated");
  };
  private onWindowAllClosed = () => {
    this.app.quit();
  };
}

export default new MyApp(app);
