import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined,
);

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedMode !== null) {
      const darkMode = savedMode === "true";
      setIsDarkMode(darkMode);
      updateDocumentClass(darkMode);
    } else if (prefersDark) {
      setIsDarkMode(true);
      updateDocumentClass(true);
    }
  }, []);

  const updateDocumentClass = (dark: boolean) => {
    try {
      if (dark) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
      }
      console.log("Dark mode updated:", dark); // Debug log
    } catch (error) {
      console.error("Error updating dark mode classes:", error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    console.log("Toggling dark mode from", isDarkMode, "to", newMode); // Debug log
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    updateDocumentClass(newMode);
  };

  const setDarkMode = (dark: boolean) => {
    console.log("Setting dark mode to:", dark); // Debug log
    setIsDarkMode(dark);
    localStorage.setItem("darkMode", dark.toString());
    updateDocumentClass(dark);
  };

  return (
    <DarkModeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
      }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    // Return a fallback instead of throwing an error
    console.warn(
      "useDarkMode must be used within a DarkModeProvider. Using fallback.",
    );
    return {
      isDarkMode: false,
      toggleDarkMode: () => {},
      setDarkMode: () => {},
    };
  }
  return context;
};
