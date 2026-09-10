import type { Metadata } from "next";
import { Inter, Figtree } from "next/font/google";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// The client portal (/portal) uses Figtree; wired in as a CSS variable that
// portal.css picks up via --p-font.
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
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
      <body className={`${inter.className} ${figtree.variable} antialiased`}>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <ThemeProvider>
          <ToastContainer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
