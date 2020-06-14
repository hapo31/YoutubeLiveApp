import React, { CSSProperties, useEffect, useRef } from "react";

type Props = {
  url: string;
};

const style: CSSProperties = {
  width: "100vw",
  height: "100vh",
};

export default (props: Props) => {
  const webviewRef = useRef<HTMLWebViewElement>(null);

  useEffect(() => {
    return () => {
      localStorage.setItem("beforeLivePage", props.url);
    };
  });

  return (
    <webview
      ref={webviewRef}
      style={style}
      src={props.url}
      preload="./scripts/preload.js"
    />
  );
};
