import React from "react";
import ReactDOM from "react-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";

import createAppReducer from "./Reducers/AppStateReducer";
import IndexContainer from "./Container/IndexContainer";

const locationHref = location.href;
const beforeLivePage = localStorage.getItem("beforeLivePage");

const firstView: string =
  beforeLivePage !== null
    ? beforeLivePage
    : decodeURIComponent(locationHref.slice(locationHref.indexOf("n=") + 2));

const store = createStore(createAppReducer({ url: firstView }));

const app = (
  <Provider store={store}>
    <IndexContainer />
  </Provider>
);

ReactDOM.render(app, document.getElementById("app"));
