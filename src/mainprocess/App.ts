import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { BrowserWindow, App, app, Menu, ipcMain } from "electron";
import { compose, applyMiddleware, createStore, StoreCreator, Action, Store } from "redux";
import { mainMenuTemplate, chatboxMenuTemplate } from "./MenuTemplate";
import MainProcessMiddleware from "@common/Middlewares/MainProcessMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import IPCEvent from "@common/events/IPCEvent";
import { Actions as AppStateAction, ChangeURLAction, ResetSuperchatList } from "@common/AppState/Actions/AppStateAction";
import AppState from "@common/AppState/AppState";
import openBrowser from "./NativeBridge/OpenBrowser";
import resumeData from "./resumeData";

const isDebug = process.env.NODE_ENV == "development";
const preloadBasePath = isDebug ? "./dist/scripts/" : "./resources/app/scripts/";

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

    const saveData = resumeData("./config.json", ".save/app.json");
    const initialState = {
      nowUrl: saveData.nowUrl,
      superChats: [],
    };
    this.appStore = myCreateStore(createAppReducer(initialState));

    Menu.setApplicationMenu(mainMenuTemplate);

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

    this.registIPCEventListeners();

    this.window = new BrowserWindow(windowOption);

    this.window.loadURL(initialState.nowUrl);

    const preloadJSCode = this.loadJSCode(path.resolve(preloadBasePath, "preload.js"));
    console.log("Loaded preload.js");
    this.window?.webContents.executeJavaScript(preloadJSCode);

    // const chatboxJSCode = this.loadJSCode(path.resolve(preloadBasePath, "chatbox.js"));
    // this.window?.webContents.executeJavaScript(chatboxJSCode);

    this.window.webContents.on("new-window", this.webContentsOnNewWindow(windowOption));
    this.window.on("close", () => {
      if (this.chatBox && !this.chatBox.isDestroyed()) {
        this.chatBox.close();
        this.chatBox = undefined;
      }
    });

    if (isDebug) {
      this.window.webContents.openDevTools();
    }
  };

  private onWindowAllClosed = () => {
    this.app.quit();
  };

  private webContentsOnNewWindow = (windowOptions: Electron.BrowserWindowConstructorOptions) => {
    return (event: Electron.NewWindowEvent, url: string) => {
      event.preventDefault();
      console.log({ url });

      // 開こうとしているURLが外部だったらブラウザで開く
      if (!/^https?:\/\/(studio|www)\.youtube.com/.test(url)) {
        openBrowser(url);
        return;
      }

      if (url.indexOf("live_chat?") < 0) {
        return;
      }
      this.chatBox = new BrowserWindow({
        ...windowOptions,
        width: 600,
        height: 700,
        frame: isDebug,
        skipTaskbar: !isDebug,
        minWidth: undefined,
        minHeight: undefined,
        show: isDebug,
      });
      this.appStore?.dispatch(ResetSuperchatList());
      this.chatBox.setMenu(chatboxMenuTemplate);
      this.chatBox.loadURL(url);
      const chatboxJSCode = this.loadJSCode(path.resolve(preloadBasePath, "chatbox.js"));
      this.chatBox.webContents.on("did-finish-load", () => {
        this.chatBox?.webContents.executeJavaScript(chatboxJSCode);
      });
      this.chatBox.webContents.on("will-navigate", () => {
        this.appStore?.dispatch(ResetSuperchatList());
      });

      if (isDebug) {
        this.chatBox.webContents.openDevTools();
      }
    };
  };

  private registIPCEventListeners() {
    ipcMain.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_PRELOAD, (event) => {
      event.sender.send(IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN, this.appStore?.getState());
    });
    ipcMain.on(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, (_, action: Action<AppState>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.appStore?.dispatch(action as any);
    });

    ipcMain.on(IPCEvent.NavigationChange.NAVIGATION_PAGE_FROM_PRELOAD, (_, url: string) => {
      console.log({ "IPCEvent.NavigationChange.NAVIGATION_PAGE_FROM_PRELOAD": url });
      this.appStore?.dispatch(ChangeURLAction(url));
      const state = { nowUrl: url };

      const JSONstring = JSON.stringify(state);
      writeFileSync(".save/app.json", JSONstring);
    });
  }

  private loadJSCode(path: string) {
    return readFileSync(path).toString("utf-8");
  }
}

export default new MyApp(app);
