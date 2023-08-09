import { useState, useEffect } from "react";

export default function HorizontalBoard({ horizontalBoardSettings }) {
  const { horizontalBoard, width, height } = horizontalBoardSettings;

  const [formattedHorizontalBoard, setFormattedHorizontalBoard] = useState([]);

  useEffect(() => {
    const pew = [];
    for (var i = 0; i < height; i++) {
      const horizontalBar = [];
      for (var j = 0; j < width; j++) {
        const position = horizontalBoard[j].length - i - 1;
        horizontalBar.push(0 > position ? 0 : horizontalBoard[j][position]);
      }
      pew.unshift(horizontalBar);
    }
    setFormattedHorizontalBoard(pew);
  }, [horizontalBoard, width, height]);
  
  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {formattedHorizontalBoard.map((row, rowIndex) => (
          <tr>
            {row.map((cell, colIndex) => (
              <td
                align="center"
                padding="none"
                onClick={() => {}}
                style={{ border: "1px gray solid", borderCollapse: "collapse" }}
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
