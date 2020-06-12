import React, { CSSProperties } from "react";

type Props = {
  url: string;
};

const style: CSSProperties = {
  width: "100vw",
  height: "100vh",
};

export default (props: Props) => <webview style={style} src={props.url} />;
