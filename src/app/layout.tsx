import type { Metadata, Viewport } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/core/providers/ThemeProvider";
import Providers from "./providers";

const varelaRound = Varela_Round({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Qaalia",
  description: "Soluciones digitales para tu institución.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full"
    >
      <body className={`min-h-full flex flex-col antialiased tracking-tight ${varelaRound.className}`}>
        <Providers>
        <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}