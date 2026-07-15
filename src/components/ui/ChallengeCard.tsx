"use client";

import Link from "next/link";
import { formatMON, shortenAddress, formatTimeLeft, isZeroAddress } from "@/lib/utils";
import { STATUS_MAP, STATUS_COLOR } from "@/lib/contract";

interface Challenge {
  id: number;
  creator: string;
  opponent: string;
  acceptedBy: string;
  stake: bigint;
  claim: string;
  evidenceSource: string;
  acceptDeadline: bigint;
  resolveDeadline: bigint;
  status: number;
  winner: string;
  verdictReason: string;
}

export function ChallengeCard({ c }: { c: Challenge }) {
  const statusLabel = STATUS_MAP[c.status] ?? "Unknown";
  const statusClass = STATUS_COLOR[c.status] ?? "";
  const pot = c.stake * 2n;

  return (
    <Link href={`/challenge/${c.id}`}>
      <div className="group border border-zinc-800 rounded-sm bg-zinc-950 hover:border-emerald-500/40 hover:bg-zinc-900 transition-all cursor-pointer p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-sm border ${statusClass}`}>
            {statusLabel}
          </span>
          <span className="text-xs text-zinc-500">#{c.id}</span>
        </div>

        <p className="text-white text-sm font-medium leading-snug mb-4 line-clamp-2 group-hover:text-emerald-100 transition-colors">
          &ldquo;{c.claim}&rdquo;
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span>
              {isZeroAddress(c.opponent) ? (
                <span className="text-emerald-400">Open to all</span>
              ) : (
                <span>{shortenAddress(c.creator)} vs {shortenAddress(c.opponent)}</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold text-sm">
              {formatMON(pot)} MON
            </span>
          </div>
        </div>

        {c.status === 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-800 text-xs text-zinc-600">
            Accepts in{" "}
            <span className="text-zinc-400">{formatTimeLeft(c.acceptDeadline)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
