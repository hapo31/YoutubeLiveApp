import attachChatBox from "./Chat/attachChatBox";
import { AppendSuperchat } from "@common/AppState/Actions/AppStateAction";
import AppState, { SuperChatInfo } from "@common/AppState/AppState";
import createSharedStore, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import createChatReducer from "@common/Chat/ChatStateReducer";
import { initialState as chatInitialState, ChatState } from "@common/Chat/ChatState";
import { AttachChat } from "@common/Chat/ChatStateActions";
import { combineReducers } from "redux";

const videoIdParseRegExp = /https:\/\/studio\.youtube\.com\/video\/(\w+)\/livestreaming/;

(async () => {
  const { app, chat }: { app: AppState; chat: ChatState } = await requestInitialState();
  const reducer = combineReducers({ app: createAppReducer(app), chat: createChatReducer(chat) });

  const store = createSharedStore(reducer);
  store.subscribe(() => {
    const state = store.getState();
    if (state.chat.willInit && !state.chat.attached) {
      store.dispatch(AttachChat());
      init();
    }
  });

  console.log("waiting...");
  function init() {
    attachChatBox((element: HTMLElement) => {
      const state = store.getState();
      if (element.localName !== "yt-live-chat-paid-message-renderer") {
        return;
      }
      const superChatInfo = parseSuperChatElement(element);
      const result = videoIdParseRegExp.exec(state.app.nowUrl);
      if (result) {
        const videoId = result[1];
        store.dispatch(AppendSuperchat(videoId, superChatInfo));
      }
    });
  }
})();

function parseSuperChatElement(element: HTMLElement): SuperChatInfo {
  const img = element.querySelector("#img") as HTMLImageElement;
  const author = element.querySelector("#author-name");
  const purchase = element.querySelector("#purchase-amount-column");
  const message = element.querySelector("#message");

  const matchResults = element.getAttribute("style")?.match(/(rgba\(\d+,\d+,\d+,\d\.?\d*\))/g);

  if (!matchResults) {
    throw purchase;
  }

  return {
    imgUrl: img.src,
    author: author?.textContent || "",
    message: message?.textContent || "",
    authorRaw: author?.innerHTML || "",
    messageRaw: message?.innerHTML || "",
    purches: purchase?.textContent || "",
    superChatColorInfo: {
      primary: matchResults[0],
      secondary: matchResults[1],
      header: matchResults[2],
      authorName: matchResults[3],
      timestamp: matchResults[4],
      message: matchResults[5],
    },
    checked: false,
  };
}
