import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStorage, setStorage } from '../utils/storage';

const ThemeContext = createContext(null);
const THEME_KEY = 'reveste_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => getStorage(THEME_KEY, 'light'));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setStorage(THEME_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme: () => setTheme((old) => (old === 'dark' ? 'light' : 'dark')),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa estar dentro de ThemeProvider');
  }

  return context;
}
