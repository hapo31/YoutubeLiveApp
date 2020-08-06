import React from "react";

type Props = {
  isVisible: boolean;
  cardList: string[];
};
export default (props: Props) =>
  props.isVisible ? (
    <div
      style={{
        backgroundColor: "red",
        display: "fixed",
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 99999,
      }}
    >
      {props.cardList.map((card) => (
        <p>{card}</p>
      ))}
    </div>
  ) : null;
