import { Menu, BrowserWindow, shell } from "electron";
import config from "../../config.json";
import path from "path";
import contextMenu from "electron-context-menu";
import App from "./App";

export default function buildMenu() {
  return {
    mainMenuTemplate: Menu.buildFromTemplate([
      {
        label: "ページ移動(1)",
        submenu: [
          {
            label: "ライブ配信 - Youtube Studio(Ctrl+1)",
            accelerator: "CmdOrCtrl+1",
            click: (__item, focusedWindow) => {
              focusedWindow.loadURL(`https://studio.youtube.com/channel/${config.channelId}/livestreaming/stream`);
            },
          },
          {
            label: "チャンネルのダッシュボード(Ctrl+2)",
            accelerator: "CmdOrCtrl+2",
            click: (__item, focusedWindow) => {
              focusedWindow.loadURL(`https://studio.youtube.com/channel/${config.channelId}/`);
            },
          },
        ],
      },
      {
        label: "ツール(2)",
        submenu: [
          {
            label: "常に最前面に表示",
            type: "checkbox",
            checked: App.isAlwaysOnTop,
            click: () => {
              App.isAlwaysOnTop = !App.isAlwaysOnTop;
            },
          },
          {
            label: "開発者ツールを開く",
            click: (__item, focusedWindow) => {
              focusedWindow.webContents.openDevTools();
            },
          },
        ],
      },
    ]),
    chatboxMenuTemplate: Menu.buildFromTemplate([
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
                const window = App.createWindow({
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
                contextMenu({
                  window,
                  prepend: (defaultAction, params, browserWindow) => [
                    {
                      label: "test",
                      visible: params.mediaType === "none",
                      click: () => {
                        shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`);
                      },
                    },
                  ],
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
    ]),
  };
}
