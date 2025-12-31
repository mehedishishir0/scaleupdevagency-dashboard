"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CircleParking,
  ClipboardList,
  FolderOpen,
  LayoutPanelLeft,
  LogOut,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutPanelLeft,
  },
  {
    name: "All Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: ClipboardList,
  },
  {
    name: "Profiles",
    href: "/dashboard/profile",
    icon: CircleParking,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <aside className="flex flex-col w-[320px] bg-white border-r border-gray-200 h-screen">
      {/* Logo / Title */}
      <div className="px-6 py-6 mx-auto">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={900}
          height={900}
          className="h-14 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-[#FACC15]/60 text-black"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-black" : "text-gray-400"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>


      {/* Logout */}
      <div className="border-t p-4">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-500">
            Are you sure you want to log out? You will need to log in again to
            access your dashboard.
          </p>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
