import React from "react";
import { SuperChatInfo } from "@common/AppState/AppState";
import ChatCard from "../ChatCard/ChatCard";

type Props = {
  superChatList: SuperChatInfo[];
};
export default (props: Props) => (
  <>
    <h1>スパチャの数:{props.superChatList.length}</h1>
    {props.superChatList.map((superChat, index) => (
      <ChatCard key={`${index}-${superChat.messageRaw}`} superChatInfo={superChat} />
    ))}
  </>
);
