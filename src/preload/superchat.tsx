import React from "react";
import { render } from "react-dom";
import CardContainerComponent from "./Chat/CardContainer/CardContainerComponent";
import { Provider } from "react-redux";
import { compose, applyMiddleware, createStore } from "redux";
import RendererProcessMiddleware, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";

(async () => {
  const myCreateStore = compose(applyMiddleware(RendererProcessMiddleware()))(createStore);
  const store = myCreateStore(createAppReducer(await requestInitialState()));

  const target = document.getElementById("app");
  render(
    <Provider store={store}>
      <CardContainerComponent />
    </Provider>,
    target
  );
})();
