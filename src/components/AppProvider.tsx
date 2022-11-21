import React from "react";
import { ThemeProvider, theme } from "@liftedinit/ui";

interface ProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: ProviderProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
