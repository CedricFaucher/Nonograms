import { useTheme } from "@emotion/react";
import { getColorFromIsCheckedAndTheme } from "../../App";
import { setSquare } from "../../utils/squareUtils";

export default function ToggleSquaring(props) {
  const {
    squaringValue,
    setSquaringValue,
    squareSize
  } = props;

  const theme = useTheme();

  return (
    <table>
      <tbody>
        <tr>
          <td 
            align="center"
            padding="none"
            onClick={() => setSquaringValue(setSquare("CHECKED", true))}
            style={{ 
                    border: squaringValue.isChecked ? "2px yellow solid" : "1px gray solid",
                    borderCollapse: "collapse",
                    backgroundColor: getColorFromIsCheckedAndTheme(true, theme),
                    cursor: "pointer",
                    width: squareSize,
                    height: squareSize,
                    fontSize: squareSize / 2
                  }}
          >
          </td>
          <td 
            align="center"
            padding="none"
            onClick={() => setSquaringValue(setSquare("CROSSED", true))}
            style={{ 
                    border: squaringValue.isCrossed ? "2px yellow solid" : "1px gray solid",
                    borderCollapse: "collapse",
                    cursor: "pointer",
                    width: squareSize,
                    height: squareSize,
                    fontSize: squareSize / 2
                  }}
          >
            X
          </td>
          <td 
            align="center"
            padding="none"
            onClick={() => setSquaringValue(setSquare("QUESTION_MARK", true))}
            style={{ 
                    border: squaringValue.isQuestionMark ? "2px yellow solid" : "1px gray solid",
                    borderCollapse: "collapse",
                    cursor: "pointer",
                    width: squareSize,
                    height: squareSize,
                    fontSize: squareSize / 2
                  }}
          >
            ?
          </td>
        </tr>
      </tbody>
    </table>
  );
}