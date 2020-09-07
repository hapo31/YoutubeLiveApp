import path from "path";
import fs from "fs";
import BouyomiChan from "bouyomi-chan";
import { readFileSync } from "fs";
import { BrowserWindow, App, app, ipcMain } from "electron";
import express from "express";
import { compose, applyMiddleware, createStore, Action, Store, AnyAction, combineReducers } from "redux";

import buildMenu from "./MenuTemplate";
import MainProcessMiddleware from "@common/Middlewares/MainProcessMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import IPCEvent from "@common/events/IPCEvent";
import { Actions as AppStateAction, ChangeURLAction } from "@common/AppState/Actions/AppStateAction";
import AppState from "@common/AppState/AppState";
import openBrowser from "./NativeBridge/OpenBrowser";
import { resumeData, writeData } from "./SaveData";
import { ChatState, initialState as chatInitialState } from "@common/Chat/ChatState";
import { Actions as ChatStateActions, InitChat } from "@common/Chat/ChatStateActions";
import createChatReducer from "@common/Chat/ChatStateReducer";
import { Server } from "http";

export const isDebug = process.env.NODE_ENV == "development";
export const resoucesBasePath = isDebug ? path.resolve(".", "dist") : path.resolve("resources", "app");
export const videoIdParseRegExp = /https:\/\/studio\.youtube\.com\/video\/(.+)\/livestreaming/;

export const packageJsonPath = isDebug ? path.resolve(".", "package.json") : path.resolve("resources", "app", "package.json");

class MyApp {
  private store: Store<{ app: AppState; chat: ChatState }, AppStateAction | ChatStateActions>;
  public mainWindow?: BrowserWindow;

  public childWindows: Map<string, BrowserWindow> = new Map();

  public readonly version: string;

  private app: App;

  private _channelId = "";

  private server: Server | null = null;

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

  private serverPort = 25252;

  public get serverRunning() {
    return this.server != null;
  }

  public set serverRunning(value: boolean) {
    if (value && this.server === null) {
      this.runServer();
    } else if (!value && this.server) {
      this.stopServer();
    }
  }

  private readonly bouyomiChanPort = 50001;
  private bouyomiChan: BouyomiChan;

  public get bouyomiChanEnabled() {
    return !!this.store.getState().app.bouyomiChanEnabled;
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

    const packageJson = fs.readFileSync(packageJsonPath);
    const packageJsonObject = JSON.parse(packageJson.toString("utf-8"));

    this.version = packageJsonObject.version;

    this.bouyomiChan = new BouyomiChan({
      port: this.bouyomiChanPort,
    });

    const initialState = resumeData();
    this.isAlwaysOnTop = !!initialState.isAlwaysOnTop;
    this.serverRunning = !!initialState.fixedChatUrl;
    const reducer = combineReducers({ app: createAppReducer(initialState), chat: createChatReducer(chatInitialState) });

    const myCreateStore = compose(applyMiddleware(MainProcessMiddleware()))(createStore);

    this.store = myCreateStore(reducer);
  }

  public createWindow(id: string, windowOption?: Electron.BrowserWindowConstructorOptions) {
    const window = new BrowserWindow(windowOption);
    window.setAlwaysOnTop(this.isAlwaysOnTop);
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
      backgroundColor: "#282828",
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
    ipcMain.on(IPCEvent.BouyomiChan.SPEAK_BOUYOMICHAN_FROM_PRELOAD, (_, content: string) => {
      this.bouyomiChan.speak(content);
    });
  }

  private loadJSCode(path: string) {
    return readFileSync(path).toString("utf-8");
  }

  private saveAppData() {
    const { app: state } = this.store.getState();
    writeData({ ...state, isAlwaysOnTop: this.isAlwaysOnTop, fixedChatUrl: this.serverRunning });
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

  private runServer() {
    const expressApp = express();

    expressApp.use((req, res, next) => {
      if (req.hostname !== "localhost") {
        res.status(403);
        res.end();
        return;
      }
      res.header("Origin", `localhost:${this.serverPort}`);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    expressApp.get("/chat", (req, res) => {
      res.status(302);
      res.header("Location", `https://www.youtube.com/live_chat?is_popout=1&v=${this.videoId}`);
      res.end();
    });

    try {
      this.server = expressApp.listen(this.serverPort);
    } catch (e) {
      console.error(e);
    }
  }

  private stopServer() {
    if (this.server != null) {
      this.server.close();
      this.server = null;
    }
  }
}

export default new MyApp(app);
