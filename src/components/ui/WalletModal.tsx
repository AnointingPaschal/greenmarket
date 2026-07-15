"use client";

import { useEffect, useRef, useState } from "react";
import { useConnect, useAccount } from "wagmi";
import { X, Loader2, ExternalLink, AlertCircle } from "lucide-react";

const WALLET_INFO: Record<string, {
  name: string;
  logo: string;
  installUrl: string;
  detectKey?: string;
}> = {
  metaMask: {
    name: "MetaMask",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    installUrl: "https://metamask.io/download/",
    detectKey: "isMetaMask",
  },
  "io.metamask": {
    name: "MetaMask",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    installUrl: "https://metamask.io/download/",
    detectKey: "isMetaMask",
  },
  phantom: {
    name: "Phantom",
    logo: "https://play-lh.googleusercontent.com/5yqNiNFIaP7pjAfKlaqtXHMhE9Y_EjK5u6CJI0eEkZqbKMw5WFjsJF7HY7hujB1qJg",
    installUrl: "https://phantom.app/",
    detectKey: "isPhantom",
  },
  coinbaseWalletSDK: {
    name: "Coinbase Wallet",
    logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpSmdiTE2nQ4qFKhf6s6QM8dUFQoKbp_LDM",
    installUrl: "https://www.coinbase.com/wallet/downloads",
    detectKey: "isCoinbaseWallet",
  },
  rabby: {
    name: "Rabby Wallet",
    logo: "https://play-lh.googleusercontent.com/S9_B_rVgVTyMJATqb0wvOUGOK07yUFwLfAqT-JOjnCCmYFf60R1PZPM4gNSBMKxNUB8",
    installUrl: "https://rabby.io/",
    detectKey: "isRabby",
  },
  okx: {
    name: "OKX Wallet",
    logo: "https://play-lh.googleusercontent.com/JvCiQ50LFGxhJplbJMk1vqh0lJE04YKZMbq-T9Rg-dXi3yOyXNTKe_r1xLBNGhB3C0",
    installUrl: "https://www.okx.com/web3",
    detectKey: "isOKExWallet",
  },
  trust: {
    name: "Trust Wallet",
    logo: "https://play-lh.googleusercontent.com/RUXiXUv4tK_CIfzIYMOlGqWMJg8A3PirHMBjCVkVJrKRVNYFzjEq6PnkDr3-Z9_VoQ",
    installUrl: "https://trustwallet.com/",
    detectKey: "isTrust",
  },
  injected: {
    name: "Browser Wallet",
    logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa/svg/color/generic.svg",
    installUrl: "https://metamask.io/download/",
  },
};

function isWalletInstalled(detectKey?: string): boolean {
  if (typeof window === "undefined") return false;
  if (!detectKey) return !!(window as any).ethereum;
  const eth = (window as any).ethereum;
  if (!eth) return false;
  if (eth[detectKey]) return true;
  if (eth.providers) return eth.providers.some((p: any) => p[detectKey]);
  return false;
}

function WalletLogo({ src, name }: { src: string; name: string }) {
  const [errored, setErrored] = useState(false);
  return errored ? (
    <div className="w-full h-full rounded-xl bg-zinc-700 flex items-center justify-center text-white text-sm font-bold">
      {name[0]}
    </div>
  ) : (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-contain rounded-xl"
      onError={() => setErrored(true)}
    />
  );
}

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

export function WalletModal({ open, onClose }: WalletModalProps) {
  const { connectors, connect, isPending, variables, error } = useConnect();
  const { isConnected } = useAccount();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) { onClose(); setConnectingId(null); }
  }, [isConnected, onClose]);

  useEffect(() => {
    if (!open) { setConnectingId(null); return; }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!isPending) setConnectingId(null);
  }, [isPending]);

  if (!open) return null;

  const handleConnect = (connector: any) => {
    setConnectingId(connector.uid);
    connect({ connector });
  };

  // Deduplicate connectors by name
  const seen = new Set<string>();
  const uniqueConnectors = connectors.filter((c) => {
    const key = c.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full sm:w-[400px] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#0f0f11", border: "1px solid #222224", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid #1e1e20" }}>
          <div>
            <p className="text-base font-bold text-white">Connect Wallet</p>
            <p className="text-xs mt-0.5" style={{ color: "#71717a" }}>
              Choose your wallet to get started
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "#71717a" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1e1e20")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400" style={{ backgroundColor: "#2a1015", border: "1px solid #3f1020" }}>
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {(error as any)?.shortMessage ?? error.message}
          </div>
        )}

        {/* Wallet list */}
        <div className="overflow-y-auto p-3 space-y-1.5">
          {uniqueConnectors.map((connector) => {
            const id = connector.id as string;
            const meta = WALLET_INFO[id] ?? WALLET_INFO["injected"];
            const installed = isWalletInstalled(meta.detectKey);
            const isLoading = connectingId === connector.uid && isPending;

            return (
              <button
                key={connector.uid}
                onClick={() => {
                  if (!installed && meta.installUrl && id !== "injected") {
                    window.open(meta.installUrl, "_blank");
                    return;
                  }
                  handleConnect(connector);
                }}
                disabled={isPending}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all group disabled:opacity-60"
                style={{ backgroundColor: "#161618", border: "1px solid #1e1e20" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#22c55e40";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#161f16";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1e1e20";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#161618";
                }}
              >
                {/* Logo */}
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 p-0.5" style={{ backgroundColor: "#222224" }}>
                  <WalletLogo src={meta.logo} name={meta.name} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{connector.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: installed ? "#22c55e" : "#71717a" }}>
                    {isLoading ? "Connecting…" : installed ? "Detected" : "Not installed — click to install"}
                  </p>
                </div>

                {/* Right */}
                <div className="shrink-0 ml-1">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : installed ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  ) : (
                    <ExternalLink className="w-4 h-4" style={{ color: "#52525b" }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 text-center shrink-0" style={{ borderTop: "1px solid #1e1e20" }}>
          <p className="text-xs" style={{ color: "#52525b" }}>
            New to wallets?{" "}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              Get MetaMask →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
