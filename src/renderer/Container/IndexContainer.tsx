import React from "react";

import IFrameWrapper from "../Components/WebViewWrapper";
import { useSelector } from "react-redux";
import AppState from "../States/AppState";

export default () => {
  const state = useSelector((appState: AppState) => appState);

  console.log(state);

  return <IFrameWrapper url={state.url} />;
};
