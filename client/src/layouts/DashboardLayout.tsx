import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import Navbar   from "@shared/components/navigation/Navbar";
import Sidebar  from "@shared/components/navigation/Sidebar";

function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--bg-main)" }}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
