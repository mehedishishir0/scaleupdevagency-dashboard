import { DashboardSidebar } from "@/components/Sidebar";
import React from "react";
import DashboardHeader from "@/components/DashboardHeader";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col bg-[#EDEEF1]">
        {/* Top Header */}
        <DashboardHeader />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default layout;
