import { Switch } from "@/components/ui/switch";
import { useDarkMode } from "@/hooks/useDarkMode";
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

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showLabel && (
        <div className="flex items-center gap-2">
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
      )}

      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleDarkMode}
        className="data-[state=checked]:bg-deep-blue"
      />

      {!showLabel && (
        <span className="text-xl">{isDarkMode ? "🌙" : "☀️"}</span>
      )}
    </div>
  );
};
