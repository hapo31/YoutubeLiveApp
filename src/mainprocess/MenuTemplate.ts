import { Menu, BrowserWindow, dialog } from "electron";
import { v4 as uuid } from "uuid";
import copyPast from "copy-paste";

import path from "path";
// import contextMenu from "electron-context-menu";
import App, { isDebug, videoIdParseRegExp } from "./App";
import { AppendSuperchat, ChangeBouyomiChanState } from "@common/AppState/Actions/AppStateAction";
import checkUpdate from "./check-update";
import openBrowser from "./NativeBridge/OpenBrowser";

export default function buildMenu() {
  return {
    mainMenuTemplate: Menu.buildFromTemplate([
      {
        label: "更新",
        accelerator: "F5",
        click: (__item, window) => {
          window.reload();
        },
      },
      {
        label: "チャットウインドウのURLをクリップボードにコピー",
        click: () => {
          if (App.serverRunning) {
            copyPast.copy("http://localhost:25252/chat");
          } else {
            copyPast.copy(`https://www.youtube.com/live_chat?is_popout=1&v=${App.videoId}`);
          }
        },
      },
      {
        label: "ページ移動...",
        submenu: [
          {
            label: "ライブ配信 - YouTube Studio (Ctrl+1)",
            accelerator: "CmdOrCtrl+1",
            click: (__item, focusedWindow) => {
              focusedWindow.loadURL(`https://studio.youtube.com/channel/${App.channelId}/livestreaming/stream`);
            },
          },
          {
            label: "チャンネルのダッシュボード(Ctrl+2)",
            accelerator: "CmdOrCtrl+2",
            click: (__item, focusedWindow) => {
              focusedWindow.loadURL(`https://studio.youtube.com/channel/${App.channelId}/`);
            },
          },
        ],
      },
      {
        label: "その他...",
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
            label: "チャットウインドウのURLを固定化",
            type: "checkbox",
            checked: App.serverRunning,
            click: () => {
              App.serverRunning = !App.serverRunning;
            },
          },
          {
            label: "チャットを棒読みちゃんで読み上げる",
            type: "checkbox",
            checked: App.bouyomiChanEnabled,
            click: (__item: unknown, _: BrowserWindow) => {
              App.dispatch(ChangeBouyomiChanState(!App.bouyomiChanEnabled));
            },
          },
          {
            label: "スーパーチャット一覧を開く",
            click: (__item: unknown, mainWindow: BrowserWindow) => {
              const childs = mainWindow.getChildWindows();
              if (childs.length >= 1) {
                return;
              }
              const window = App.createWindow(uuid(), {
                parent: mainWindow,
                acceptFirstMouse: true,
                alwaysOnTop: true,
                backgroundColor: "#282828",
                width: 600,
                minWidth: 600,
                height: 700,
                webPreferences: {
                  webviewTag: true,
                  nodeIntegration: true,
                },
              });
              window.setMenu(null);
              window.loadFile(path.resolve(__dirname, "superchat.html"));
              if (isDebug) {
                window.webContents.openDevTools();
              }
            },
          },
          {
            label: "開発者ツールを開く",
            visible: true,
            click: (__item, focusedWindow) => {
              focusedWindow.webContents.openDevTools();
            },
          },
          {
            label: "テストデータを流し込む",
            visible: isDebug,
            click: (_, window) => {
              const videoIdResult = videoIdParseRegExp.exec(window.webContents.getURL());
              if (!videoIdResult) {
                return;
              }
              const videoId = videoIdResult[1];
              App.dispatch(
                AppendSuperchat(videoId, {
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
      {
        label: "about...",
        submenu: [
          { label: `現在のバージョン: ${App.version}`, enabled: false },
          {
            label: "最新版の確認",
            click: (_event, window) => {
              checkUpdate(App.version).then((versionInfo: string[]) => {
                if (versionInfo.length == 2 && window) {
                  const index = dialog.showMessageBoxSync(window, {
                    message: `新しいバージョンが見つかりました ${versionInfo[0]} -> ${versionInfo[1]}`,
                    buttons: ["ダウンロードページを開く", "このまま使う"],
                    title: "アップデートのご案内",
                  });

                  if (index === 0) {
                    openBrowser("https://github.com/happou31/YoutubeLiveApp/releases");
                  }
                }
              });
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
        ],
      },
    ]),
  };
}
