import React, { useMemo } from "react";
import styled from "styled-components";

import { SuperChatInfo } from "@common/AppState/AppState";
import ChatCard from "../ChatCard/ChatCard";

type Props = {
  superChatList: SuperChatInfo[];
  onClickCard: (index: number) => void;
};
export default (props: Props) => {
  const remainCount = useMemo(() => props.superChatList.length - props.superChatList.filter((chat) => chat.checked).length, [props.superChatList]);
  return (
    <Container>
      <SuperChatCount>スーパーチャットの合計(数):{props.superChatList.length}</SuperChatCount>
      <ChatCardContainer>
        {props.superChatList.map((superChat, index) => (
          <ChatCard key={`${index}-${superChat.messageRaw}`} onClick={props.onClickCard} superChatInfo={superChat} index={index} />
        ))}
      </ChatCardContainer>
      {remainCount > 0 ? (
        <SuperChatRemainCountContainer>
          <SuperChatRemainCount>未読:{remainCount}</SuperChatRemainCount>
        </SuperChatRemainCountContainer>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  user-select: none;
`;

const ChatCardContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 20px;
`;

const SuperChatCount = styled.div`
  background-color: #212121;
  text-align: center;
  display: table-cell;
  vertical-align: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  position: fixed;
  width: 100%;
  padding: 5px 0;
  top: 0;
  z-index: 999;
`;

const SuperChatRemainCountContainer = styled.div`
  text-align: center;
  position: fixed;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 20px;
  bottom: 0;
  z-index: 999;
`;

const SuperChatRemainCount = styled.div`
  padding: 0px 10px;
  margin-bottom: 5px;
  color: #212121;
  border-radius: 16px;
  background-color: aquamarine;
  width: auto;
  font-size: 12px;
  font-weight: bold;
`;
