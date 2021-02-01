import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { blueGrey, lightBlue } from "@material-ui/core/colors";
import "typeface-roboto";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: blueGrey[500],
      main: blueGrey[700],
      dark: blueGrey[900],
    },
    secondary: {
      light: lightBlue[300],
      main: lightBlue[500],
      dark: lightBlue[700],
    },
  },
  typography: {
    useNextVariants: true,
  },
});

function projectTheme(Component) {
  function projectTheme(props) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return projectTheme;
}

export default projectTheme;
