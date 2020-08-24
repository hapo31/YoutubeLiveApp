export type Actions = ReturnType<typeof InitChat | typeof AttachChat | typeof DettachChat>;

export const ATTACH_CHAT = "ChatStateActions.ATTACH_CHAT" as const;

export const AttachChat = () => ({
  type: ATTACH_CHAT,
});

export const INIT_CHAT = "ChatStateActions.INIT_CHAT" as const;

export const InitChat = (videoId: string) => ({
  type: INIT_CHAT,
  videoId,
});

export const DETACH_CHAT = "ChatStateActions.DETACH_CHAT" as const;

export const DettachChat = () => ({
  type: DETACH_CHAT,
});
