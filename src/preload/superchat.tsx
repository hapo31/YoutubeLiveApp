import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import CardContainerComponent from "./Chat/CardContainer/CardContainerComponent";
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
