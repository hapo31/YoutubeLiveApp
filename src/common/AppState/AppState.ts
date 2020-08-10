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
  author: string;
  message: string;
  purches: string;
  superChatColorInfo: SuperChatColorInfo;
};

type AppState = {
  nowUrl: string;
  superChats: SuperChatInfo[];
};

export default AppState;
