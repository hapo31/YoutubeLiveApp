import React from "react";

import WebViewWrapper from "../Components/WebViewWrapper";
import { useSelector } from "react-redux";
import AppState from "@common/AppState/States/AppState";

export default () => {
  const state = useSelector((appState: AppState) => appState);
  return <WebViewWrapper url={state.url} />;
};
