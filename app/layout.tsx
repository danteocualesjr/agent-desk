import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Desk",
  description: "A demo app showing how an AI agent works",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
