import AppState from "@common/AppState/AppState";

export default function createInitialState(firstViewURL: string): AppState {
  return {
    url: firstViewURL,
  };
}
