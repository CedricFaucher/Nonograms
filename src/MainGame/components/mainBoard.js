import { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@material-ui/core';

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
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {playBoard.map((row, rowIndex) => (
            <TableRow>
              {row.map((cell, colIndex) => (
                <TableCell align="center" padding="none" onClick={() => updatePlayBoard(rowIndex, colIndex)}>
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
