import React, { CSSProperties } from "react";

type Props = {
  url: string;
};

const style: CSSProperties = {
  width: "100%",
  height: "100%",
};

export default (props: Props) => <webview style={style} src={props.url} />;
