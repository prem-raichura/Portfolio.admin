import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

import { ThemeProvider } from "@app/providers/ThemeProvider";
import GlobalOfflineOverlay from "@shared/components/ui/GlobalOfflineOverlay";

function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
      <GlobalOfflineOverlay />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </ThemeProvider>
  );
}

export default AppProviders;
