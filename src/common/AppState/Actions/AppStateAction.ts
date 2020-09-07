import { SuperChatInfo } from "../AppState";

export type Actions = ReturnType<
  typeof ChangeURLAction | typeof AppendSuperchat | typeof RendererInitialize | typeof CheckedSuperchat | typeof ChangeBouyomiChanState
>;

export const CHANGE_URL = "AppStateAction.CHANGE_URL" as const;

export const ChangeURLAction = (url: string) => ({
  type: CHANGE_URL,
  url,
});

export const APPEND_SUPERCHAT = "AppStateAction.APPEND_SUPERCHAT" as const;

export const AppendSuperchat = (videoId: string, superChat: SuperChatInfo) => ({
  type: APPEND_SUPERCHAT,
  videoId,
  superChat,
});
export const RENDERER_INITIALIZE = "AppStateAction.RENDER_INITIALIZE" as const;

export const RendererInitialize = () => ({
  type: RENDERER_INITIALIZE,
});

export const CHECKED_SUPERCHAT = "AppStateAction.CHECKED_SUPERCHAT" as const;

export const CheckedSuperchat = (videoId: string, index: number) => ({
  type: CHECKED_SUPERCHAT,
  videoId,
  index,
});

export const CHANGE_BOUYOMICHAN_STATE = "AppStateAction.CHANGE_BOUYOMICHAN_STATE" as const;

export const ChangeBouyomiChanState = (enabled: boolean) => ({
  type: CHANGE_BOUYOMICHAN_STATE,
  enabled,
});
