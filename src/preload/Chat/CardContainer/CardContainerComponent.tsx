import React, { useCallback, useMemo } from "react";
import SuperChatCardList from "./SuperChatCardList";
import { useSelector, useDispatch } from "react-redux";
import AppState from "@common/AppState/AppState";
import { CheckedSuperchat } from "@common/AppState/Actions/AppStateAction";
import { ChatState } from "@common/Chat/ChatState";
import ContextMenuEnableArea from "../ContextMenu/ContextMenuEnableArea";

const videoIdParseRegExp = /https:\/\/studio\.youtube\.com\/video\/(\w+)\/livestreaming/;

export default () => {
  const appState = useAppState();
  const dispatch = useDispatch();
  const videoId = useMemo(() => {
    const result = videoIdParseRegExp.exec(appState.nowUrl);
    if (result) {
      return result[1];
    } else {
      return null;
    }
  }, [appState.nowUrl]);
  const onClickCardHandler = useCallback(
    (index: number) => {
      if (videoId) {
        dispatch(CheckedSuperchat(videoId, index));
      }
    },
    [videoId]
  );

  console.log(appState);
  return (
    <ContextMenuEnableArea
      menuRenderer={() => (
        <>
          <p>a</p>
          <p>b</p>
          <p>c</p>
        </>
      )}
    >
      <SuperChatCardList onClickCard={onClickCardHandler} superChatList={videoId ? appState.superChats[videoId] : []} />
    </ContextMenuEnableArea>
  );
};

function useAppState() {
  return useSelector(({ app: appState }: { app: AppState; chat: ChatState }) => appState);
}
