"use client";

import { useEffect, useRef } from "react";
import { useConnect, useAccount } from "wagmi";
import { X, Loader2, ExternalLink } from "lucide-react";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

// Wallet display metadata
const WALLET_META: Record<string, { name: string; icon: string; deeplink?: string }> = {
  metaMask: {
    name: "MetaMask",
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36.2 3L22.1 13.4l2.6-6.1L36.2 3z" fill="#E17726" stroke="#E17726" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.8 3l13.9 10.5-2.5-6.2L3.8 3z" fill="#E27625" stroke="#E27625" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M31.2 27.7l-3.7 5.7 7.9 2.2 2.3-7.7-6.5-.2zM2.3 27.9l2.2 7.7 7.9-2.2-3.7-5.7-6.4.2z" fill="#E27625" stroke="#E27625" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11.9 18.2l-2.2 3.3 7.8.4-.3-8.4-5.3 4.7zM28.1 18.2l-5.4-4.8-.2 8.5 7.8-.4-2.2-3.3z" fill="#E27625" stroke="#E27625" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.4 33.4l4.7-2.3-4.1-3.2-.6 5.5zM22.9 31.1l4.7 2.3-.6-5.5-4.1 3.2z" fill="#E27625" stroke="#E27625" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M27.6 33.4l-4.7-2.3.4 3.1-.1 2.3 4.4-3.1zM12.4 33.4l4.4 3.1v-2.3l.3-3.1-4.7 2.3z" fill="#D5BFB2" stroke="#D5BFB2" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16.9 25.9l-3.9-1.2 2.8-1.3 1.1 2.5zM23.1 25.9l1.1-2.5 2.8 1.3-3.9 1.2z" fill="#233447" stroke="#233447" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.4 33.4l.6-5.7-4.3.1 3.7 5.6zM27 27.7l.6 5.7 3.7-5.6-4.3-.1zM32.5 21.5l-7.8.4.7 4 1.1-2.5 2.8 1.3 3.2-3.2zM13 24.7l2.8-1.3 1.1 2.5.7-4-7.8-.4 3.2 3.2z" fill="#CC6228" stroke="#CC6228" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9.7 21.5l3.3 6.4-.1-3.2-3.2-3.2zM27.1 24.7l-.2 3.2 3.3-6.4-3.1 3.2zM17.6 21.9l-.7 4 .9 4.6.2-6.1-.4-2.5zM22.4 21.9l-.3 2.4.1 6.1.9-4.5-.7-4z" fill="#E27525" stroke="#E27525" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M23.1 25.9l-.9 4.5.7.5 4.1-3.2.2-3.2-4.1 1.4zM13 24.7l.1 3.2 4.1 3.2.7-.5-.9-4.5-4-1.4z" fill="#F5841F" stroke="#F5841F" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M23.2 36.5l.1-2.3-.3-.3h-5l-.3.3v2.3l-4.4-3.1 1.5 1.3 3.1 2.1h5.3l3.1-2.1 1.5-1.3-4.6 3.1z" fill="#C0AC9D" stroke="#C0AC9D" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22.9 31.1l-.7-.5h-4.4l-.7.5-.3 3.1.3-.3h5l.3.3-.5-3.1z" fill="#161616" stroke="#161616" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M36.8 13.8L38 7.9 36.2 3l-13.3 9.9 5.1 4.3 7.2 2.1 1.6-1.9-.7-.5 1.1-1-.8-.6 1.1-.9-.7-.5zM2 7.9l1.2 5.9-.8.5 1.1.9-.8.6 1.1 1-.7.5 1.6 1.9 7.2-2.1 5.1-4.3L3.8 3 2 7.9z" fill="#763E1A" stroke="#763E1A" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M35.2 19.3l-7.2-2.1 2.2 3.3-3.3 6.4 4.3-.1h6.4l-2.4-7.5zM12 17.2l-7.2 2.1-2.4 7.5h6.4l4.3.1-3.3-6.4 2.2-3.3zM22.4 21.9l.5-8.6 2.2-5.9h-10l2.1 5.9.6 8.6.2 2.5v6.1h4.4l.1-6.1-.1-2.5z" fill="#F5841F" stroke="#F5841F" stroke-width=".25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  phantom: {
    name: "Phantom",
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#AB9FF2"/>
      <path d="M8 20.5C8 14.1 13.1 9 19.5 9H26c5.5 0 9 4.5 9 9s-3.5 9-9 9h-1.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5H26c.8 0 1.5.7 1.5 1.5S26.8 33 26 33h-6.5C13.1 33 8 27.9 8 21.5v-1z" fill="white"/>
      <path d="M16 21a2 2 0 100-4 2 2 0 000 4zM24 21a2 2 0 100-4 2 2 0 000 4z" fill="#AB9FF2"/>
    </svg>`,
  },
  coinbaseWalletSDK: {
    name: "Coinbase Wallet",
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0052FF"/>
      <path d="M20 8C13.4 8 8 13.4 8 20s5.4 12 12 12 12-5.4 12-12S26.6 8 20 8zm0 18.5c-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5 6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z" fill="white"/>
      <path d="M17.5 18h5c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5h-5c-.3 0-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5z" fill="white"/>
    </svg>`,
  },
};

const BROWSER_WALLETS = [
  {
    id: "metaMask",
    name: "MetaMask",
    icon: "🦊",
    checkInstalled: () => typeof window !== "undefined" && !!(window as any).ethereum?.isMetaMask,
    installUrl: "https://metamask.io/download/",
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    checkInstalled: () => typeof window !== "undefined" && !!(window as any).phantom?.ethereum,
    installUrl: "https://phantom.app/",
  },
  {
    id: "coinbaseWalletSDK",
    name: "Coinbase Wallet",
    icon: "🔵",
    checkInstalled: () => typeof window !== "undefined" && !!(window as any).coinbaseWalletExtension,
    installUrl: "https://www.coinbase.com/wallet/downloads",
  },
  {
    id: "injected",
    name: "Browser Wallet",
    icon: "🌐",
    checkInstalled: () => typeof window !== "undefined" && !!(window as any).ethereum,
    installUrl: null,
  },
];

export function WalletModal({ open, onClose }: WalletModalProps) {
  const { connectors, connect, isPending, variables } = useConnect();
  const { isConnected } = useAccount();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConnected) onClose();
  }, [isConnected, onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full sm:w-[420px] rounded-t-2xl sm:rounded-xl overflow-hidden"
        style={{ backgroundColor: "#111113", border: "1px solid #27272a" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-white">Connect a Wallet</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Choose your wallet to continue</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallet list */}
        <div className="p-4 space-y-2">
          {connectors.map((connector) => {
            const meta = BROWSER_WALLETS.find(
              (w) => w.id === connector.id || connector.name.toLowerCase().includes(w.id.toLowerCase())
            );
            const isLoading = isPending && variables?.connector === connector;
            const isInstalled = meta?.checkInstalled?.() ?? true;

            return (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all disabled:opacity-60"
                style={{
                  backgroundColor: "#1a1a1c",
                  border: "1px solid #27272a",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#22c55e50";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1f2a1f";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#27272a";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1a1a1c";
                }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: "#27272a" }}
                >
                  {meta?.icon ?? "💼"}
                </div>

                {/* Name + status */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{connector.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {isLoading
                      ? "Connecting…"
                      : isInstalled
                      ? "Detected"
                      : "Not installed"}
                  </div>
                </div>

                {/* Right icon */}
                <div className="shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : isInstalled ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            New to crypto?{" "}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              Get MetaMask
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
