import { Menu, BrowserWindow, shell, ipcMain } from "electron";
import { v4 as uuid } from "uuid";

import config from "../../config.json";
import path from "path";
import contextMenu from "electron-context-menu";
import App, { isDebug } from "./App";
import { AppendSuperchat } from "@common/AppState/Actions/AppStateAction";

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
            visible: isDebug,
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
                const window = App.createWindow(uuid(), {
                  parent: focusedWindow,
                  acceptFirstMouse: true,
                  alwaysOnTop: true,
                  width: 600,
                  minWidth: 600,
                  height: 700,
                  webPreferences: {
                    webviewTag: true,
                    nodeIntegration: true,
                  },
                });
                if (isDebug) {
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
                }

                window.setMenu(null);
                window.loadFile(path.resolve(__dirname, "superchat.html"));
                window.webContents.openDevTools();
              }
            },
          },
          {
            label: "CSSを適用する",
            visible: isDebug,
            click: (__item: unknown, focusedWindow: BrowserWindow) => {
              focusedWindow.webContents.openDevTools();
            },
          },
        ],
      },
      {
        label: "困ったとき",
        visible: isDebug,
        submenu: [
          {
            label: "開発者ツールを開く",
            click: (__item: unknown, focusedWindow: BrowserWindow) => {
              focusedWindow.webContents.openDevTools();
            },
          },
          {
            label: "テストデータを流し込む",
            click: (_, window) => {
              App.dispatch(
                AppendSuperchat({
                  author: "テスト太郎",
                  authorRaw: `<div id="author-name" class="style-scope yt-live-chat-paid-message-renderer">テスト太郎</div>`,
                  message: "テスト太郎のメッセージです",
                  messageRaw: `<div id="message" dir="auto" class="style-scope yt-live-chat-paid-message-renderer">テスト太郎のテストメッセージです<img class="emoji style-scope yt-live-chat-text-message-renderer" src="https://yt3.ggpht.com/atsy74xfRqDFS5NWvN_nJgvaAxAPmPnRQptCnMyRv_zopiocAmnXRH-ZLiw0P7QvsAHFc0c71A=w48-h48-c-k-nd" alt=":_aquaNEKO:" data-emoji-id="UC1opHUrw8rvnsadT-iGp7Cg/_GugXrySBJCQ_APTkKqIBg" shared-tooltip-text=":_aquaNEKO:" id="emoji-413"> </div>`,
                  imgUrl: "https://yt3.ggpht.com/-rqF0Mu8H3k4/AAAAAAAAAAI/AAAAAAAAAAA/hpayIf9ySG4/s32-c-k-no-mo-rj-c0xffffff/photo.jpg",
                  checked: false,
                  purches: `＄1,000,000,000,000`,
                  superChatColorInfo: {
                    authorName: "rgb(0, 0, 0)",
                    header: "rgb(255,255,0)",
                    message: "rgb(0,0,0)",
                    primary: "rgb(255, 0, 0)",
                    secondary: "rgb(255, 255,0)",
                    timestamp: "rgb(0, 0, 255)",
                  },
                })
              );
            },
          },
        ],
      },
    ]),
  };
}
