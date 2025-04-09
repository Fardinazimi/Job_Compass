import React, { createContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Define the ThemeContext interface
interface ThemeContextProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

// Create the ThemeContext
export const ThemeContext = createContext<ThemeContextProps>({
  mode: "light",
  toggleMode: () => {},
});

// ThemeContextProvider to wrap the app
export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          background: {
            default: mode === "light" ? "#ffffff" : "#121212",
          },
          text: {
            primary: mode === "light" ? "#333333" : "#ffffff", // Default text color
            secondary: mode === "light" ? "#555555" : "#bbbbbb",
          },
        },
        typography: {
          fontFamily: "'Roboto', sans-serif",
          h1: { fontSize: "2.5rem", fontWeight: 700, color: "#4c4f8c" },
          h2: { fontSize: "2rem", fontWeight: 600, color: "#4c4f8c" },
          h3: { fontSize: "1.75rem", fontWeight: 600, color: "#4c4f8c" },
          body1: { fontSize: "16px", lineHeight: 1.6, color: "#333" },
          button: { fontSize: "16px", textTransform: "none" },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& label": {
                  color: mode === "light" ? "#4c4f8c" : "#b87dd8",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: mode === "light" ? "#4c4f8c" : "#b87dd8",
                  },
                  "&:hover fieldset": {
                    borderColor: mode === "light" ? "#b87dd8" : "#7C3AED",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: mode === "light" ? "#7C3AED" : "#b87dd8",
                  },
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
