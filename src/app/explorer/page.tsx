"use client";

import { useState } from "react";
import Link from "next/link";
import { useReadContracts } from "wagmi";
import { GREENMARKET_ABI, GREENMARKET_ADDRESS, STATUS_MAP } from "@/lib/contract";
import { ChallengeCard } from "@/components/ui/ChallengeCard";
import { Plus, Loader2 } from "lucide-react";

export default function ExplorerPage() {
  const [filter, setFilter] = useState<number | "all">("all");

  // Read total count first
  const { data: countData } = useReadContracts({
    contracts: [
      { address: GREENMARKET_ADDRESS, abi: GREENMARKET_ABI, functionName: "challengeCount" },
    ],
  });

  const count = Number(countData?.[0]?.result ?? 0n);

  // Build contracts array for all challenges
  const challengeContracts = Array.from({ length: count }, (_, i) => ({
    address: GREENMARKET_ADDRESS,
    abi: GREENMARKET_ABI,
    functionName: "getChallenge" as const,
    args: [BigInt(i)],
  }));

  const { data: challengeData, isLoading } = useReadContracts({
    contracts: challengeContracts,
  });

  const challenges = (challengeData ?? [])
    .map((d, i) => {
      if (!d.result) return null;
      const c = d.result as any;
      return {
        id: i,
        creator: c.creator,
        opponent: c.opponent,
        acceptedBy: c.acceptedBy,
        stake: c.stake,
        claim: c.claim,
        evidenceSource: c.evidenceSource,
        acceptDeadline: c.acceptDeadline,
        resolveDeadline: c.resolveDeadline,
        status: c.status,
        winner: c.winner,
        verdictReason: c.verdictReason,
      };
    })
    .filter(Boolean)
    .reverse() as any[];

  const filtered = filter === "all" ? challenges : challenges.filter((c) => c.status === filter);

  const tabs: { label: string; value: number | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Open", value: 0 },
    { label: "Active", value: 1 },
    { label: "Resolved", value: 2 },
  ];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Challenge Ledger</h1>
          <p className="text-zinc-500 text-sm mt-1">{count} total challenges on-chain</p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 text-black text-sm font-bold rounded-sm hover:bg-emerald-400 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          New
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-8 border-b border-zinc-800 pb-0">
        {tabs.map((t) => (
          <button
            key={String(t.value)}
            onClick={() => setFilter(t.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              filter === t.value
                ? "border-emerald-400 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-zinc-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading challenges…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-zinc-600 text-sm mb-4">
            {count === 0 ? "No challenges yet. Be the first." : "No challenges match this filter."}
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-500 text-black rounded-sm hover:bg-emerald-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create a Challenge
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <ChallengeCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
