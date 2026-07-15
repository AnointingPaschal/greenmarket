import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenMarket — Stake Your Claim on Monad",
  description: "AI-settled 1v1 prediction challenges on Monad. No referees. No arguments. The AI decides.",
  openGraph: {
    title: "GreenMarket",
    description: "Stake MON on your claims. AI settles disputes on-chain.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white antialiased">
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
