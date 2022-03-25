import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@material-ui/core';

export default function VerticalBoard({ verticalBoardSettings }) {
  const { verticalBoard, width, height } = verticalBoardSettings;

  const [formattedVerticalBoard, setFormattedVerticalBoard] = useState([]);

  useEffect(() => {
    const formatted = [];
    verticalBoard.forEach(line => {
      if (line.length === width) {
        formatted.push(line);
      } else {
        const lineToUpdate = Array.of(line);
        for (var i = 0; i < width - line.length; i++) {
          lineToUpdate.unshift(null);
        }
        formatted.push(lineToUpdate);
      }
    });
    setFormattedVerticalBoard(formatted);
  }, [verticalBoard, width, height]);
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {formattedVerticalBoard.map((row, rowIndex) => (
            <TableRow>
              {row.map((cell, colIndex) => (
                <TableCell align="center" padding="none" onClick={() => {}}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
