import { BrowserWindow, App, app, Menu } from "electron";
import ParseString from "./ParseString";
import config from "../../config.json";
import menuTemplate from "./MenuTemplate";

class MyApp {
  private window?: BrowserWindow;
  private app: App;

  private mainURL: string = ParseString(config.firstView, config);

  constructor(app: App) {
    this.app = app;
    this.app.on("ready", this.onReady);
    this.app.on("activate", this.onActivated);
    this.app.on("window-all-closed", this.onWindowAllClosed);
  }

  private onReady = () => {
    Menu.setApplicationMenu(menuTemplate);

    const windowOption = {
      title: "YoutubeLiveApp",
      acceptForstMouse: true,
      alwaysOnTop: true,
      width: 1400,
      height: 900,
      webReferences: {
        nodeIntegration: true,
      },
    };

    this.window = new BrowserWindow(windowOption);
    this.window.loadURL(this.mainURL);
    this.window.webContents.openDevTools();
  };
  private onActivated = () => {};
  private onWindowAllClosed = () => {
    this.app.quit();
  };
}

new MyApp(app);
