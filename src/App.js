import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  console.log(highlight);
  return (
    <button
      className={highlight ? "square square-red" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  // const winner = calculateWinner(squares);
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (winner == null && !squares.includes(null)) {
    status = "Nobody win~ QQ";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div>{loopBoard(squares, handleClick, winningLine)}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [asc, setAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  descriptionList = [];
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to the game start";
    }
    descriptionList.push(description);
    // return (
    //   // <li key={move}>
    //   //   {/* <button onClick={() => jumpTo(move)}>{description}</button> */}
    //   //   <div className="status-small">{description}</div>
    //   // </li>
    // );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      {/* <div className="game-info">
        <ol>{moves}</ol>
      </div> */}
      <div>
        <button onClick={() => setAsc(true)}>Ascending</button>
        <button onClick={() => setAsc(false)}>Descending</button>
        {renderList(descriptionList, asc)}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function loopBoard(squares, handleClick, winnigLine) {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const keyValue = i * 3 + j;
      const isHightlight = winnigLine.includes(keyValue);
      row.push(
        <Square
          key={keyValue}
          value={squares[keyValue]}
          onSquareClick={() => handleClick(keyValue)}
          highlight={isHightlight}
        />
      );
    }
    rows.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }
  return <div>{rows}</div>;
}

function sortItems(items, asc) {
  // return items.sort((a, b) => (asc ? a.key - b.key : b.key - a.key));
  return asc ? items : [...items].reverse();
}

function renderList(items, asc) {
  const sortedItems = sortItems(items, asc);
  return (
    <ul>
      {sortedItems.map((item) => (
        <li key={item.key}>
          <div className="status-small">{item}</div>
        </li>
      ))}
    </ul>
  );
}
