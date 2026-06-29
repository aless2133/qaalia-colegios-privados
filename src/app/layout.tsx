import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/core/providers/ThemeProvider";

const varelaRound = Varela_Round({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Qaalia",
  description: "Soluciones digitales para tu institución.",
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}