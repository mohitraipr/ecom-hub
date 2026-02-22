import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ecom-hub.in | E-commerce Automation Tools",
  description: "Powerful automation tools for e-commerce sellers - Out of Stock Management, Ajio Mail Replying, and more. Built for Indian e-commerce businesses.",
  keywords: ["e-commerce", "automation", "inventory management", "email automation", "India", "EasyEcom", "Ajio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts via CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Clash Display from Fontshare */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-outfit: 'Outfit', system-ui, sans-serif;
            --font-clash: 'Clash Display', system-ui, sans-serif;
          }
          body {
            font-family: var(--font-outfit);
          }
          .font-display {
            font-family: var(--font-clash);
          }
        `}</style>
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
