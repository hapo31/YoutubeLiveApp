import React from "react";
import ReactDOM from "react-dom";

import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import createAppReducer from "@common/AppState/AppStateReducer";
import RendererProcessMiddleware, { requestInitialState } from "@common/Middlewares/RendererProcessMiddleware";
import IndexContainer from "./Container/IndexContainer";

const myCreateStore = compose(applyMiddleware(RendererProcessMiddleware()))(createStore);

(async () => {
  const store = myCreateStore(createAppReducer(await requestInitialState()));

  const app = (
    <Provider store={store}>
      <IndexContainer />
    </Provider>
  );

  ReactDOM.render(app, document.getElementById("app"));
})();
