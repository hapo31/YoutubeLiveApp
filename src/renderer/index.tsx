import React from "react";
import ReactDOM from "react-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";

import createAppReducer from "./Reducers/AppStateReducer";
import IndexContainer from "./Container/IndexContainer";

const locationHref = location.href;

const firstView: string = decodeURIComponent(
  locationHref.slice(locationHref.indexOf("n=") + 2)
);

console.log({ locationHref, firstView });

const store = createStore(createAppReducer({ url: firstView }));

const app = (
  <Provider store={store}>
    <IndexContainer />
  </Provider>
);

ReactDOM.render(app, document.getElementById("app"));
