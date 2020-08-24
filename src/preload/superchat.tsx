import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import CardContainerComponent from "./Chat/CardContainer/CardContainerComponent";
import createSharedStore, { requestInitialState } from "@common/Middlewares/WebcontentsPreloadMiddleware";
import createAppReducer from "@common/AppState/AppStateReducer";

(async () => {
  const store = createSharedStore(createAppReducer(await requestInitialState()));

  const target = document.getElementById("app");
  render(
    <Provider store={store}>
      <CardContainerComponent />
    </Provider>,
    target
  );
})();
