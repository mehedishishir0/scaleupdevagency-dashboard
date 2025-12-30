"use client";

import { User } from "lucide-react";
// import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      {/* Left */}
      <h1 className="text-lg font-semibold text-gray-800">
        Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button> */}

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
