import { getMaxLengthOfArrayInArray } from "./arrayUtils";
import { convertBinaryStringToInteger } from "./binaryUtils";
import { setSquare } from "./squareUtils";

export const getMainBoardSettings = (boardSolutionString) => {
  const width = convertBinaryStringToInteger(boardSolutionString.slice(0, 9));
  const height = convertBinaryStringToInteger(boardSolutionString.slice(9, 18));

  const boardSolutionAsString = boardSolutionString.slice(18);
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

  return { boardSolution, horizontalBoard, verticalBoard, width, height };
};

export const getDefaultEmptyBoardSolution = (boardSolutionString) => {
  const width = convertBinaryStringToInteger(boardSolutionString.slice(0, 9));
  const height = convertBinaryStringToInteger(boardSolutionString.slice(9, 18));

  return new Array(height).fill(setSquare("CHECKED", false)).map(() => new Array(width).fill(setSquare("CHECKED", false)));
};

export const getDefaultBoardSolution = (boardSolutionString) => {
  const mainBoardSettings = getMainBoardSettings(boardSolutionString);
  return mainBoardSettings.boardSolution;
};

export const getDefaultHorizontalBoardSolution = (boardSolutionString) => {
  const mainBoardSettings = getMainBoardSettings(boardSolutionString);
  const height = getMaxLengthOfArrayInArray(mainBoardSettings.horizontalBoard);
  const defaultHorizontalBoardSolution = [];

  for (var i = 0; i < height; i++) {
    const horizontalBar = [];
    for (var j = 0; j < mainBoardSettings.width; j++) {
      const position = mainBoardSettings.horizontalBoard[j].length - i - 1;
      const value = 0 > position ? 0 : mainBoardSettings.horizontalBoard[j][position];
      horizontalBar.push({ value: value, isCrossed: false });
    }
    defaultHorizontalBoardSolution.unshift(horizontalBar);
  }

  return defaultHorizontalBoardSolution;
};

export const getDefaultVerticalBoardSolution = (boardSolutionString) => {
  const mainBoardSettings = getMainBoardSettings(boardSolutionString);
  const width = getMaxLengthOfArrayInArray(mainBoardSettings.verticalBoard);
  const defaultVerticalBoardSolution = [];

  mainBoardSettings.verticalBoard.forEach(line => {
    const formattedLine = line.map(el => ({ value: el, isCrossed: false }));
    if (formattedLine.length === width) {
      defaultVerticalBoardSolution.push(formattedLine);
    } else {
      const lineToUpdate = [ ...formattedLine ];
      for (var i = 0; i < width - formattedLine.length; i++) {
        lineToUpdate.unshift({ value: 0, isCrossed: false });
      }
      defaultVerticalBoardSolution.push(lineToUpdate);
    }
  });

  return defaultVerticalBoardSolution;
};