import React from "react";

import styled from "styled-components";
import { SuperChatInfo } from "@common/AppState/AppState";

type Props = {
  superChatInfo: SuperChatInfo;
};

export default ({ superChatInfo }: Props) => (
  <Container>
    <Header backgroundColor={superChatInfo.superChatColorInfo.secondary}>
      <Img src={superChatInfo.imgUrl} alt="" height="40" width="40" />
      <Name color={superChatInfo.superChatColorInfo.authorName} dangerouslySetInnerHTML={{ __html: superChatInfo.author }} />
      <Purches color={superChatInfo.superChatColorInfo.header}>{superChatInfo.purches}</Purches>
    </Header>
    <Message
      backgroundColor={superChatInfo.superChatColorInfo.primary}
      color={superChatInfo.superChatColorInfo.message}
      dangerouslySetInnerHTML={{ __html: superChatInfo.message }}
    />
  </Container>
);

type styledProps = {
  color?: string;
  backgroundColor?: string;
};

const Container = styled.div`
  border-radius: 5px;
`;

const Header = styled.div`
  width: 280px;
  height: 40px;
  padding: 8px 16px;
  background-color: ${(props: styledProps) => props.backgroundColor};
`;

const Img = styled.img`
  display: block;
  width: 40px;
  height: 40px;
  margin-right: 16px;
`;

const Name = styled.p`
  color: ${(props: styledProps) => props.color};
`;

const Purches = styled.p`
  color: ${(props: styledProps) => props.color};
`;

const Message = styled.div`
  padding: 8px 16px;
  background-color: ${(props: styledProps) => props.backgroundColor};
  color: ${(props: styledProps) => props.color};
`;
