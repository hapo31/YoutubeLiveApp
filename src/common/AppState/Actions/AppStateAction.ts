export type Actions = ReturnType<typeof ChangeURLAction>;

export const CHANGE_URL: string = "AppStateAction.CHANGE_URL";

export const ChangeURLAction = (url: string) => ({
  type: typeof CHANGE_URL,
  url,
});
