import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME } from './tokens'; // Adjust path if needed

// Create the Context
const ThemeContext = createContext();

// Create a Provider Component
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('wd_theme') || 'light');

  // Automatically save to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('wd_theme', mode);
  }, [mode]);

  // Get the current theme colors based on the mode
  const theme = THEME[mode] || THEME.light;

  return (
    <ThemeContext.Provider value={{ mode, setMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
