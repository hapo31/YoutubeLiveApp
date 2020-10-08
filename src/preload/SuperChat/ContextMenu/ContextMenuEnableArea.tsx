import React, { useState, useCallback } from "react";

import styled from "styled-components";

type Props = {
  children: React.ReactNode;
  menuRenderer: () => JSX.Element;
};

export default (props: Props) => {
  const [show, setShow] = useState(false);
  const [{ x, y }, setPosition] = useState({ x: 0, y: 0 });
  const onClickArea = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    switch (event.button) {
      case 0:
        if (show) {
          setShow(false);
        }
        break;
      case 2:
        setShow(true);
        setPosition({ x: event.pageX, y: event.pageY });
        break;
    }
  }, []);

  const onClickMenu = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
    switch (event.button) {
      case 0:
        setShow(false);
        break;
    }
  }, []);

  return (
    <div onContextMenu={onClickArea}>
      {props.children}
      <ContextMenuItem x={x} y={y} isVisible={show} onClick={onClickMenu}>
        {props.menuRenderer()}
      </ContextMenuItem>
    </div>
  );
};

type ContextMenuItemProps = { isVisible: boolean; x: number; y: number };
const ContextMenuItem = styled.div`
  display: ${({ isVisible }: ContextMenuItemProps) => (isVisible ? "block" : "none")};
  position: fixed;
  top: ${({ y }: ContextMenuItemProps) => y}px;
  left: ${({ x }: ContextMenuItemProps) => x}px;
  min-width: 10px;
  min-height: 10px;
  border: 1px solid gray;
  background-color: white;
`;
