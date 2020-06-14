import { EventType } from "./EventBase";
import AppState from "../AppState/States/AppState";

export const CHANNEL_NAME_FROM_RENDERER = "RENDERER.STATE_CHANGED";
export const CHANNEL_NAME_FROM_MAIN = "MAIN.STATE_CHANGED";
export type EventPayload = EventType<AppState>;
