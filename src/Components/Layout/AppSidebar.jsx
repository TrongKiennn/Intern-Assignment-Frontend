import { useSelector } from "react-redux";
import {
  Home,
  Inbox,
  Settings as SettingsIcon,
  ChevronDown,
  UserRound,
  Sun,
  Moon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "components/ui/sidebar";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useTheme } from "../context/ThemeProvider";

// Icon helper
function Icon({ as: As, className = "size-5 align-middle" }) {
  return <As className={className} />;
}

// Avatar luôn tròn
function AvatarInitials({ name, className = "", bg = "#222", text = "white" }) {
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";
  return (
    <div
      className={`shrink-0 flex-none aspect-square size-9 rounded-full overflow-hidden
                  flex items-center justify-center font-semibold select-none ${className}`}
      style={{
        background: bg,
        color: text,
      }}
    >
      {initials}
    </div>
  );
}

const mainItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Contacts", url: "/contacts", icon: Inbox },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

const favoriteItems = [
  { title: "Google", url: "/fav/google", icon: FcGoogle },
  { title: "Facebook", url: "/fav/facebook", icon: FaFacebook },
];

export function AppSidebar() {
  const user = useSelector((s) => s.auth.user);
  const { state } = useSidebar?.() || { state: "expanded" };
  const isCollapsed = state === "collapsed";

  // theme context
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const sidebarBg = isDark ? "black" : "white";
  const sidebarText = isDark ? "white" : "black";
  const borderColor = isDark ? "hsl(0 0% 100% / 0.15)" : "hsl(0 0% 0% / 0.15)";
  const accentColor = isDark ? "hsl(0 0% 100% / 0.1)" : "hsl(0 0% 0% / 0.05)";

  const btnGap = isCollapsed ? "gap-0" : "gap-3";
  const btnPx = isCollapsed ? "px-0" : "px-3";
  const aGap = isCollapsed ? "gap-0 justify-center" : "gap-3";

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
      style={{
        backgroundColor: sidebarBg,
        color: sidebarText,
        ["--sidebar"]: sidebarBg,
        ["--sidebar-foreground"]: sidebarText,
        ["--sidebar-border"]: borderColor,
        ["--sidebar-accent"]: accentColor,
        ["--sidebar-accent-foreground"]: sidebarText,
      }}
    >
      <SidebarContent className="flex h-full flex-col">
        {/* Header */}
        <div
          className={`flex items-center gap-3 px-4 py-4 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <AvatarInitials
            name={user?.name || "Guest"}
            bg={isDark ? "#222" : "#ddd"}
            text={sidebarText}
          />
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold leading-tight truncate">
                  {user?.name || "Guest"}
                </div>
                {user?.email && (
                  <div className="text-xs opacity-70 truncate">
                    {user.email}
                  </div>
                )}
              </div>
              {/* Toggle theme */}
              <button
                className="p-2 rounded-md hover:opacity-80"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{ color: sidebarText, background:sidebarBg }}
              >
                {isDark ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            </>
          )}
        </div>

        <div
          className="mx-3 mb-2 h-px"
          style={{ backgroundColor: "var(--sidebar-border)" }}
        />

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item, idx) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`h-10 flex items-center rounded-xl ${btnPx} ${btnGap} transition-colors`}
                    style={{
                      background:
                        idx === 0 ? "var(--sidebar-accent)" : "transparent",
                      color: sidebarText,
                    }}
                  >
                    <a
                      href={item.url}
                      className={`flex items-center w-full ${aGap}`}
                    >
                      <item.icon className="size-5 shrink-0 align-middle" />
                      <span
                        className={`${
                          isCollapsed ? "sr-only" : "text-base leading-none"
                        }`}
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Favorites */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-4 opacity-80 text-sm">
              Favorites
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {favoriteItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`h-10 flex items-center rounded-xl ${btnPx} ${btnGap} transition-colors`}
                    style={{ background: "transparent", color: sidebarText }}
                  >
                    <a
                      href={item.url}
                      className={`flex items-center w-full ${aGap}`}
                    >
                      <Icon as={item.icon} className="size-5 align-middle" />
                      <span
                        className={`${
                          isCollapsed ? "sr-only" : "text-base leading-none"
                        }`}
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom */}
        <div className="mt-auto">
          <div
            className="mx-3 mb-2 h-px"
            style={{ backgroundColor: "var(--sidebar-border)" }}
          />

          <div
            className={`flex items-center gap-3 px-4 py-4 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <AvatarInitials
              name={user?.name || "K"}
              bg={isDark ? "#222" : "#ddd"}
              text={sidebarText}
            />
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-tight truncate">
                    {user?.name || "Guest"}
                  </div>
                  <div className="text-xs opacity-70 truncate">
                    {user?.email || "—"}
                  </div>
                </div>
               
              </>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
