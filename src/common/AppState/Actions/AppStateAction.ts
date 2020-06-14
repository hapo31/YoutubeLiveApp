export type Actions = ReturnType<typeof ChangeURLAction>;

export const CHANGE_URL = "AppStateAction.CHANGE_URL";

export const ChangeURLAction = (url: string) => ({
  type: typeof CHANGE_URL,
  url,
});
