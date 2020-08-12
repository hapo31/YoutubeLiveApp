import { compose, applyMiddleware, createStore } from "redux";
import RendererProcessMiddleware, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import attachChatBox from "./chat/attachChatBox";
import sendDebugLog from "./debug/sendDebugLog";
import renderSuperChatContainer from "./Chat/render";
import { ReceivedSuperchat } from "@common/AppState/Actions/AppStateAction";
import { SuperChatInfo } from "@common/AppState/AppState";

(async () => {
  const myCreateStore = compose(applyMiddleware(RendererProcessMiddleware()))(createStore);
  const store = myCreateStore(createAppReducer(await requestInitialState()));

  function init() {
    try {
      const chat = document.querySelector("#items.yt-live-chat-item-list-renderer");
      if (chat == null) {
        setTimeout(() => {
          init();
        }, 1000);
        return;
      }
      const div = document.createElement("div");
      div.id = "app";
      const target = document.querySelector("paper-listbox#menu");
      if (target == null) {
        return;
      }
      target.append(div);

      renderSuperChatContainer(div, store);

      const handler = (element: HTMLElement) => {
        console.log("rr");
        if (element.localName !== "yt-live-chat-paid-message-renderer") {
          return;
        }
        const superChatInfo = parseSuperChatElement(element);
        store.dispatch(ReceivedSuperchat(superChatInfo));
      };

      attachChatBox(handler);
    } catch (e) {
      sendDebugLog(e);
    }
  }

  init();
})();

function parseSuperChatElement(element: HTMLElement): SuperChatInfo {
  const img = element.querySelector("#img") as HTMLImageElement;
  const author = element.querySelector("#author-name");
  const purchase = element.querySelector("#content");
  const message = element.querySelector("#message");

  const matchResults = element.getAttribute("style")?.match(/(rgba\(\d+,\d+,\d+,\d\.?\d*\))/g);
  console.log({ css: element.getAttribute("style"), matchResults });

  if (!matchResults) {
    throw purchase;
  }

  return {
    imgUrl: img.src,
    author: author?.innerHTML || "",
    message: message?.innerHTML || "",
    purches: purchase?.textContent || "",
    superChatColorInfo: {
      primary: matchResults[0],
      secondary: matchResults[1],
      header: matchResults[2],
      authorName: matchResults[3],
      timestamp: matchResults[4],
      message: matchResults[5],
    },
  };
}
