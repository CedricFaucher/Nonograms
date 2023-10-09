import { useTheme } from "@emotion/react";
import { useState, useEffect } from "react";
import { getColorFromIsCheckedAndTheme } from "../../App";

export default function HorizontalBoard({ horizontalBoardSettings }) {
  const { horizontalBoard, width, height, squareSize } = horizontalBoardSettings;

  const [formattedHorizontalBoard, setFormattedHorizontalBoard] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    const formatted = [];
    for (var i = 0; i < height; i++) {
      const horizontalBar = [];
      for (var j = 0; j < width; j++) {
        const position = horizontalBoard[j].length - i - 1;
        const value = 0 > position ? 0 : horizontalBoard[j][position];
        horizontalBar.push({ value: value, isCrossed: false });
      }
      formatted.unshift(horizontalBar);
    }
    setFormattedHorizontalBoard(formatted);
  }, [horizontalBoard, width, height]);
  
  const changeIsCrossedValue = (rowIndex, colIndex) => {
    const newBoard = formattedHorizontalBoard.map((row, rIndex) => {
      if (rIndex !== rowIndex) {
        return row;
      } else {
        return row.map((col, cIndex) => {
          if (cIndex !== colIndex) {
            return col;
          } else {
            return { ...col, isCrossed: !col.isCrossed };
          }
        });
      }
    });

    setFormattedHorizontalBoard(newBoard);
  };

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {formattedHorizontalBoard.map((row, rowIndex) => (
          <tr key={"horizontalRow-" + rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={"horizontalCol-" + colIndex}
                align="center"
                padding="none"
                onClick={() => changeIsCrossedValue(rowIndex, colIndex)}
                style={{ 
                  borderTop: "1px solid gray",
                  borderRight: ((colIndex + 1) !== width && (colIndex + 1) % 5 === 0) ? "2px solid darkgray" : "1px solid gray",
                  borderBottom: "1px solid gray",
                  borderLeft: "1px solid gray",
                  borderCollapse: "collapse",
                  color: getColorFromIsCheckedAndTheme(cell.value !== 0, theme),
                  textDecoration: cell.isCrossed ? "line-through" : "",
                  cursor: "pointer",
                  width: squareSize,
                  height: squareSize,
                  fontSize: squareSize / 2
                }}
              >
                {cell.value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
