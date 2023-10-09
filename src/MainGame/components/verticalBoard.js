import { useTheme } from "@emotion/react";
import { useState, useEffect } from "react";
import { getColorFromIsCheckedAndTheme } from "../../App";

export default function VerticalBoard({ verticalBoardSettings }) {
  const { verticalBoard, width, height, squareSize } = verticalBoardSettings;

  const [formattedVerticalBoard, setFormattedVerticalBoard] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    const formatted = [];
    verticalBoard.forEach(line => {
      const formattedLine = line.map(el => ({ value: el, isCrossed: false }));
      if (formattedLine.length === width) {
        formatted.push(formattedLine);
      } else {
        const lineToUpdate = [ ...formattedLine ];
        for (var i = 0; i < width - formattedLine.length; i++) {
          lineToUpdate.unshift({ value: 0, isCrossed: false });
        }
        formatted.push(lineToUpdate);
      }
    });
    setFormattedVerticalBoard(formatted);
  }, [verticalBoard, width, height]);

  const changeIsCrossedValue = (rowIndex, colIndex) => {
    const newBoard = formattedVerticalBoard.map((row, rIndex) => {
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

    setFormattedVerticalBoard(newBoard);
  };
  
  return (
    <table style={{ borderCollapse: "collapse" }}>
    <tbody>
    {formattedVerticalBoard.map((row, rowIndex) => (
        <tr key={"verticalRow-" + rowIndex}>
          {row.map((cell, colIndex) => (
            <td
              key={"verticalCol-" + colIndex}
              align="center"
              padding="none"
              onClick={() => changeIsCrossedValue(rowIndex, colIndex)}
              style={{ 
                borderTop: "1px solid gray",
                borderRight: "1px solid gray",
                borderBottom: ((rowIndex + 1) !== height && (rowIndex + 1) % 5 === 0) ? "2px solid darkgray" : "1px solid gray",
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
