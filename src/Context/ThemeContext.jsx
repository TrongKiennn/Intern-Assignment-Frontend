
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


const DEFAULTS = {
  theme: "dark",
  accent: "#3b82f6",
  light: { text: "#0f172a", sidebar: "#ffffff" },
  dark: { text: "#ffffff", sidebar: "#000" },
};

const ThemeContext = createContext({
  theme: DEFAULTS.theme,
  setTheme: () => {},
  accentColor: DEFAULTS.accent,
  setAccentColor: () => {},

  sidebarBg: DEFAULTS.dark.sidebar,
  setSidebarBg: () => {},
  sidebarText: DEFAULTS.dark.text,
  setSidebarText: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || DEFAULTS.theme
  );
  const [accentColor, setAccentColor] = useState(
    localStorage.getItem("accentColor") || DEFAULTS.accent
  );


  const fallbackBg =
    theme === "light" ? DEFAULTS.light.sidebar : DEFAULTS.dark.sidebar;
  const fallbackText =
    theme === "light" ? DEFAULTS.light.text : DEFAULTS.dark.text;

  const [sidebarBg, setSidebarBg] = useState(
    localStorage.getItem("sidebarBg") || fallbackBg
  );
  const [sidebarText, setSidebarText] = useState(
    localStorage.getItem("sidebarText") || fallbackText
  );

 
  const textColor = useMemo(
    () => (theme === "light" ? DEFAULTS.light.text : DEFAULTS.dark.text),
    [theme]
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (!localStorage.getItem("sidebarBg")) setSidebarBg(fallbackBg);
    if (!localStorage.getItem("sidebarText")) setSidebarText(fallbackText);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("accentColor", accentColor);
    document.documentElement.style.setProperty("--accent-color", accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem("sidebarBg", String(sidebarBg));
    document.documentElement.style.setProperty("--sidebar", String(sidebarBg));
  }, [sidebarBg]);

  useEffect(() => {
    localStorage.setItem("sidebarText", String(sidebarText));
    document.documentElement.style.setProperty(
      "--sidebar-foreground",
      String(sidebarText)
    );
  }, [sidebarText]);

  useEffect(() => {
    document.documentElement.style.setProperty("--text-color", textColor);
  }, [textColor]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        sidebarBg,
        setSidebarBg,
        sidebarText,
        setSidebarText,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
