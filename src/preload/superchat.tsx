import React from "react";
import { render } from "react-dom";
import CardContainerComponent from "./Chat/CardContainer/CardContainerComponent";
import { Provider } from "react-redux";
import { compose, applyMiddleware, createStore } from "redux";
import WebcontentsPreloadMiddleware, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";
import createSharedStore from "@common/Middlewares/WebcontentsPreloadMiddleware";

(async () => {
  const store = await createSharedStore();

  const target = document.getElementById("app");
  render(
    <Provider store={store}>
      <CardContainerComponent />
    </Provider>,
    target
  );
})();
