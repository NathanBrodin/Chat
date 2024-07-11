"use client";

import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { ThemeWrapper } from "./theme-wrapper";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <JotaiProvider>
      <NextThemesProvider {...props}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </NextThemesProvider>
    </JotaiProvider>
  );
}
