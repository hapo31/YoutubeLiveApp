import { Menu, BrowserWindow } from "electron";
import config from "../../config.json";

const menuTemplate = [
  {
    label: "ページ移動(1)",
    submenu: [
      {
        label: "ライブ配信 - Youtube Studio(Ctrl+1)",
        accelerator: "CmdOrCtrl+1",
        click: (__item: any, focusedWindow?: BrowserWindow) => {
          if (focusedWindow) {
            focusedWindow.loadURL(
              `https://studio.youtube.com/channel/${config.channelId}/livestreaming/stream`
            );
          }
        },
      },
      {
        label: "チャンネルのダッシュボード(Ctrl+2)",
        accelerator: "CmdOrCtrl+2",
        click: (__item: any, focusedWindow?: BrowserWindow) => {
          if (focusedWindow) {
            focusedWindow.loadURL(
              `https://studio.youtube.com/channel/${config.channelId}/`
            );
          }
        },
      },
    ],
  },
];

export default Menu.buildFromTemplate(menuTemplate);
