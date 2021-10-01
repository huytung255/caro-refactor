import React from "react";
const Square = ({ onClick, value, isWon }) => {
  return (
    <button
      className={"square " + (isWon ? "won-square" : "")}
      onClick={onClick}
    >
      {value ? value : " "}
    </button>
  );
};

export default Square;
