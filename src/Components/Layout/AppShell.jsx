import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const SIDEBAR_WIDTH = "16rem"; 
const SIDEBAR_WIDTH_COLLAPSED = "4rem"; 

function LayoutContent() {
  const { open } = useSidebar(); 

  return (
    <div className="flex h-screen w-screen bg-[var(--bg)] text-[var(--text-color)] overflow-hidden">
     
      <div
        className="transition-all duration-300 shrink-0"
        style={{ width: open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED }}
      >
        <AppSidebar />
      </div>

      
      <main className="flex-1 w-full min-w-0 h-full overflow-y-auto transition-all duration-300">
        <div className="p-2">
          <SidebarTrigger />
        </div>
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function AppShell() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
