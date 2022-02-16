import { useState, useEffect } from "react";
import MainBoard from "./components/mainBoard";
import { convertBinaryStringToInteger } from "../utils/binaryUtils";

export default function MainGame() {
  const [data, setData] = useState([]);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    getDataFromDb();
  }, []);
  
  const getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => setData(res.data));
  };

  const getBoardFromString = id => {
    if (undefined === data.find(board => board.id === id)) {
      return { boardSolution: [], width: 0, height: 0 };
    }
    const boardAsString = data.find(board => board.id === id).message;

    const width = convertBinaryStringToInteger(boardAsString.slice(0, 9));
    const height = convertBinaryStringToInteger(boardAsString.slice(9, 18));
    
    const boardSolutionAsString = boardAsString.slice(18);
    const boardSolution = [];

    for (var i = 0; i < height; i++) {
      const line = [];
      for (var j = 0; j < width; j++) {
        line.push(parseInt(boardSolutionAsString.charAt((i * width) + j)));
      }
      boardSolution.push(line);
    }
    
    return {
      boardSolution,
      width,
      height
    };
  };

  return (
    <>
      <MainBoard board={getBoardFromString(1)} setHasWon={setHasWon}/>
      {hasWon && <h1>WIN!</h1>}
    </>
  );
}
