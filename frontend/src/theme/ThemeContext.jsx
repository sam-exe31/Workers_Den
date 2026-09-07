import React, { createContext, useContext } from 'react';
import { PALETTE } from './palette';

// Workers Den ships a single, deliberate "work docket" light theme for v1.
// The context still exposes `mode` + `setMode`/`toggleTheme` so existing
// consumers don't crash, but there is intentionally no dark variant yet.
const LIGHT = { mode: 'light', theme: PALETTE, setMode: () => {}, toggleTheme: () => {} };

const ThemeContext = createContext(LIGHT);

export function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={LIGHT}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext) || LIGHT;
}
