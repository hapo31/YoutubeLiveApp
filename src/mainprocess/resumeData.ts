import { readFileSync, mkdirSync } from "fs";
import createInitialState from "./getInitialState";
import { SuperChatInfo } from "@common/AppState/AppState";

export type AppConfig = {
  channelId: string;
};

type SaveData = {
  nowUrl: string;
  channelId: string;
  superChats: Record<string, SuperChatInfo[]>;
};

const appStateFilePath = ".save/app.json";

export default function resumeData() {
  try {
    const recentState = JSON.parse(readFileSync(appStateFilePath).toString("utf-8")) as SaveData;
    return recentState;
  } catch (e) {
    try {
      mkdirSync(".save");
    } catch (e) {
      /* NOP */
    }
    return createInitialState("https://studio.youtube.com/");
  }
}
