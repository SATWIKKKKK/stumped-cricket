import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "STUMPED AI — Cricket Intelligence System",
  description:
    "AI-powered cricket analytics, live match intelligence, player profiling, and fantasy optimization platform.",
  keywords: ["cricket", "AI", "analytics", "fantasy cricket", "IPL", "live scores"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700;900&family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0a] text-[#e2e2e2] antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
