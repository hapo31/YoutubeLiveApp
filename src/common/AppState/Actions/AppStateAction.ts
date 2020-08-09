export type Actions = ReturnType<typeof ChangeURLAction | typeof ReceivedSuperchat>;

export const CHANGE_URL = "AppStateAction.CHANGE_URL" as const;

export const ChangeURLAction = (url: string) => ({
  type: CHANGE_URL,
  url,
});

export const RECEIVED_SUPERCHAT = "AppStateAction.RECEIVED_SUPERCHAT" as const;

export const ReceivedSuperchat = (element: HTMLElement) => ({
  type: RECEIVED_SUPERCHAT,
  element,
});
