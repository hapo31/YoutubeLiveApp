import { EventType } from "./EventBase";
import AppState from "../AppState/States/AppState";

export const CHANNEL_NAME_FROM_RENDERER = "RENDERER.REQUEST_INITIAL_STATE";
export const CHANNEL_NAME_FROM_MAIN = "MAIN.RESPONSE_INITIAL_STATE";
export type EventPayload = EventType<AppState>;
