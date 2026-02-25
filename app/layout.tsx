import React from "react";
import type { Metadata, Viewport } from "next";
import { Space_Mono, Orbitron } from "next/font/google";

import "./globals.css";

const _spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});
const _orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "LabelWise // SYSTEM ONLINE",
  description:
    "Tactical nutrition intelligence. Scan product labels, calculate BMI, generate AI diet protocols.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${_spaceMono.variable} ${_orbitron.variable}`}>
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
