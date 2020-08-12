import { SuperChatInfo } from "../AppState";

export type Actions = ReturnType<typeof ChangeURLAction | typeof ReceivedSuperchat | typeof ResetSuperchatList>;

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
