import { useState, useEffect, useLayoutEffect } from "react";
import MainBoard from "./components/mainBoard";
import { convertBinaryStringToInteger } from "../utils/binaryUtils";
import { getMaxLengthOfArrayInArray } from "../utils/arrayUtils";
import HorizontalBoard from "./components/horizontalBoard";
import VerticalBoard from "./components/verticalBoard";
import ToggleSquaring from "./components/toggleSquaring";
import { setSquare } from "../utils/squareUtils";
import { useParams } from "react-router-dom";

const HEIGHT_WEIGHT = 250;

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    }

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};

export default function MainGame() {
  const [data, setData] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [mainBoardSettings, setMainBoardSettings] = useState({
    boardSolution: [],
    width: 0,
    height: 0,
    squareSize: 0
  });
  const [horizontalBoardSettings, setHorizontalBoardSettings] = useState({
    horizontalBoard: [],
    width: 0,
    height: 0,
    squareSize: 0
  });
  const [verticalBoardSettings, setVerticalBoardSettings] = useState({
    verticalBoard: [],
    width: 0,
    height: 0,
    squareSize: 0
  });
  const [squaringValue, setSquaringValue] = useState({
    isChecked: true,
    isCrossed: false,
    isQuestionMark: false
  });
  const [squareSize, setSquareSize] = useState(30);
  // TODO: Dynamize with user stat input
  const [mainBoardMargin, setMainBoardMargin] = useState(20);
  const [maxSizeSquare, setMaxSizeSquare] = useState(100);
  const [minSizeSquare, setMinSizeSquare] = useState(40);

  const { id } = useParams();
  
  const [windowWidth, windowHeight] = useWindowSize();
  
  useEffect(() => {
    if (mainBoardSettings.width === 0 || mainBoardSettings.height === 0 || horizontalBoardSettings.height === 0 || verticalBoardSettings.width === 0) {
      return;
    }

    const mainBoardWidthFromScreen = (windowWidth - (mainBoardMargin * 2)) / (mainBoardSettings.width + verticalBoardSettings.width);
    const mainBoardHeightFromScreen = (windowHeight - (mainBoardMargin * 2) - HEIGHT_WEIGHT) / (mainBoardSettings.height + horizontalBoardSettings.height);
    const mainBoardWidthFromMaxSize = (maxSizeSquare - ((mainBoardMargin * 2)) / (mainBoardSettings.width + verticalBoardSettings.width));
    const mainBoardHeightFromMaxSize = (maxSizeSquare - ((mainBoardMargin * 2) - HEIGHT_WEIGHT) / (mainBoardSettings.height + horizontalBoardSettings.height));

    const boardSquareSize = Math.min(mainBoardWidthFromScreen, mainBoardHeightFromScreen, mainBoardWidthFromMaxSize, mainBoardHeightFromMaxSize);

    setMainBoardSettings(prev => ({ ...prev, squareSize: boardSquareSize > minSizeSquare ? boardSquareSize : minSizeSquare }));
    setHorizontalBoardSettings(prev => ({ ...prev, squareSize: boardSquareSize > minSizeSquare ? boardSquareSize : minSizeSquare }));
    setVerticalBoardSettings(prev => ({ ...prev, squareSize: boardSquareSize > minSizeSquare ? boardSquareSize : minSizeSquare }));
    setSquareSize(boardSquareSize > minSizeSquare ? boardSquareSize : minSizeSquare);
  }, [
    mainBoardSettings.width, 
    mainBoardSettings.height, 
    horizontalBoardSettings.height, 
    verticalBoardSettings.width,
    mainBoardMargin,
    maxSizeSquare,
    minSizeSquare,
    windowWidth,
    windowHeight
  ]);

  useEffect(() => {
    getDataFromDb();
  }, []);

  useEffect(() => {
    if (undefined !== data.find(board => board.id === parseInt(id))) {
      const boardAsString = data.find(board => board.id === parseInt(id)).message;
  
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
          line.push(setSquare("CHECKED", value === 1));
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

  const getSquaringValue = () => {
    if (squaringValue.isQuestionMark) {
      return "QUESTION_MARK";
    } else if (squaringValue.isCrossed) {
      return "CROSSED";
    }
    return "CHECKED";
  };
  
  const getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => setData(res.data));
  };

  return (
    <div style={{ margin: mainBoardMargin }}>
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
              <MainBoard
                board={mainBoardSettings}
                setHasWon={setHasWon}
                squaringValue={getSquaringValue()}
              /> 
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <ToggleSquaring
        squaringValue={squaringValue}
        setSquaringValue={setSquaringValue}
        squareSize={squareSize}
      />
      {hasWon && <h1>WIN!</h1>}
    </div>
  );
}
