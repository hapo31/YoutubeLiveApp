import { BrowserWindow, App, app, Menu, ipcMain } from "electron";
import ParseString from "./ParseString";
import config from "@root/config.json";
import menuTemplate from "./MenuTemplate";
import { compose, applyMiddleware, createStore, StoreCreator } from "redux";
import MainProcessMiddleware from "@common/AppState/Middlewares/MainProcessMiddleware";
import createAppReducer from "@common/AppState/Reducers/AppStateReducer";

class MyApp {
  private appStore: ReturnType<typeof createStore>;

  public windows: BrowserWindow[] = [];
  private app: App;

  private mainURL = `file://${__dirname}/index.html?n=${encodeURIComponent(ParseString(config.firstView, config))}`;

  constructor(app: App) {
    this.app = app;
    const myCreateStore: StoreCreator = compose(applyMiddleware(MainProcessMiddleware()))(createStore);

    this.appStore = myCreateStore(createAppReducer({ url: ParseString(config.firstView, config) }));
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

    this.windows.push(new BrowserWindow(windowOption));
    this.windows.forEach((window) => window.loadURL(this.mainURL));
  };
  private onActivated = () => {
    console.log("Activated");
  };
  private onWindowAllClosed = () => {
    this.app.quit();
  };
}

export default new MyApp(app);
