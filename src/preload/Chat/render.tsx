import React from "react";
import { render } from "react-dom";
import CardContainerComponent from "./CardContainer/CardContainerComponent";
import { Provider } from "react-redux";
import { Store } from "redux";

// eslint-disable-next-line
export default function renderChatBox(target: HTMLElement, store: Store<any, any>) {
  render(
    <Provider store={store}>
      <CardContainerComponent />
    </Provider>,
    target
  );
}
