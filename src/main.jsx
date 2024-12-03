import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = extendTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#69548d",
        },
        secondary: {
          main: "#3f51b5",
        },
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#dcdde1",
            borderRadius: "5px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#69548d",
          },
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </StrictMode>
);
