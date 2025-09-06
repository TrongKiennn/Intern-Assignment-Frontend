import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeProvider";

export default function ContactItem({ name, count, url }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = {
    hoverBg: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    avatarBg: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
    text: isDark ? "#fff" : "#111",
    textMuted: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
  };

  const initials = name
    ? name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      onClick={() => url && navigate(url)}
      className="flex items-center justify-between rounded-lg px-2 py-1 cursor-pointer transition-colors group"
      style={{ color: colors.text }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold"
          style={{ backgroundColor: colors.avatarBg }}
        >
          {initials}
        </div>
        <span className="text-sm font-medium">{name}</span>
      </div>

      {/* Icon hiện khi hover */}
      <ArrowRight
        className="h-4 w-4 opacity-0 group-hover:opacity-70 transition-opacity"
        style={{ color: colors.text }}
      />

      {/* Count ẩn khi hover */}
      <span
        className="text-sm group-hover:hidden"
        style={{ color: colors.textMuted }}
      >
        {count}
      </span>
    </div>
  );
}
