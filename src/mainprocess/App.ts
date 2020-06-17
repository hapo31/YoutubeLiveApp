import { BrowserWindow, App, app, Menu, ipcMain } from "electron";
import ParseString from "./ParseString";
import config from "@src/../config.json";
import menuTemplate from "./MenuTemplate";
import { compose, applyMiddleware, createStore, StoreCreator, Action } from "redux";
import MainProcessMiddleware from "@common/Middlewares/MainProcessMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import IPCEvent from "@common/events/IPCEvent";
import AppState from "@common/AppState/AppState";
import { EventType } from "@common/events/EventBase";
import createInitialState from "./getInitialState";

class MyApp {
  private appStore: ReturnType<typeof createStore>;

  public windows: BrowserWindow[] = [];
  private app: App;

  private mainURL = `file://${__dirname}/index.html`;

  constructor(app: App) {
    this.app = app;
    const myCreateStore: StoreCreator = compose(applyMiddleware(MainProcessMiddleware()))(createStore);

    this.appStore = myCreateStore(createAppReducer(createInitialState(ParseString(config.firstView, config))));
    this.app = this.app.on("ready", this.onReady);
    this.app.on("activate", this.onActivated);
    this.app.on("window-all-closed", this.onWindowAllClosed);
  }

  private onReady = () => {
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

    ipcMain.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_RENDERER, (event, ev: EventType<AppState>) => {
      event.sender.send(IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN, this.appStore.getState());
    });
    ipcMain.on(IPCEvent.StateChanged.CHANNEL_NAME_FROM_RENDERER, (event, ev: Action<unknown>) => {
      this.appStore.dispatch(ev);
    });

    this.windows.push(new BrowserWindow(windowOption));
    this.windows.forEach((window) => window.loadURL(this.mainURL));
    this.windows[0].webContents.openDevTools();
  };
  private onActivated = () => {
    console.log("Activated");
  };
  private onWindowAllClosed = () => {
    this.app.quit();
  };
}

export default new MyApp(app);
