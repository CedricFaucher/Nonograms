import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';
import { getColorFromIsCheckedAndTheme } from '../../App';
import { getSquareValue, setSquare } from '../../utils/squareUtils';

export default function MainBoard({ board, setHasWon, squaringValue }) {
  const { boardSolution, width, height, squareSize } = board;

  const boardSolutionChecked = JSON.stringify(boardSolution.map(row => row.map(col => col.isChecked)));

  const [playBoard, setPlayBoard] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    setPlayBoard(new Array(height).fill(setSquare("CHECKED", false)).map(() => new Array(width).fill(setSquare("CHECKED", false))));
  }, [width, height]);

  useEffect(() => {
    const currentBoardChecked = playBoard.map(row => row.map(col => col.isChecked));
    setHasWon(JSON.stringify(currentBoardChecked) === boardSolutionChecked);
  }, [playBoard, boardSolutionChecked, setHasWon]);

  const updatePlayBoard = (row, col) => {
    setPlayBoard(prev => prev.map((r, rI) => r.map((c, cI) => (rI === row && cI === col) ? setSquare(squaringValue, !getSquareValue(squaringValue, c)) : c)));
  };

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {playBoard.map((row, rowIndex) => (
          <tr key={"mainRow-" + rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={"mainCol-" + colIndex}
                align="center"
                padding="none"
                onClick={() => updatePlayBoard(rowIndex, colIndex)}
                style={{
                  cursor: "pointer",
                  borderTop: "1px solid gray",
                  borderRight: ((colIndex + 1) !== width && (colIndex + 1) % 5 === 0) ? "2px solid darkgray" : "1px solid gray",
                  borderBottom: ((rowIndex + 1) !== height && (rowIndex + 1) % 5 === 0) ? "2px solid darkgray" : "1px solid gray",
                  borderLeft: "1px solid gray",
                  borderCollapse: "collapse",
                  width: squareSize,
                  height: squareSize,
                  backgroundColor: getColorFromIsCheckedAndTheme(cell.isChecked, theme),
                  fontSize: squareSize / 2
                }}
              >
                {cell.isCrossed ? "X" : cell.isQuestionMark && "?"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
