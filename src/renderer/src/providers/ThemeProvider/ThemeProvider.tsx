import { createContext, useContext, useMemo, useState } from 'react';

export type ThemeProviderProps = {
  children: React.ReactNode;
};

export type Theme = {
  theme: string | undefined; // the tags the user can select for a file (not already selected)
  setTheme: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const ThemeContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<string>();

  const value = useMemo<Theme>(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): Theme => {
  const Theme = useContext(ThemeContext);
  if (Theme === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return Theme;
};
