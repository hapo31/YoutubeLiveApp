import { readFileSync } from "fs";
import AppState from "@common/AppState/AppState";
import createInitialState from "./getInitialState";

export type AppConfig = {
  channelId: string;
};

type SaveData = {
  nowUrl: string;
  channelId: string;
};

const youtubeChannelBaseURL = "https://studio.youtube.com";

export default function resumeData(appStateFilePath: string) {
  try {
    const recentState = JSON.parse(readFileSync(appStateFilePath).toString("utf-8")) as SaveData;
    return recentState;
  } catch (e) {
    return createInitialState("https://studio.youtube.com/");
  }
}
