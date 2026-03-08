import type { Metadata } from "next";
import "./globals.css";
import "./wavy.css";

export const metadata: Metadata = {
  title: "Wavy Energy Company Limited — Fueling Growth with Clean Energy Solutions",
  description:
    "Wavy Energy Company Limited is an integrated downstream petroleum and energy engineering company — delivering petroleum supply, gas plant engineering, and solar power solutions nationwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
