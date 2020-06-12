import React from "react";

import IFrameWrapper from "../Components/IframeWrapper";
import { useSelector } from "react-redux";
import AppState from "../States/AppState";

export default () => {
  const state = useSelector((appState: AppState) => appState);

  return <IFrameWrapper url={state.url} />;
};
