import { Menu, BrowserWindow } from "electron";
import config from "../../config.json";

const menuTemplate = [
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
];

export default Menu.buildFromTemplate(menuTemplate);
