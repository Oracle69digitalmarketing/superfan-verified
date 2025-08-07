import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hackathon Superfan App",
  description: "A fan verification app powered by XION and Reclaim Protocol.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AbstraxionProvider>{children}</AbstraxionProvider>
      </body>
    </html>
  );
}
