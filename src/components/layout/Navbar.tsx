"use client";

import Link from "next/link";
import { ConnectButton } from "@/components/ui/ConnectButton";
import { Leaf } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-emerald-500 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Green<span className="text-emerald-400">Market</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/explorer" className="text-zinc-400 hover:text-white transition-colors">
            Explorer
          </Link>
          <Link href="/create" className="text-zinc-400 hover:text-white transition-colors">
            New Challenge
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ConnectButton />
          <Link
            href="/create"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-sm bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 transition-colors"
          >
            Challenge
          </Link>
        </div>
      </div>
    </header>
  );
}
