import { compose, applyMiddleware, createStore } from "redux";
import RendererProcessMiddleware, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import attachChatBox from "./chat/attachChatBox";
import sendDebugLog from "./debug/sendDebugLog";
import renderChatBox from "./Chat/render";

(async () => {
  const myCreateStore = compose(applyMiddleware(RendererProcessMiddleware()))(createStore);
  const store = myCreateStore(createAppReducer(await requestInitialState()));

  function init() {
    try {
      const chatItemsElement = document.querySelector("#items.yt-live-chat-item-list-renderer");
      if (chatItemsElement == null) {
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

      renderChatBox(div, store);
      attachChatBox(chatItemsElement as HTMLElement, (element) => {
        console.log(element);
      });
    } catch (e) {
      sendDebugLog(e);
    }
  }

  init();
})();
