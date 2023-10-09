import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BaseDBManipulations from "./BaseDBManipulations";
import MainGame from "./MainGame/mainGame";
import { useState } from 'react';

export function getColorFromIsCheckedAndTheme(isChecked, theme) {
  return theme.palette.mode === 'light' ? (isChecked ? "#121212" : "white") : (isChecked ? "white" : "#121212");
};

export default function App() {
  const [isLightTheme, setIsLightTheme] = useState(false);

  const getTheme = createTheme({
    palette: {
      mode: isLightTheme ? 'light' : 'dark',
    }
  });

  return (
    <ThemeProvider theme={getTheme}>
      <CssBaseline />
      <BaseDBManipulations isHidden />
      <MainGame />
    </ThemeProvider>
  );
}
