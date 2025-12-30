import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import AiPageBreadcrumb from "../components/ai/AiPageBreadcrumb";

const AlternativeLayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const location = useLocation();

  // Function to get page title based on current route
  const getPageTitle = (pathname: string): string => {
    const routeTitles: { [key: string]: string } = {
      "/text-generator": "Text Generator",
      "/image-generator": "Image Generator",
      "/code-generator": "Code Generator",
      "/video-generator": "Video Generator",
      // Add more routes as needed
    };

    return routeTitles[pathname] || "Dashboard";
  };

  const currentPageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "xl:ml-[290px]" : "xl:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        {/* Alternative layout with different container styles */}
        <div>
          <AiPageBreadcrumb pageTitle={currentPageTitle} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AlternativeLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AlternativeLayoutContent />
    </SidebarProvider>
  );
};

export default AlternativeLayout;
