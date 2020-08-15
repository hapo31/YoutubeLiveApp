import React, { useState } from "react";
import SuperChatCardList from "./SuperChatCardList";
import { useSelector } from "react-redux";
import AppState from "@common/AppState/AppState";

export default () => {
  const appState = useAppState();
  console.log(appState);
  return <SuperChatCardList superChatList={appState.superChats}></SuperChatCardList>;
};

function useAppState() {
  return useSelector((appState) => appState as AppState);
}
