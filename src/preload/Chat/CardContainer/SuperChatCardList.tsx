import React from "react";

type Props = {
  isVisible: boolean;
  cardList: HTMLElement[];
};
export default (props: Props) =>
  props.isVisible ? (
    <div
      style={{
        display: "fixed",
        top: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
      }}
    >
      <h1>スパチャの数:{props.cardList.length}</h1>
      {props.cardList.map((card) => (
        <p>{card}</p>
      ))}
    </div>
  ) : null;
