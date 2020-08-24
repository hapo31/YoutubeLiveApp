import React from "react";
import styled from "styled-components";

import { SuperChatInfo } from "@common/AppState/AppState";
import ChatCard from "../ChatCard/ChatCard";

type Props = {
  superChatList: SuperChatInfo[];
  onClickCard: (index: number) => void;
};
export default (props: Props) => (
  <Container>
    <ChatCardContainer>
      {props.superChatList.map((superChat, index) => (
        <ChatCard key={`${index}-${superChat.messageRaw}`} onClick={props.onClickCard} superChatInfo={superChat} index={index} />
      ))}
    </ChatCardContainer>
    <SuperChatCount>スパチャの数:{props.superChatList.length}</SuperChatCount>
  </Container>
);

const Container = styled.div`
  user-select: none;
`;

const ChatCardContainer = styled.div`
  margin-top: 55px;
`;

const SuperChatCount = styled.div`
  font-size: 24px;
  font-weight: bold;
  background-color: white;
  position: fixed;
  width: 100%;
  height: 50px;
  top: 0;
  z-index: 999;
`;
