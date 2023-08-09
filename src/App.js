import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BaseDBManipulations from "./BaseDBManipulations";
import MainGame from "./MainGame/mainGame";
import { useState } from 'react';

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
      <BaseDBManipulations />
      <MainGame />
    </ThemeProvider>
  );
}
