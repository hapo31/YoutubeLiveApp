import { readFileSync, mkdirSync, writeFileSync } from "fs";
import createInitialState from "./getInitialState";
import { SuperChatInfo } from "@common/AppState/AppState";

export type AppConfig = {
  channelId: string;
};

type SaveData = {
  nowUrl: string;
  superChats: Record<string, SuperChatInfo[]>;
  isAlwaysOnTop: boolean;
  fixedChatUrl: boolean;
};

const appStateFilePath = ".save/app.json";

export function resumeData(): SaveData {
  try {
    const recentState = JSON.parse(readFileSync(appStateFilePath).toString("utf-8")) as SaveData;
    return recentState;
  } catch (e) {
    try {
      mkdirSync(".save");
    } catch (e) {
      /* NOP */
    }
    return { ...createInitialState("https://studio.youtube.com/"), isAlwaysOnTop: false, fixedChatUrl: false };
  }
}

export function writeData(data: SaveData) {
  const JSONstring = JSON.stringify(data);
  writeFileSync(appStateFilePath, JSONstring);
}
