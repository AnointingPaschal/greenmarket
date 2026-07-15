"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { shortenAddress } from "@/lib/utils";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 px-3 py-1.5 border border-zinc-700 rounded-sm text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors font-mono"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        {shortenAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
      className="px-3 py-1.5 border border-zinc-700 rounded-sm text-sm text-zinc-300 hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-50 transition-colors"
    >
      {isPending ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
