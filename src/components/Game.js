import React, { useEffect, useState } from "react";
import Board from "./Board";
import BoardModifier from "./BoardModifier";

const Game = () => {
  const [nCol, setNCol] = useState(3);
  const [nRow, setNRow] = useState(3);
  const [history, setHistory] = useState([
    {
      squares: Array(nRow)
        .fill(null)
        .map((e) => Array(nCol).fill(null)),
      lastMoveCol: 0,
      lastMoveRow: 0,
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isAscending, setIsAscending] = useState(true);
  const [movesToWin, setMovesToWin] = useState(3);
  useEffect(() => {
    console.log(nCol, nRow);
    //Reset the game
    setHistory([
      {
        squares: Array(nRow)
          .fill(null)
          .map((e) => Array(nCol).fill(null)),
        lastMoveCol: 0,
        lastMoveRow: 0,
      },
    ]);
    setStepNumber(0);
    setXIsNext(true);
    //Any board bigger than 5x5 will require 5 moves to make a win
    if (nCol <= 5 || nRow <= 5) setMovesToWin(3);
    else setMovesToWin(5);
  }, [nCol, nRow]);
  const current = history[stepNumber];
  console.log(
    current.squares,
    nRow,
    nCol,
    current.lastMoveRow,
    current.lastMoveCol,
    stepNumber
  );
  const winner = calculateWinner(
    current.squares,
    movesToWin,
    current.lastMoveRow,
    current.lastMoveCol,
    xIsNext ? "O" : "X"
  );
  const handleClick = (moveRow, moveCol) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.map((row) => row.slice());
    if (winner.winner || squares[moveRow][moveCol]) {
      return;
    }
    squares[moveRow][moveCol] = xIsNext ? "X" : "O";
    setHistory(
      newHistory.concat([
        {
          squares: squares,
          lastMoveCol: moveCol,
          lastMoveRow: moveRow,
        },
      ])
    );
    setStepNumber(newHistory.length);
    setXIsNext((prev) => !prev);
  };
  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  const moves = history.map((step, move) => {
    const desc = move
      ? "Go to move #" +
        move +
        ": " +
        (move % 2 === 0 ? "O" : "X") +
        "(" +
        step.lastMoveCol +
        ", " +
        step.lastMoveRow +
        ")"
      : "Go to game start";
    return (
      <li key={move}>
        <button
          className={stepNumber === move ? "selected-item" : ""}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });
  let status;
  if (winner.winner) {
    status = <span className="win-status">Winner: {winner.winner}</span>;
  } else {
    if (IsDraw(current.squares)) {
      status = <span className="draw-status">Draw!</span>;
    } else status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <Board
        nCol={nCol}
        squares={current.squares}
        onClick={handleClick}
        winnerMoves={winner.winnerMoves}
      />

      <div className="game-info">
        <div className="status">{status}</div>
        <div>
          Number of Columns (min 3): <BoardModifier setter={setNCol} />
        </div>
        <div>
          Number of Rows (min 3): <BoardModifier setter={setNRow} />
        </div>
        <div>
          Moves to win: <span style={{ fontWeight: "bold" }}>{movesToWin}</span>
        </div>
        <div>
          Board with Collumns {">"} 5{" "}
          <span style={{ fontWeight: "bold" }}>and</span> Rows {">"} 5 will
          require 5 moves to make a win. Otherwise, 3.
        </div>
        <div>Moves are displayed in the format (col, row):</div>

        <div>
          Move order: {isAscending ? "Ascending" : "Descending"}{" "}
          <button onClick={() => setIsAscending((prev) => !prev)}>
            Toggle
          </button>
        </div>
        <ol reversed={!isAscending}>{isAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
};
function IsDraw(squares) {
  return squares.reduce(
    (prevValue, row) => prevValue && !row.some((e) => e === null),
    true
  );
}

function calculateWinner(squares, movesToWin, placedRow, placedCol, player) {
  let winnerMoves = [];
  let count = 0;
  let tempRow = placedRow,
    tempCol = placedCol;
  //check vertically
  while (tempRow - 1 >= 0 && squares[tempRow - 1][tempCol] === player) {
    count++;
    tempRow--;
  }
  tempRow = placedRow;
  tempCol = placedCol;
  while (
    tempRow + 1 < squares.length &&
    squares[tempRow + 1][tempCol] === player
  ) {
    count++;
    tempRow++;
  }
  if (count >= movesToWin - 1) {
    while (count >= 0) {
      winnerMoves.push([tempRow, tempCol]);
      tempRow--;
      count--;
    }
    console.log("vertical");
    return {
      winnerMoves,
      winner: player,
    };
  }
  //Check horizontally
  count = 0;
  tempRow = placedRow;
  tempCol = placedCol;
  while (tempCol - 1 >= 0 && squares[tempRow][tempCol - 1] === player) {
    count++;
    tempCol--;
  }
  tempRow = placedRow;
  tempCol = placedCol;
  while (
    tempCol + 1 < squares[0].length &&
    squares[tempRow][tempCol + 1] === player
  ) {
    count++;
    tempCol++;
  }
  if (count >= movesToWin - 1) {
    while (count >= 0) {
      winnerMoves.push([tempRow, tempCol]);
      tempCol--;
      count--;
    }
    console.log("horizontal");
    return {
      winnerMoves,
      winner: player,
    };
  }
  //Check diagonally (main)
  count = 0;
  tempRow = placedRow;
  tempCol = placedCol;
  while (
    tempRow - 1 >= 0 &&
    tempCol + 1 < squares[0].length &&
    squares[tempRow - 1][tempCol + 1] === player
  ) {
    count++;
    tempRow--;
    tempCol++;
  }
  tempRow = placedRow;
  tempCol = placedCol;
  while (
    tempRow + 1 < squares.length &&
    tempCol - 1 >= 0 &&
    squares[tempRow + 1][tempCol - 1] === player
  ) {
    count++;
    tempRow++;
    tempCol--;
  }
  if (count >= movesToWin - 1) {
    while (count >= 0) {
      winnerMoves.push([tempRow, tempCol]);
      tempRow--;
      tempCol++;
      count--;
    }
    console.log("main diagonal");
    return {
      winnerMoves,
      winner: player,
    };
  }
  //Check diagonally (skew)
  count = 0;
  tempRow = placedRow;
  tempCol = placedCol;
  while (
    tempRow - 1 >= 0 &&
    tempCol - 1 >= 0 &&
    squares[tempRow - 1][tempCol - 1] === player
  ) {
    count++;
    tempRow--;
    tempCol--;
  }
  tempRow = placedRow;
  tempCol = placedCol;
  while (
    tempRow + 1 < squares.length &&
    tempCol + 1 < squares[0].length &&
    squares[tempRow + 1][tempCol + 1] === player
  ) {
    count++;
    tempRow++;
    tempCol++;
  }
  if (count >= movesToWin - 1) {
    while (count >= 0) {
      winnerMoves.push([tempRow, tempCol]);
      tempRow--;
      tempCol--;
      count--;
    }
    console.log("skew diagonal");
    return {
      winnerMoves,
      winner: player,
    };
  }
  // return false;
  return {
    winnerMoves: [],
    winner: null,
  };
}

export default Game;
