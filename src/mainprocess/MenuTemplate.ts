import { Menu, BrowserWindow } from "electron";
import config from "../../config.json";
import path from "path";

export const mainMenuTemplate = Menu.buildFromTemplate([
  {
    label: "ページ移動(1)",
    submenu: [
      {
        label: "ライブ配信 - Youtube Studio(Ctrl+1)",
        accelerator: "CmdOrCtrl+1",
        click: (__item: unknown, focusedWindow?: BrowserWindow) => {
          if (focusedWindow) {
            focusedWindow.loadURL(`https://studio.youtube.com/channel/${config.channelId}/livestreaming/stream`);
          }
        },
      },
      {
        label: "チャンネルのダッシュボード(Ctrl+2)",
        accelerator: "CmdOrCtrl+2",
        click: (__item: unknown, focusedWindow?: BrowserWindow) => {
          if (focusedWindow) {
            focusedWindow.loadURL(`https://studio.youtube.com/channel/${config.channelId}/`);
          }
        },
      },
    ],
  },
  {
    label: "困ったとき",
    submenu: [
      {
        label: "開発者ツールを開く",
        click: (__item: unknown, focusedWindow?: BrowserWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.openDevTools();
          }
        },
      },
    ],
  },
]);

export const chatboxMenuTemplate = Menu.buildFromTemplate([
  {
    label: "ツール",
    submenu: [
      {
        label: "スパチャ一覧を開く",
        click: (__item: unknown, focusedWindow?: BrowserWindow) => {
          if (focusedWindow) {
            const childs = focusedWindow.getChildWindows();
            if (childs.length >= 1) {
              return;
            }
            const window = new BrowserWindow({
              parent: focusedWindow,
              acceptFirstMouse: true,
              alwaysOnTop: true,
              width: 600,
              height: 700,
              webPreferences: {
                webviewTag: true,
                nodeIntegration: true,
              },
            });
            window.setMenu(null);
            window.loadFile(path.resolve(__dirname, "superchat.html"));
            window.webContents.openDevTools();
          }
        },
      },
      {
        label: "CSSを適用する",
        click: (__item: unknown, focusedWindow?: BrowserWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.openDevTools();
          }
        },
      },
    ],
  },
  {
    label: "困ったとき",
    submenu: [
      {
        label: "開発者ツールを開く",
        click: (__item: unknown, focusedWindow?: BrowserWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.openDevTools();
          }
        },
      },
    ],
  },
]);
