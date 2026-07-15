"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { GREENMARKET_ABI, GREENMARKET_ADDRESS } from "@/lib/contract";
import { ConnectButton } from "@/components/ui/ConnectButton";
import { Info, Loader2, CheckCircle2 } from "lucide-react";

export default function CreatePage() {
  const router = useRouter();
  const { isConnected } = useAccount();

  const [form, setForm] = useState({
    claim: "",
    evidenceSource: "",
    stake: "0.01",
    opponent: "",
    acceptWindow: "24",
    resolveWindow: "72",
  });

  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const handleSubmit = () => {
    if (!form.claim || !form.evidenceSource || !form.stake) return;
    const acceptSecs = BigInt(Math.floor(parseFloat(form.acceptWindow) * 3600));
    const resolveSecs = BigInt(Math.floor(parseFloat(form.resolveWindow) * 3600));
    const opponent = form.opponent.trim() || "0x0000000000000000000000000000000000000000";

    writeContract({
      address: GREENMARKET_ADDRESS,
      abi: GREENMARKET_ABI,
      functionName: "createChallenge",
      args: [opponent as `0x${string}`, form.claim, form.evidenceSource, acceptSecs, resolveSecs],
      value: parseEther(form.stake),
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-black mb-3">Challenge Created</h2>
        <p className="text-zinc-400 text-sm mb-8 max-w-xs">
          Your stake is locked. Share the link and wait for a rival to accept.
        </p>
        <div className="flex gap-3">
          <button onClick={() => router.push("/explorer")} className="px-5 py-2.5 text-sm font-semibold border border-zinc-700 rounded-sm hover:border-zinc-500 transition-colors">
            View Explorer
          </button>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 text-sm font-semibold bg-emerald-500 text-black rounded-sm hover:bg-emerald-400 transition-colors">
            New Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono mb-2">New Challenge</p>
        <h1 className="text-3xl font-black tracking-tight">Define your claim</h1>
        <p className="text-zinc-400 text-sm mt-2">Set the terms, lock your MON, and share the link. The AI settles it.</p>
      </div>

      {!isConnected ? (
        <div className="border border-zinc-800 rounded-sm p-10 text-center space-y-4">
          <p className="text-zinc-400 text-sm">Connect your wallet to create a challenge</p>
          <div className="flex justify-center">
            <ConnectButton fullWidth={false} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">The Claim <span className="text-emerald-400">*</span></label>
            <textarea rows={3} placeholder='e.g. BTC will be above $100k by end of July 2025' value={form.claim} onChange={(e) => setForm({ ...form, claim: e.target.value })} className="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none transition-colors" />
            <p className="text-xs text-zinc-600 mt-1.5 flex items-center gap-1"><Info className="w-3 h-3" />Be specific. Vague claims are harder for the AI to settle.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Evidence Source <span className="text-emerald-400">*</span></label>
            <input type="text" placeholder="e.g. CoinGecko BTC/USD price on Aug 1 00:00 UTC" value={form.evidenceSource} onChange={(e) => setForm({ ...form, evidenceSource: e.target.value })} className="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" />
            <p className="text-xs text-zinc-600 mt-1.5 flex items-center gap-1"><Info className="w-3 h-3" />The URL or data source the oracle will check to decide the verdict.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Your Stake (MON) <span className="text-emerald-400">*</span></label>
            <input type="number" step="0.01" min="0.01" placeholder="0.01" value={form.stake} onChange={(e) => setForm({ ...form, stake: e.target.value })} className="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono" />
            <p className="text-xs text-zinc-600 mt-1.5">Rival must match this. Pot = {parseFloat(form.stake || "0") * 2} MON</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Rival Address <span className="text-zinc-600 font-normal">(optional)</span></label>
            <input type="text" placeholder="0x... (leave empty for open challenge)" value={form.opponent} onChange={(e) => setForm({ ...form, opponent: e.target.value })} className="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Accept Window (hours)</label>
              <input type="number" min="1" value={form.acceptWindow} onChange={(e) => setForm({ ...form, acceptWindow: e.target.value })} className="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Resolve Window (hours)</label>
              <input type="number" min="1" value={form.resolveWindow} onChange={(e) => setForm({ ...form, resolveWindow: e.target.value })} className="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono" />
            </div>
          </div>

          <div className="border border-zinc-800 rounded-sm p-4 bg-zinc-900/50 text-xs text-zinc-400 space-y-1.5">
            <div className="flex justify-between"><span>Your stake locked</span><span className="text-white font-semibold font-mono">{form.stake || "0"} MON</span></div>
            <div className="flex justify-between"><span>Total pot</span><span className="text-emerald-400 font-semibold font-mono">{parseFloat(form.stake || "0") * 2} MON</span></div>
            <div className="flex justify-between"><span>Protocol fee</span><span className="font-mono">2%</span></div>
            <div className="flex justify-between"><span>Winner receives</span><span className="text-white font-semibold font-mono">{(parseFloat(form.stake || "0") * 2 * 0.98).toFixed(4)} MON</span></div>
          </div>

          {error && (
            <div className="border border-red-500/30 bg-red-500/10 rounded-sm px-4 py-3 text-sm text-red-400">
              {(error as any)?.shortMessage ?? error.message}
            </div>
          )}

          <button onClick={handleSubmit} disabled={isPending || isConfirming || !form.claim || !form.evidenceSource || !form.stake} className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-black font-bold rounded-sm hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isPending || isConfirming ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{isPending ? "Confirm in wallet…" : "Locking stake…"}</>
            ) : "Lock Stake & Create Challenge"}
          </button>
        </div>
      )}
    </div>
  );
}
