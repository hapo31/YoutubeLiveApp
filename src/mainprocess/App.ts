import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { BrowserWindow, App, app, ipcMain, Menu } from "electron";
import { compose, applyMiddleware, createStore, StoreCreator, Action, Store, AnyAction } from "redux";

import buildMenu from "./MenuTemplate";
import MainProcessMiddleware from "@common/Middlewares/MainProcessMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import IPCEvent from "@common/events/IPCEvent";
import { Actions as AppStateAction, ChangeURLAction, ResetSuperchatList } from "@common/AppState/Actions/AppStateAction";
import AppState from "@common/AppState/AppState";
import openBrowser from "./NativeBridge/OpenBrowser";
import resumeData from "./resumeData";

export const isDebug = process.env.NODE_ENV == "development";
const preloadBasePath = isDebug ? "./dist/scripts/" : "./resources/app/scripts/";

class MyApp {
  private appStore?: Store<AppState, AppStateAction>;
  public mainWindow?: BrowserWindow;

  public childWindows: Map<string, BrowserWindow> = new Map();

  private app: App;

  private _channelId = "";

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
    if (this.appStore == null) {
      return;
    }
    this.appStore.dispatch(action);
  }

  private onReady = () => {
    const myCreateStore: StoreCreator = compose(applyMiddleware(MainProcessMiddleware()))(createStore);

    const saveData = resumeData(".save/app.json");
    const initialState = {
      nowUrl: saveData.nowUrl,
      channelId: saveData.channelId,
      superChats: [],
    };
    this.appStore = myCreateStore(createAppReducer(initialState));

    const windowOption: Electron.BrowserWindowConstructorOptions = {
      title: "YoutubeLiveApp",
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
    this.isAlwaysOnTop = true;

    this.mainWindow.loadURL(initialState.nowUrl, {
      userAgent: "Chrome",
    });
    this.mainWindow.setMenu(menus.mainMenuTemplate);
    const preloadJSCode = this.loadJSCode(path.resolve(preloadBasePath, "preload.js"));
    this.mainWindow?.webContents.executeJavaScript(preloadJSCode);

    const videoIdParseRegExp = /https:\/\/studio\.youtube\.com\/video\/(\w+)\/livestreaming/;
    const channelIdTest = /https:\/\/studio\.youtube\.com\/channel\/(\w+)\/?/;

    this.mainWindow.webContents.on("new-window", this.webContentsOnNewWindow(windowOption, menus));
    this.mainWindow.webContents.on("will-redirect", (event, url) => {
      console.log({ "will-redirect": url });
      if (url.indexOf("accounts") < 0) {
        this.mainWindow?.webContents.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
        );
      }

      if (url.indexOf("accounts") >= 0) {
        this.mainWindow?.webContents.setUserAgent("Chrome");
      }
    });

    this.mainWindow.webContents.on("did-navigate-in-page", (event, url) => {
      // ページが遷移されるごとにstateの保存などを行う
      const state = this.appStore?.getState();
      console.log({ "did-navigate-in-page": url });

      if (url.indexOf("accounts") >= 0) {
        this.mainWindow?.webContents.setUserAgent("Chrome");
      } else {
        this.mainWindow?.webContents.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
        );
      }

      const resultArray = channelIdTest.exec(url);
      if (resultArray != null) {
        this._channelId = resultArray[1];
        this.appStore?.dispatch(ChangeURLAction(url));
      }

      const result = videoIdParseRegExp.exec(url);
      if (result != null) {
        console.log({ result });
        const videoId = result[1];

        this.openChatBox(videoId, windowOption, menus.chatboxMenuTemplate);
      }
      const JSONstring = JSON.stringify(state);
      writeFileSync(".save/app.json", JSONstring);
    });

    this.mainWindow.on("close", () => {
      this.childWindows.forEach((window, key) => {
        if (key !== "MainWindow" && !window.isDestroyed()) {
          window.close();
        }
      });
    });
  };

  private onWindowAllClosed = () => {
    this.app.quit();
  };

  private webContentsOnNewWindow = (windowOptions: Electron.BrowserWindowConstructorOptions, menus: ReturnType<typeof buildMenu>) => {
    return (event: Electron.NewWindowEvent, url: string) => {
      event.preventDefault();

      // 開こうとしているURLが外部だったらブラウザで開く
      if (!/^https?:\/\/(studio|www)\.youtube.com/.test(url)) {
        openBrowser(url);
        return;
      }

      if (url.indexOf("live_chat?") < 0) {
        return;
      }

      this.openChatBox(url, windowOptions, menus.chatboxMenuTemplate);
    };
  };

  private openChatBox(videoId: string, windowOptions: Electron.BrowserWindowConstructorOptions, menu: Menu) {
    if (this.childWindows.has(videoId)) {
      return;
    }
    const chatBox = this.createWindow(videoId, {
      ...windowOptions,
      parent: this.mainWindow,
      width: 600,
      height: 700,
      minWidth: undefined,
      minHeight: undefined,
      show: isDebug,
    });
    this.appStore?.dispatch(ResetSuperchatList());
    chatBox.setMenu(menu);
    chatBox.loadURL(`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`);
    const chatboxJSCode = this.loadJSCode(path.resolve(preloadBasePath, "chatbox.js"));
    chatBox.webContents.on("did-finish-load", () => {
      chatBox.webContents.executeJavaScript(chatboxJSCode);
    });
    chatBox.webContents.on("will-navigate", () => {
      this.appStore?.dispatch(ResetSuperchatList());
    });
  }
  private registIPCEventListeners() {
    ipcMain.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_PRELOAD, (event) => {
      event.sender.send(IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN, this.appStore?.getState());
    });
    ipcMain.on(IPCEvent.StateChanged.CHANNEL_NAME_FROM_PRELOAD, (_, action: Action<AppState>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.appStore?.dispatch(action as any);
    });
  }

  private loadJSCode(path: string) {
    return readFileSync(path).toString("utf-8");
  }

  private saveAppData() {
    const state = this.appStore?.getState();
    const JSONstring = JSON.stringify(state);
    writeFileSync(".save/app.json", JSONstring);
  }
}

export default new MyApp(app);
