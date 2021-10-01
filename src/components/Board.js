import React, { useEffect, useState } from "react";
import NumberSquare from "./NumberSquare";
import Square from "./Square";
const Board = ({ nCol, squares, onClick, winnerMoves }) => {
  const [boardWidth, setboardWidth] = useState({
    width: "auto",
  });
  useEffect(() => {
    setboardWidth({
      width: 34 * (nCol + 1) + "px",
    });
  }, [nCol]);
  function renderSquare(i, squareValue, moveCol, moveRow) {
    return (
      <Square
        key={i}
        value={squareValue}
        onClick={() => {
          onClick(moveRow, moveCol);
        }}
        isWon={winnerMoves.some(
          (e) => JSON.stringify(e) === JSON.stringify([moveRow, moveCol])
        )}
      />
    );
  }
  function renderBoard() {
    return squares.map((row, rowIndex) => {
      return (
        <div className="board-row" key={rowIndex}>
          <NumberSquare value={rowIndex} />
          {row.map((squareValue, colIndex) =>
            renderSquare(
              rowIndex * nCol + colIndex,
              squareValue,
              colIndex,
              rowIndex
            )
          )}
        </div>
      );
    });
  }

  return (
    <div className="game-board" style={boardWidth}>
      <div className="board-row">
        <NumberSquare value="" />
        {Array.apply(null, Array(nCol)).map((col, i) => (
          <NumberSquare value={i} key={i} />
        ))}
      </div>
      {renderBoard()}
    </div>
  );
};

export default Board;
