import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BaseDBManipulations from "./BaseDBManipulations";
import MainGame from "./MainGame/mainGame";
import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Menu from './Menu/menu';

export function getColorFromIsCheckedAndTheme(isChecked, theme) {
  return theme.palette.mode === 'light' ? (isChecked ? "#121212" : "white") : (isChecked ? "white" : "#121212");
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
    // TODO: Error page
    errorElement: <Menu />
  },
  {
    path: "/mainGame/:id",
    element: <MainGame />
  }
]);

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
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
