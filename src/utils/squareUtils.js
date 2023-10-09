export const setSquare = (squaringType, squareValue) => {
  return {
    isChecked: squaringType === "CHECKED" && squareValue,
    isCrossed: squaringType === "CROSSED" && squareValue,
    isQuestionMark: squaringType === "QUESTION_MARK" && squareValue
  }
};

export const getSquareValue = (squaringType, square) => {
  if (squaringType === "QUESTION_MARK") {
    return square.isQuestionMark;
  } if (squaringType === "CROSSED") {
    return square.isCrossed;
  }
  return square.isChecked;
};