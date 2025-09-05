import React, { createContext, useContext, useState, useEffect } from "react";

const textColorFor = (theme) => (theme === "light" ? "#111827" : "#ffffff");

const DEFAULTS = {
  theme: "dark",
  accent: "#3b82f6",
};

const ThemeContext = createContext({
  theme: DEFAULTS.theme,
  setTheme: () => {},
  textColor: textColorFor(DEFAULTS.theme),
  accentColor: DEFAULTS.accent,
  setAccentColor: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || DEFAULTS.theme
  );

  const [accentColor, setAccentColor] = useState(
    localStorage.getItem("accentColor") || DEFAULTS.accent
  );

  const textColor = textColorFor(theme); 


  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--text-color", textColor);
  }, [theme, textColor]);

  useEffect(() => {
    localStorage.setItem("accentColor", accentColor);
    document.documentElement.style.setProperty("--accent-color", accentColor);
  }, [accentColor]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        textColor,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
