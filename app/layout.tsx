import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vehicle-focus.com"),
  title: {
    default: "Vehicle Focus | Automotive Concierge, Channel Islands",
    template: "%s | Vehicle Focus",
  },
  description:
    "Specialist care, movement and record-keeping for supercars, hypercars and private collections across the Channel Islands, UK and Europe.",
  openGraph: {
    title: "Vehicle Focus | Automotive Concierge",
    description:
      "Your cars, cared for, ready and recorded. Automotive concierge for supercar and hypercar owners in the Channel Islands, UK and Europe.",
    siteName: "Vehicle Focus",
    locale: "en_GB",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
