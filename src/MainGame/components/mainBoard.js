import { useState, useEffect } from 'react';

export default function MainBoard({ board, setHasWon }) {
  const { boardSolution, width, height } = board;

  const jsonStringifiedBoardSolution = JSON.stringify(boardSolution);

  const [playBoard, setPlayBoard] = useState([]);

  useEffect(() => {
    setPlayBoard(new Array(height).fill(0).map(() => new Array(width).fill(0)));
  }, [width, height]);

  useEffect(() => {
    setHasWon(JSON.stringify(playBoard) === jsonStringifiedBoardSolution);
  }, [playBoard, jsonStringifiedBoardSolution, setHasWon]);

  const updatePlayBoard = (row, col) => {
    setPlayBoard(prev => prev.map((r, rI) => r.map((c, cI) => (rI === row && cI === col) ? (c === 0 ? 1 : 0) : c)));
  };

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {playBoard.map((row, rowIndex) => (
          <tr>
            {row.map((cell, colIndex) => (
              <td
                align="center"
                padding="none"
                onClick={() => updatePlayBoard(rowIndex, colIndex)}
                style={{ cursor: "pointer", border: "1px gray solid", borderCollapse: "collapse" }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
