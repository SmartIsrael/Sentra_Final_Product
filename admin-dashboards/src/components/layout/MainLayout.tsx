
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-smartel-green-100 to-smartel-teal-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-none">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
        <div className="p-2 text-xs text-center text-smartel-gray-500">
          Smartel Sentra Bot •  • {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
