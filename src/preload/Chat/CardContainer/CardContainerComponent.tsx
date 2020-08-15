import React, { useCallback } from "react";
import SuperChatCardList from "./SuperChatCardList";
import { useSelector, useDispatch } from "react-redux";
import AppState from "@common/AppState/AppState";
import { CheckedSuperchat } from "@common/AppState/Actions/AppStateAction";

export default () => {
  const appState = useAppState();
  const dispatch = useDispatch();
  const onClickCardHandler = useCallback((index: number) => {
    dispatch(CheckedSuperchat(index));
  }, []);
  console.log(appState);
  return <SuperChatCardList onClickCard={onClickCardHandler} superChatList={appState.superChats}></SuperChatCardList>;
};

function useAppState() {
  return useSelector((appState) => appState as AppState);
}
