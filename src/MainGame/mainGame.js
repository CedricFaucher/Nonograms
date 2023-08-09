import { useState, useEffect } from "react";
import MainBoard from "./components/mainBoard";
import { convertBinaryStringToInteger } from "../utils/binaryUtils";
import { getMaxLengthOfArrayInArray } from "../utils/arrayUtils";
import HorizontalBoard from "./components/horizontalBoard";
import VerticalBoard from "./components/verticalBoard";

export default function MainGame() {
  const [data, setData] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [mainBoardSettings, setMainBoardSettings] = useState({
    boardSolution: [],
    width: 0,
    height: 0
  });
  const [horizontalBoardSettings, setHorizontalBoardSettings] = useState({
    horizontalBoard: [],
    width: 0,
    height: 0
  });
  const [verticalBoardSettings, setVerticalBoardSettings] = useState({
    verticalBoard: [],
    width: 0,
    height: 0
  });

  useEffect(() => {
    getDataFromDb();
  }, []);

  useEffect(() => {
    if (undefined !== data.find(board => board.id === 0)) {
      const boardAsString = data.find(board => board.id === 0).message;
  
      const width = convertBinaryStringToInteger(boardAsString.slice(0, 9));
      const height = convertBinaryStringToInteger(boardAsString.slice(9, 18));
      
      const boardSolutionAsString = boardAsString.slice(18);
      const boardSolution = [];
      const verticalBoard = [];
      const horizontalBoard = Array.from(Array(width), () => []);
      const verticalAcc = Array.from(Array(width), () => 0);
  
      for (var i = 0; i < height; i++) {
        const line = [];
        const horizontalLine = [];
        let acc = 0;
        for (var j = 0; j < width; j++) {
          const value = parseInt(boardSolutionAsString.charAt((i * width) + j));
          line.push(value);
          if (1 === value) {
            acc++;
            verticalAcc[j]++;
          } else {
            if (0 === value && 0 < acc) {
              horizontalLine.push(acc);
              acc = 0;
            }
            if (0 === value && 0 < verticalAcc[j]) {
              horizontalBoard[j].push(verticalAcc[j]);
              verticalAcc[j] = 0;
            }
          } 
        }
        boardSolution.push(line);
  
        if (0 < acc) {
          horizontalLine.push(acc);
        }
  
        verticalBoard.push(horizontalLine);
      }
  
      for (var k = 0; k < horizontalBoard.length; k++) {
        if (0 < verticalAcc[k]) {
          horizontalBoard[k].push(verticalAcc[k]);
        }
      }
  
      setMainBoardSettings(prev => ({ ...prev, boardSolution, width, height }))
      setHorizontalBoardSettings(prev => ({ ...prev, horizontalBoard, width, height: getMaxLengthOfArrayInArray(horizontalBoard) }));
      setVerticalBoardSettings(prev => ({ ...prev, verticalBoard, width: getMaxLengthOfArrayInArray(verticalBoard), height }));
    }
  }, [data]);
  
  const getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => setData(res.data));
  };

  return (
    <>
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px gray solid", padding: 0 }}>
            </td>
            <td style={{ border: "1px gray solid", padding: 0 }}>
              <HorizontalBoard horizontalBoardSettings={horizontalBoardSettings} />
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px gray solid", padding: 0 }}>
              <VerticalBoard verticalBoardSettings={verticalBoardSettings} />
            </td>
            <td style={{ border: "1px gray solid", padding: 0 }}>
              <MainBoard board={mainBoardSettings} setHasWon={setHasWon}/> 
            </td>
          </tr>
        </tbody>
      </table>
      {hasWon && <h1>WIN!</h1>}
    </>
  );
}
