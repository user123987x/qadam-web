import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DarkModeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const DarkModeToggle = ({
  className = "",
  showLabel = true,
  size = "md",
}: DarkModeToggleProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Debug: Check if dark mode is working
  console.log("DarkModeToggle rendered, isDarkMode:", isDarkMode);
  console.log(
    "Document has dark class:",
    document.documentElement.classList.contains("dark"),
  );

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-base";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  if (showLabel) {
    return (
      <div
        className={cn("flex items-center justify-between w-full", className)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isDarkMode ? "🌙" : "☀️"}</span>
          <span
            className={cn(
              "font-medium text-neutral-700 dark:text-neutral-300",
              getSizeClasses(),
            )}
          >
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </span>
        </div>

        <button
          onClick={toggleDarkMode}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-soft-green focus:ring-offset-2",
            isDarkMode ? "bg-soft-green" : "bg-neutral-200 dark:bg-neutral-600",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
              isDarkMode ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleDarkMode}
      className={cn("p-2", className)}
    >
      <span className="text-xl">{isDarkMode ? "🌙" : "☀️"}</span>
    </Button>
  );
};
