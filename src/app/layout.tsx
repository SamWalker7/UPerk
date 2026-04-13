import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Universal Perk | Web, Mobile, Cloud & AI Development",
  description:
    "Universal Perk helps US businesses move faster, cut costs, and compete smarter with a single trusted partner for web, mobile, cloud, DevOps, and AI — without the overhead of building it all in-house.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <ToastContainer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
