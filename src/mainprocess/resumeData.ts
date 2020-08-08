import { readFileSync } from "fs";
import AppState from "@common/AppState/AppState";
import createInitialState from "./getInitialState";

export type AppConfig = {
  channelId: string;
};

type SaveData = {
  nowUrl: string;
};

const youtubeChannelBaseURL = "https://studio.youtube.com/channel";

export default function resumeData(configFilePath: string, appStateFilePath: string) {
  try {
    const recentState = JSON.parse(readFileSync(appStateFilePath).toString("utf-8")) as SaveData;
    return recentState;
  } catch (e) {
    const config = JSON.parse(readFileSync(configFilePath).toString()) as AppConfig;
    return createInitialState(`${youtubeChannelBaseURL}/${config.channelId}/livestreaming/stream`);
  }
}
