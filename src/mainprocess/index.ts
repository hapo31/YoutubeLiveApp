import { BrowserWindow, App, app, Menu } from "electron";
import ParseString from "./ParseString";
import config from "../../config.json";
import menuTemplate from "./MenuTemplate";

class MyApp {
  private window?: BrowserWindow;
  private app: App;

  private mainURL: string = `file://${__dirname}/index.html?n=${encodeURIComponent(
    ParseString(config.firstView, config)
  )}`;

  constructor(app: App) {
    this.app = app;
    this.app.on("ready", this.onReady);
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
      },
    };

    this.window = new BrowserWindow(windowOption);
    this.window.loadURL(this.mainURL);
  };
  private onActivated = () => {};
  private onWindowAllClosed = () => {
    this.app.quit();
  };
}

new MyApp(app);
