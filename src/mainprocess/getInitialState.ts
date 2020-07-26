import AppState from "@common/AppState/AppState";
import { AppConfig } from "./configParser";

export default function createInitialState(config: AppConfig): AppState {
  return {
    url: config.firstViewURL,
  };
}
