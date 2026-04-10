import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit GenX — Claim Intelligence Platform",
  description: "14-Stage AI pipeline for insurance claim processing by Team Frame Flux",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
