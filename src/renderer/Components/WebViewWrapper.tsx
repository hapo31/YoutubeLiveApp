import React, { CSSProperties, useRef } from "react";

type Props = {
  url: string;
};

const style: CSSProperties = {
  width: "100vw",
  height: "100vh",
};

export default (props: Props) => {
  const ref = useRef<HTMLWebViewElement>(null);
  return (
    <webview style={style} src={props.url} preload="./scripts/preload.js" />
  );
};
