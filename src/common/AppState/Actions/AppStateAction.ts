import { SuperChatInfo } from "../AppState";

export type Actions = ReturnType<
  typeof ChangeURLAction | typeof ReceivedSuperchat | typeof ResetSuperchatList | typeof RendererInitialize | typeof CheckedSuperchat
>;

export const CHANGE_URL = "AppStateAction.CHANGE_URL" as const;

export const ChangeURLAction = (url: string) => ({
  type: CHANGE_URL,
  url,
});

export const RECEIVED_SUPERCHAT = "AppStateAction.RECEIVED_SUPERCHAT" as const;

export const ReceivedSuperchat = (superChat: SuperChatInfo) => ({
  type: RECEIVED_SUPERCHAT,
  superChat,
});

export const RESET_SUPERCHAT_LIST = "AppStateAction.RESET_SUPERCHAT_LIST" as const;

export const ResetSuperchatList = () => ({
  type: RESET_SUPERCHAT_LIST,
});

export const RENDERER_INITIALIZE = "AppStateAction.RENDER_INITIALIZE" as const;

export const RendererInitialize = () => ({
  type: RENDERER_INITIALIZE,
});

export const CHECKED_SUPERCHAT = "AppStateAction.CHECKED_SUPERCHAT" as const;

export const CheckedSuperchat = (index: number) => ({
  type: CHECKED_SUPERCHAT,
  index,
});
