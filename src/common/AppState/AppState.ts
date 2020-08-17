type SuperChatColorInfo = {
  primary: string;
  secondary: string;
  header: string;
  authorName: string;
  timestamp: string;
  message: string;
};

export type SuperChatInfo = {
  imgUrl: string;
  purches: string;
  author: string;
  message: string;
  superChatColorInfo: SuperChatColorInfo;
  authorRaw: string;
  messageRaw: string;
  checked: boolean;
};

type AppState = {
  nowUrl: string;
  superChats: Record<string, SuperChatInfo[]>;
};

export default AppState;
