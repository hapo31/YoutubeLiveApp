import { compose, applyMiddleware, createStore } from "redux";
import RendererProcessMiddleware, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import attachChatBox from "./chat/attachChatBox";
import sendDebugLog from "./debug/sendDebugLog";
import renderSuperChatContainer from "./Chat/render";
import { ReceivedSuperchat } from "@common/AppState/Actions/AppStateAction";

(async () => {
  const myCreateStore = compose(applyMiddleware(RendererProcessMiddleware()))(createStore);
  const store = myCreateStore(createAppReducer(await requestInitialState()));

  function init() {
    try {
      if (document.getElementById("contents") == null) {
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

      const [start, _end] = attachChatBox((element) => {
        if (element.querySelector("#card")) {
          store.dispatch(ReceivedSuperchat(element));
        }

        setInterval(() => {
          const chatContainer = document.querySelector("#items.yt-live-chat-item-list-renderer") as HTMLElement;
          if (!chatContainer) {
            return;
          }
          console.log(element);
          start(chatContainer);
        }, 10000);
      });
    } catch (e) {
      sendDebugLog(e);
    }
  }

  init();
})();
