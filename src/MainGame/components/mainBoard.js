import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';
import { getColorFromIsCheckedAndTheme } from '../../App';
import { getSquareValue, setSquare } from '../../utils/squareUtils';

export default function MainBoard({ board, setHasWon, squaringValue }) {
  const { boardSolution, width, height, squareSize } = board;

  const boardSolutionChecked = JSON.stringify(boardSolution.map(row => row.map(col => col.isChecked)));

  const [playBoard, setPlayBoard] = useState([]);
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [isMouseDownActive, setIsMouseDownActive] = useState([-1, -1]);

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

  const highlightSquares = (currentRowValue, currentColValue) => {
    setHighlightedSquares([]);

    const isRow = isMouseDownActive[0] === currentRowValue;
    const isCol = isMouseDownActive[1] === currentColValue;

    if (!isRow && !isCol) {
      return;
    }
    
    if (isRow && isCol) {
      setHighlightedSquares([{row: isMouseDownActive[0], col: isMouseDownActive[1]}]);
      return;
    }

    const updatedHighlightedSquares = [];
    const isPositiveVariation = isRow ? currentColValue - isMouseDownActive[1] > 0 : currentRowValue - isMouseDownActive[0] > 0;

    if (isRow) {
      for (var i = isMouseDownActive[1]; isPositiveVariation ? (i <= currentColValue) : (i >= currentColValue); isPositiveVariation ? i++ : i--) {
        updatedHighlightedSquares.push({row: isMouseDownActive[0], col: i});
      }
    } else {
      for (var j = isMouseDownActive[0]; isPositiveVariation ? (j <= currentRowValue) : (j >= currentRowValue); isPositiveVariation ? j++ : j--) {
        updatedHighlightedSquares.push({row: j, col: isMouseDownActive[1]});
      }
    }

    setHighlightedSquares(updatedHighlightedSquares);
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
                onMouseEnter={() => highlightSquares(rowIndex, colIndex)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsMouseDownActive([rowIndex, colIndex]);
                }}
                onMouseUp={() => {
                  highlightedSquares.map(highlightedSquare => updatePlayBoard(highlightedSquare.row, highlightedSquare.col))
                  setIsMouseDownActive([-1, -1]);
                }}
                style={{
                  cursor: "pointer",
                  borderTop: "1px solid gray",
                  borderRight: ((colIndex + 1) !== width && (colIndex + 1) % 5 === 0) ? "2px solid darkgray" : "1px solid gray",
                  borderBottom: ((rowIndex + 1) !== height && (rowIndex + 1) % 5 === 0) ? "2px solid darkgray" : "1px solid gray",
                  borderLeft: "1px solid gray",
                  borderCollapse: "collapse",
                  width: squareSize,
                  height: squareSize,
                  backgroundColor: highlightedSquares.map(highlightedSquare => JSON.stringify(highlightedSquare)).includes(JSON.stringify({row: rowIndex, col: colIndex})) ? "lightgreen" : getColorFromIsCheckedAndTheme(cell.isChecked, theme),
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
