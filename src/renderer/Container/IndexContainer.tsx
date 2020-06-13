import React from "react";

import WebViewWrapper from "../Components/WebViewWrapper";
import { useSelector } from "react-redux";
import AppState from "../States/AppState";

export default () => {
  const state = useSelector((appState: AppState) => appState);
  return <WebViewWrapper url={state.url} />;
};
