import React, { createContext, useContext, useState } from 'react';

const DARK_EDITORIAL_THEME = {
  bg: '#0B0B0D',
  surface: '#16161A',
  surfaceCard: '#16161A',
  text: '#F7F6F2',
  muted: '#A0A0AA',
  border: '#27272A',
  borderHover: '#3E3E44',
  accent: '#F4A340',
  accentHover: '#E09230',
  accentSoft: 'rgba(244, 163, 64, 0.1)',
  accentText: '#0B0B0D',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

const ThemeContext = createContext({
  mode: 'dark',
  theme: DARK_EDITORIAL_THEME,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [mode] = useState('dark');
  const theme = DARK_EDITORIAL_THEME;

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { mode: 'dark', theme: DARK_EDITORIAL_THEME, toggleTheme: () => {} };
  }
  return context;
}
