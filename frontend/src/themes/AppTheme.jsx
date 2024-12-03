import { createTheme, ThemeProvider } from "@mui/material/styles";

const AppTheme = ({ children }) => {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
    applyStyles: (mode, styles) => (theme.palette.mode === mode ? styles : {}),
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppTheme;
