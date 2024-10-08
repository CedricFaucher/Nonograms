import { useState, useEffect, useLayoutEffect } from "react";
import MainBoard from "./components/mainBoard";
import { getMaxLengthOfArrayInArray } from "../utils/arrayUtils";
import HorizontalBoard from "./components/horizontalBoard";
import VerticalBoard from "./components/verticalBoard";
import ToggleSquaring from "./components/toggleSquaring";
import { useParams } from "react-router-dom";
import UndoRedo from "./components/undoRedo";
import { getDefaultEmptyBoardSolution, getDefaultHorizontalBoardSolution, getDefaultVerticalBoardSolution, getMainBoardSettings } from "../utils/defaultUtils";
import ResetModal from "../Menu/components/resetModal";
import { updateDB } from "../Menu/menu";
import { CircularProgress } from "@mui/material";

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
  const [currentData, setCurrentData] = useState();
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
  const [actionsQueue, setActionsQueue] = useState([]);
  const [redoQueue, setRedoQueue] = useState([]);
  const [currentAction, setCurrentAction] = useState(null);
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
    if (undefined !== currentData) {
      const boardAsString = currentData.solution;
  
      const {
        boardSolution,
        horizontalBoard,
        verticalBoard,
        width,
        height
      } = getMainBoardSettings(boardAsString);
  
      setMainBoardSettings(prev => ({ ...prev, boardSolution, width, height }))
      setHorizontalBoardSettings(prev => ({ ...prev, horizontalBoard, width, height: getMaxLengthOfArrayInArray(horizontalBoard) }));
      setVerticalBoardSettings(prev => ({ ...prev, verticalBoard, width: getMaxLengthOfArrayInArray(verticalBoard), height }));
    }
  }, [id, data, currentData]);

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
      .then((res) => {
        setData(res.data);
        setCurrentData(res.data.find(el => el._id === id));
      });
  };

  return (
    <div style={{ margin: mainBoardMargin }}>
      {undefined === currentData ? <CircularProgress /> :
        <>
          <h1>
            {currentData.name}
            <span style={{ marginLeft: "0.75rem" }}>

            </span>
            <ResetModal
              confirmFnc={() => {
                updateDB(
                  currentData._id,
                  {
                    name: currentData.name,
                    solution: currentData.solution,
                    boardState: getDefaultEmptyBoardSolution(currentData.solution),
                    horizontalState: getDefaultHorizontalBoardSolution(currentData.solution),
                    verticalState: getDefaultVerticalBoardSolution(currentData.solution),
                    isDone: false
                  }
                );
                getDataFromDb();
              }}
              name={currentData.name}
            />
          </h1>
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
                    currentAction={currentAction}
                    setActionsQueue={setActionsQueue}
                    setRedoQueue={setRedoQueue}
                    setCurrentAction={setCurrentAction}
                    updateLevelFnc={(board, isWon) => updateDB(
                      id,
                      {
                        name: currentData.name,
                        solution: currentData.solution,
                        boardState: board,
                        horizontalState: currentData.horizontalState,
                        verticalState: currentData.verticalState,
                        isDone: isWon
                      }
                    )}
                  /> 
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
          <table>
            <tbody>
              <tr>
                <td>
                  <ToggleSquaring
                    squaringValue={squaringValue}
                    setSquaringValue={setSquaringValue}
                    squareSize={squareSize}
                  />
                </td>
                <td style={{ paddingLeft: "25px" }}>
                  <UndoRedo
                    squareSize={squareSize}
                    setCurrentAction={setCurrentAction}
                    setActionsQueue={setActionsQueue}
                    setRedoQueue={setRedoQueue}
                    actionsQueue={actionsQueue}
                    redoQueue={redoQueue}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {hasWon && <h1>WIN!</h1>}
        </>
      }
    </div>
  );
}
