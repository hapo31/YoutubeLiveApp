import { BrowserWindow, App, app, Menu, ipcMain } from "electron";
import fs from "fs";
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
    this.window.webContents.openDevTools();

    ipcMain.on("DEBUG.SHOW_LOG", (_, args) => {
      console.log(`DEBUG.SHOW_LOG: ${args}`);
    });
    ipcMain.on("DEBUG.ERROR_LOG", (_, args) => {
      console.error(`DEBUG.ERROR_LOG: ${args}`);
    });
  };
  private onActivated = () => {};
  private onWindowAllClosed = () => {
    this.app.quit();
  };
}

new MyApp(app);
