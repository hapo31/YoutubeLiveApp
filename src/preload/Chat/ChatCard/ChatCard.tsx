import React, { useCallback } from "react";

import styled from "styled-components";
import { SuperChatInfo } from "@common/AppState/AppState";

type Props = {
  superChatInfo: SuperChatInfo;
  index: number;
  onClick: (index: number) => void;
};

export default (props: Props) => {
  const onClickCopyHandler = useCallback(
    (text: string) => async () => {
      navigator.clipboard.writeText(text);
    },
    []
  );

  const onClickContainerHandler = useCallback((index: number) => () => props.onClick(index), [props.index]);

  const { superChatInfo } = props;
  return (
    <Container onClick={onClickContainerHandler(props.index)} isBordered={superChatInfo.checked} className="container">
      <Header backgroundColor={superChatInfo.superChatColorInfo.secondary}>
        <Img src={superChatInfo.imgUrl} alt="" height="40" width="40" />
        <Wrapper>
          <Name
            onClick={onClickCopyHandler(superChatInfo.author)}
            color={superChatInfo.superChatColorInfo.authorName}
            dangerouslySetInnerHTML={{ __html: superChatInfo.authorRaw }}
          />
          <Purches color={superChatInfo.superChatColorInfo.header}>{superChatInfo.purches}</Purches>
        </Wrapper>
      </Header>
      {superChatInfo.messageRaw.length > 0 ? (
        <Message
          onClick={onClickCopyHandler(superChatInfo.message)}
          backgroundColor={superChatInfo.superChatColorInfo.primary}
          color={superChatInfo.superChatColorInfo.message}
          dangerouslySetInnerHTML={{ __html: superChatInfo.messageRaw }}
        />
      ) : null}
    </Container>
  );
};

type styledProps = {
  color?: string;
  backgroundColor?: string;
};

const Container = styled.div`
  border: ${({ isBordered }: { isBordered: boolean }) => (isBordered ? "solid 3px blue" : "none")};
  margin: 5px;
  border-radius: 10px;
  > img {
    height: 24px;
    width: 24px;
  }
`;

const Header = styled.div`
  display: flex;
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

const Wrapper = styled.div`
  flex-direction: vertical;
`;

const Name = styled.div`
  color: ${(props: styledProps) => props.color};
  :hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const Purches = styled.div`
  color: ${(props: styledProps) => props.color};
`;

const Message = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  background-color: ${(props: styledProps) => props.backgroundColor};
  color: ${(props: styledProps) => props.color};
  :hover {
    background-color: rgba(0, 0, 0, 0.3);
  }

  > img {
    width: 24px;
    height: 24px;
  }
`;
