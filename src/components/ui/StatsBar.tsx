"use client";

import { useReadContracts } from "wagmi";
import { GREENMARKET_ABI, GREENMARKET_ADDRESS } from "@/lib/contract";
import { formatMON } from "@/lib/utils";

export function StatsBar() {
  const { data } = useReadContracts({
    contracts: [
      { address: GREENMARKET_ADDRESS, abi: GREENMARKET_ABI, functionName: "totalChallenges" },
      { address: GREENMARKET_ADDRESS, abi: GREENMARKET_ABI, functionName: "verdictsRecorded" },
      { address: GREENMARKET_ADDRESS, abi: GREENMARKET_ABI, functionName: "totalStaked" },
    ],
  });

  const totalChallenges = data?.[0]?.result as bigint | undefined;
  const verdictsRecorded = data?.[1]?.result as bigint | undefined;
  const totalStaked = data?.[2]?.result as bigint | undefined;

  const stats = [
    {
      label: "Total Challenges",
      value: totalChallenges !== undefined ? totalChallenges.toString() : "—",
    },
    {
      label: "Verdicts Recorded",
      value: verdictsRecorded !== undefined ? verdictsRecorded.toString() : "—",
    },
    {
      label: "MON Staked",
      value: totalStaked !== undefined ? formatMON(totalStaked, 2) : "—",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 rounded-sm overflow-hidden">
      {stats.map((s) => (
        <div key={s.label} className="bg-zinc-950 px-6 py-5 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{s.value}</div>
          <div className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
