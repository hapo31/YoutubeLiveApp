import { readFileSync, mkdirSync } from "fs";
import createInitialState from "./getInitialState";

export type AppConfig = {
  channelId: string;
};

type SaveData = {
  nowUrl: string;
  channelId: string;
};

const appStateFilePath = ".save/app.json";

export default function resumeData() {
  try {
    const recentState = JSON.parse(readFileSync(appStateFilePath).toString("utf-8")) as SaveData;
    return recentState;
  } catch (e) {
    mkdirSync(".save");
    return createInitialState("https://studio.youtube.com/");
  }
}
