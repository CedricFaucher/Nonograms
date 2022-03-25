import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@material-ui/core';

export default function HorizontalBoard({ horizontalBoardSettings }) {
  const { horizontalBoard, width, height } = horizontalBoardSettings;

  const [formattedHorizontalBoard, setFormattedHorizontalBoard] = useState([]);

  useEffect(() => {
    const pew = [];
    for (var i = 0; i < height; i++) {
      const horizontalBar = [];
      for (var j = 0; j < width; j++) {
        const position = horizontalBoard[j].length - i - 1;
        horizontalBar.push(0 > position ? null : horizontalBoard[j][position]);
      }
      pew.unshift(horizontalBar);
    }
    setFormattedHorizontalBoard(pew);
  }, [horizontalBoard, width, height]);
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {formattedHorizontalBoard.map((row, rowIndex) => (
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
