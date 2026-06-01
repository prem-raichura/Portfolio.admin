import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

import { ThemeProvider } from "@app/providers/ThemeProvider";

function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
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
