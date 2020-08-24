import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import CardContainerComponent from "./Chat/CardContainer/CardContainerComponent";
import createSharedStore, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import AppState from "@common/AppState/AppState";
import { ChatState } from "@common/Chat/ChatState";
import { combineReducers } from "redux";
import createChatReducer from "@common/Chat/ChatStateReducer";

(async () => {
  const { app, chat }: { app: AppState; chat: ChatState } = await requestInitialState();
  const reducer = combineReducers({ app: createAppReducer(app), chat: createChatReducer(chat) });

  const store = createSharedStore(reducer);

  const target = document.getElementById("app");
  render(
    <Provider store={store}>
      <CardContainerComponent />
    </Provider>,
    target
  );
})();
