import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Throttle · Hack Club",
  description:
    "Build anything that can fly. We fund it. A Hack Club You Ship, We Ship program for teens 13–18.",
  icons: { icon: "https://assets.hackclub.com/icon-rounded.svg" },
  openGraph: {
    title: "Throttle · Build anything that can fly. We fund it.",
    description: "A Hack Club You Ship, We Ship program for teens 13–18.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body className="font-sans">{children}</body>
    </html>
  );
}
