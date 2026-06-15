import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Made with App Studio",
  description:
    "Global Weavers — buy and sell cotton, silk, linen, wool and heritage fabrics worldwide on Pi Network. Trade by meter or roll, pay with Pi.",
  keywords: ["fabric", "textile", "marketplace", "Pi Network", "cotton", "silk", "linen", "wool", "heritage"],
    generator: 'v0.app'
};

export const viewport: Viewport = {
  themeColor: "#1a1040",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js" async></script>
      </head>
      <body className="font-sans">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
