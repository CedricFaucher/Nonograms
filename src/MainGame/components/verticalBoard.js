import { useState, useEffect } from "react";

export default function VerticalBoard({ verticalBoardSettings }) {
  const { verticalBoard, width, height } = verticalBoardSettings;

  const [formattedVerticalBoard, setFormattedVerticalBoard] = useState([]);

  useEffect(() => {
    const formatted = [];
    verticalBoard.forEach(line => {
      if (line.length === width) {
        formatted.push(line);
      } else {
        const lineToUpdate = [ ...line ];
        for (var i = 0; i < width - line.length; i++) {
          lineToUpdate.unshift(0);
        }
        formatted.push(lineToUpdate);
      }
    });
    setFormattedVerticalBoard(formatted);
  }, [verticalBoard, width, height]);
  
  return (
    <table style={{ borderCollapse: "collapse" }}>
    <tbody>
    {formattedVerticalBoard.map((row, rowIndex) => (
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
