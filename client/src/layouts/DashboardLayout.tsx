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
    // h-screen + overflow-hidden freezes the outer page: the window itself
    // never scrolls. Only the <main> below is allowed to scroll.
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-main)" }}
    >
      {/* Sidebar — fixed full-height column */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Right column: navbar pinned on top, scrollable main below */}
      <div className="flex h-screen flex-1 flex-col min-w-0 overflow-hidden">
        {/* Navbar (does not scroll out of view) */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page content — only this scrolls. min-h-0 is required so the
            flex child can actually shrink and enable inner overflow. */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
