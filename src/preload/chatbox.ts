import { compose, applyMiddleware, createStore } from "redux";
import RendererProcessMiddleware, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import attachChatBox from "./chat/attachChatBox";
import sendDebugLog from "./debug/sendDebugLog";

(async () => {
  const myCreateStore = compose(applyMiddleware(RendererProcessMiddleware()))(createStore);
  const store = myCreateStore(createAppReducer(await requestInitialState()));

  function init() {
    try {
      sendDebugLog("attach: chatbox");

      const chatItemElement = document.querySelector("#items");
      if (chatItemElement == null) {
        setTimeout(() => {
          init();
        }, 1000);
        return;
      }

      attachChatBox(chatItemElement as HTMLElement);
    } catch (e) {
      sendDebugLog(e);
    }
  }

  init();
})();
