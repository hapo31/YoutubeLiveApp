import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { BrowserWindow, App, app, ipcMain } from "electron";
import { compose, applyMiddleware, createStore, Action, Store, AnyAction, combineReducers } from "redux";

import buildMenu from "./MenuTemplate";
import MainProcessMiddleware from "@common/Middlewares/MainProcessMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import IPCEvent from "@common/events/IPCEvent";
import { Actions as AppStateAction, ChangeURLAction } from "@common/AppState/Actions/AppStateAction";
import AppState from "@common/AppState/AppState";
import openBrowser from "./NativeBridge/OpenBrowser";
import resumeData from "./resumeData";
import { ChatState, initialState as chatInitialState } from "@common/Chat/ChatState";
import { Actions as ChatStateActions, InitChat } from "@common/Chat/ChatStateActions";
import createChatReducer from "@common/Chat/ChatStateReducer";

export const isDebug = process.env.NODE_ENV == "development";
export const resoucesBasePath = isDebug ? path.resolve(__dirname) : path.resolve(__dirname, "resources", "app");
export const videoIdParseRegExp = /https:\/\/studio\.youtube\.com\/video\/(\w+)\/livestreaming/;

class MyApp {
  private store: Store<{ app: AppState; chat: ChatState }, AppStateAction | ChatStateActions>;
  public mainWindow?: BrowserWindow;

  public childWindows: Map<string, BrowserWindow> = new Map();

  private app: App;

  private _channelId = "";

  public get state() {
    return this.store.getState();
  }

  public get videoId() {
    const r = videoIdParseRegExp.exec(this.state.app.nowUrl);
    if (r) {
      return r[1];
    } else {
      return null;
    }
  }

  public get channelId() {
    return this._channelId;
  }

  private _isAlwaysOnTop = true;

  public set isAlwaysOnTop(value: boolean) {
    if (this.mainWindow) {
      this.mainWindow.setAlwaysOnTop(value);
    }
    this._isAlwaysOnTop = value;
  }

  public get isAlwaysOnTop() {
    return this._isAlwaysOnTop;
  }

  constructor(app: App) {
    this.app = app;
    this.app.on("ready", this.onReady);
    this.app.on("window-all-closed", this.onWindowAllClosed);

    const initialState = resumeData();
    const reducer = combineReducers({ app: createAppReducer(initialState), chat: createChatReducer(chatInitialState) });

    const myCreateStore = compose(applyMiddleware(MainProcessMiddleware()))(createStore);

    this.store = myCreateStore(reducer);
  }

  public createWindow(id: string, windowOption?: Electron.BrowserWindowConstructorOptions) {
    const window = new BrowserWindow(windowOption);
    window.addListener("closed", () => {
      this.childWindows.delete(id);
    });
    this.childWindows.set(id, window);
    return window;
  }

  public dispatch(action: AnyAction) {
    if (this.store == null) {
      return;
    }
    this.store.dispatch(action);
  }

  private onReady = () => {
    const state = this.store.getState();

    console.log({ state });
    const windowOption: Electron.BrowserWindowConstructorOptions = {
      title: "YouTubeLiveApp",
      acceptFirstMouse: true,
      width: 1400,
      height: 900,
      webPreferences: {
        webviewTag: true,
        nodeIntegration: true,
      },
    };

    this.registIPCEventListeners();

    const menus = buildMenu();

    this.mainWindow = this.createWindow("MainWindow", windowOption);

    if (isDebug) {
      this.mainWindow.webContents.openDevTools();
    }

    this.isAlwaysOnTop = true;

    this.mainWindow.loadURL(this.store.getState().app.nowUrl);
    this.mainWindow.setMenu(menus.mainMenuTemplate);
    const chatboxJSCode = this.loadJSCode(path.resolve(resoucesBasePath, "scripts", "chatbox.js"));
    this.mainWindow?.webContents.executeJavaScript(chatboxJSCode);

    const willChangePageHanlder = (_event: Electron.Event, url: string) => {
      if (url === "https://www.youtube.com/") {
        console.log("detect www.youtube.com");
        url = "https://studio.youtube.com/";
      }

      if (url.indexOf("https://accounts.google.com/signin/rejected") >= 0) {
        console.log("detect rejected");
        url = "https://studio.youtube.com/";
      }

      this.switchUserAgent(url);
      console.log({ url, UA: this.mainWindow?.webContents.userAgent });
      this.mainWindow?.webContents.loadURL(url);
    };

    this.mainWindow.webContents.on("new-window", this.webContentsOnNewWindow());
    this.mainWindow.webContents.on("will-redirect", willChangePageHanlder);
    this.mainWindow.webContents.on("will-navigate", willChangePageHanlder);

    const didNavigateHandler = (_: Electron.Event, url: string) => {
      console.log({ "did-navigate": url });
      const videoIdResult = videoIdParseRegExp.exec(url);
      if (videoIdResult) {
        const { chat } = this.store.getState();
        console.log({ chat });
        if (!chat.attached) {
          const videoId = videoIdResult[1];
          this.store.dispatch(InitChat(videoId));
        }
      }
      console.log({ url });
      this.dispatch(ChangeURLAction(url));
      this.saveAppData();
    };

    this.mainWindow.webContents.on("did-navigate", didNavigateHandler);
    this.mainWindow.webContents.on("did-navigate-in-page", didNavigateHandler);

    this.mainWindow.on("close", () => {
      this.childWindows.forEach((window, key) => {
        if (key !== "MainWindow" && !window.isDestroyed()) {
          window.close();
        }
      });

      this.saveAppData();
    });
  };

  private onWindowAllClosed = () => {
    this.app.quit();
  };

  private webContentsOnNewWindow = () => {
    return (event: Electron.NewWindowEvent, url: string) => {
      event.preventDefault();

      // 開こうとしているURLが外部だったらブラウザで開く
      if (!/^https?:\/\/(studio|www)\.youtube.com/.test(url)) {
        openBrowser(url);
        return;
      }
    };
  };
  private registIPCEventListeners() {
    ipcMain.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_PRELOAD, (event) => {
      event.sender.send(IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN, this.store?.getState());
    });
    ipcMain.on(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, (_, action: Action<AppState>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.store?.dispatch(action as any);
    });
  }

  private loadJSCode(path: string) {
    return readFileSync(path).toString("utf-8");
  }

  private saveAppData() {
    const { app: state } = this.store.getState();
    const JSONstring = JSON.stringify(state);
    writeFileSync(".save/app.json", JSONstring);
  }

  private switchUserAgent(url: string) {
    if (url.indexOf("https://studio.") === 0 || url.indexOf("https://www.") === 0) {
      this.mainWindow?.webContents.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
      );
    } else {
      this.mainWindow?.webContents.setUserAgent("Chrome");
    }
  }
}

export default new MyApp(app);
