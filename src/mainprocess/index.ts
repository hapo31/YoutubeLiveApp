import { BrowserWindow, App, app } from "electron";

class MyApp {
  private window?: BrowserWindow;
  private app: App;

  private mainURL: string = `https://studio.youtube.com/channel/UCn9PQpGGbbcoq82TLnXYK5Q/livestreaming/stream`;

  constructor(app: App) {
    this.app = app;
    this.app.on("ready", this.onReady);
    this.app.on("activate", this.onActivated);
    this.app.on("window-all-closed", this.onWindowAllClosed);
  }

  private onReady = () => {
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
