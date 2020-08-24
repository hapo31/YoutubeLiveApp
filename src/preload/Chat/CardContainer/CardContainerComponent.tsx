import React, { useCallback, useMemo } from "react";
import SuperChatCardList from "./SuperChatCardList";
import { useSelector, useDispatch } from "react-redux";
import AppState from "@common/AppState/AppState";
import { CheckedSuperchat } from "@common/AppState/Actions/AppStateAction";
import { ChatState } from "@common/Chat/ChatState";

const videoIdParseRegExp = /https:\/\/studio\.youtube\.com\/video\/(\w+)\/livestreaming/;

export default () => {
  const appState = useAppState();
  const dispatch = useDispatch();
  const videoId = useMemo(() => {
    const result = videoIdParseRegExp.exec(appState.nowUrl);
    if (result) {
      return result[1];
    }
    throw "❓💩❓💩❓💩❓";
  }, [appState.nowUrl]);
  const onClickCardHandler = useCallback((index: number) => {
    dispatch(CheckedSuperchat(videoId, index));
  }, []);

  console.log(appState);
  return <SuperChatCardList onClickCard={onClickCardHandler} superChatList={appState.superChats[videoId] || []}></SuperChatCardList>;
};

function useAppState() {
  return useSelector(({ app: appState }: { app: AppState; chat: ChatState }) => appState as AppState);
}
