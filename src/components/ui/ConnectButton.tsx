"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useWalletModal } from "./WalletModalContext";
import { shortenAddress } from "@/lib/utils";
import { ChevronDown, LogOut, Wallet } from "lucide-react";
import { useState } from "react";

export function ConnectButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWalletModal();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
          style={{ backgroundColor: "#161618", border: "1px solid #27272a" }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-mono text-xs">{shortenAddress(address)}</span>
          <ChevronDown className="w-3 h-3" style={{ color: "#71717a" }} />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div
              className="absolute right-0 top-full mt-2 w-44 rounded-xl py-1 z-50 shadow-xl"
              style={{ backgroundColor: "#0f0f11", border: "1px solid #222224" }}
            >
              <div className="px-4 py-2 border-b" style={{ borderColor: "#1e1e20" }}>
                <p className="text-xs font-mono text-zinc-400">{shortenAddress(address)}</p>
              </div>
              <button
                onClick={() => { disconnect(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-zinc-800/50"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={open}
      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-black bg-emerald-500 hover:bg-emerald-400 transition-colors ${fullWidth ? "w-full px-4" : "px-4"}`}
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </button>
  );
}
