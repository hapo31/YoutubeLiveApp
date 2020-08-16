import AppState from "@common/AppState/AppState";

export default function createInitialState(url: string): AppState {
  return {
    nowUrl: url,
    superChats: [],
    channelId: "",
  };
}
