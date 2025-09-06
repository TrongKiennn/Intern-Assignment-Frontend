// components/AppSidebar.js
import { useSelector } from "react-redux";
import {
  Home,
  Inbox,
  Settings as SettingsIcon,
  Plus,
  MessageSquareMore,
  ChevronDown,
  UserRound,
} from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";
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


// Icon helper
function Icon({ as: As, className = "size-5 align-middle" }) {
  return <As className={className} />;
}

// Avatar luôn tròn, không co méo
function AvatarInitials({ name, className = "" }) {
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
        background: "var(--sidebar-accent)",
        color: "var(--sidebar-accent-foreground)",
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
  const { sidebarBg, sidebarText } = useTheme();
  const { state } = useSidebar?.() || { state: "expanded" };
  const isCollapsed = state === "collapsed";


  

  // lớp tiện dụng để không lặp code
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
        ["--sidebar-border"]: "hsl(0 0% 100% / 0.08)",
        ["--sidebar-accent"]: "hsl(0 0% 100% / 0.06)",
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
          <AvatarInitials name={user?.name || "Guest"} />
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
              <button
                className="p-2 rounded-md hover:opacity-90"
                aria-label="Workspace menu"
                style={{ color: "currentColor" }}
              >
                <ChevronDown className="size-4" />
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
                    className={`h-10 flex items-center rounded-xl ${btnPx} ${btnGap} transition-colors
                                ${isCollapsed ? "justify-center" : ""}`}
                    style={{
                      background:
                        idx === 0 ? "var(--sidebar-accent)" : "transparent",
                      color: "currentColor",
                    }}
                  >
                    <a
                      href={item.url}
                      className={`flex items-center w-full ${aGap}`}
                    >
                      <item.icon
                        className={`size-5 shrink-0 align-middle ${
                          isCollapsed ? "mx-auto" : ""
                        }`}
                      />
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
                    className={`h-10 flex items-center rounded-xl ${btnPx} ${btnGap} transition-colors hover:opacity-90
                                ${isCollapsed ? "justify-center" : ""}`}
                    style={{ background: "transparent", color: "currentColor" }}
                  >
                    <a
                      href={item.url}
                      className={`flex items-center w-full ${aGap}`}
                    >
                      <Icon
                        as={item.icon}
                        className={`${
                          isCollapsed ? "mx-auto" : ""
                        } size-5 align-middle`}
                      />
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

          {/* User row */}
          <div
            className={`flex items-center gap-3 px-4 py-4 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <AvatarInitials name={user?.name || "K"} />
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
                <button
                  className="p-2 rounded-md hover:opacity-90"
                  aria-label="Account"
                  style={{ color: "currentColor" }}
                >
                  <UserRound className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
