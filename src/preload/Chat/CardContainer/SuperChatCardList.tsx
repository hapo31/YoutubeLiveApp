import React from "react";
import { SuperChatInfo } from "@common/AppState/AppState";
import ChatCard from "../ChatCard/ChatCard";

type Props = {
  isVisible: boolean;
  superChatList: SuperChatInfo[];
};
export default (props: Props) =>
  props.isVisible ? (
    <div
      style={{
        display: "fixed",
        top: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
      }}
    >
      <h1>スパチャの数:{props.superChatList.length}</h1>
      {props.superChatList.map((superChat, index) => (
        <ChatCard key={`${index}-${superChat.message}`} superChatInfo={superChat} />
      ))}
    </div>
  ) : null;
