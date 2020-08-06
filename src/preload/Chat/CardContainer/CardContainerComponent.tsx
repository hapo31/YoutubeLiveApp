import React, { useState } from "react";
import SuperChatCardList from "./SuperChatCardList";
import { useSelector } from "react-redux";
import AppState from "@common/AppState/AppState";

export default () => {
  const [visible, setVisible] = useState(false);
  const appState = useSelector((appState) => appState as AppState);
  console.log(appState);
  return (
    <div>
      <button onClick={() => setVisible(!visible)}>スパチャ履歴を表示</button>
      <SuperChatCardList cardList={[]} isVisible={visible}></SuperChatCardList>
    </div>
  );
};
