"use client";

import { use, useState } from "react";
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@/components/ui/ConnectButton";
import { parseEther } from "viem";
import { GREENMARKET_ABI, GREENMARKET_ADDRESS, STATUS_MAP, STATUS_COLOR } from "@/lib/contract";
import { formatMON, shortenAddress, formatDate, formatTimeLeft, isZeroAddress } from "@/lib/utils";
import { Loader2, ExternalLink, Copy, CheckCircle2, Clock, Gavel } from "lucide-react";

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleError, setOracleError] = useState<string | null>(null);
  const [pendingVerdict, setPendingVerdict] = useState<{ winner: string; reason: string } | null>(null);

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: GREENMARKET_ADDRESS,
        abi: GREENMARKET_ABI,
        functionName: "getChallenge",
        args: [BigInt(id)],
      },
    ],
  });

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  if (isSuccess) refetch();

  const raw = data?.[0]?.result as any;
  const c = raw
    ? {
        creator: raw.creator as string,
        opponent: raw.opponent as string,
        acceptedBy: raw.acceptedBy as string,
        stake: raw.stake as bigint,
        claim: raw.claim as string,
        evidenceSource: raw.evidenceSource as string,
        acceptDeadline: raw.acceptDeadline as bigint,
        resolveDeadline: raw.resolveDeadline as bigint,
        status: raw.status as number,
        winner: raw.winner as string,
        verdictReason: raw.verdictReason as string,
      }
    : null;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = () => {
    if (!c) return;
    reset();
    writeContract({
      address: GREENMARKET_ADDRESS,
      abi: GREENMARKET_ABI,
      functionName: "acceptChallenge",
      args: [BigInt(id)],
      value: c.stake,
    });
  };

  const handleCancel = () => {
    reset();
    writeContract({
      address: GREENMARKET_ADDRESS,
      abi: GREENMARKET_ABI,
      functionName: "cancelChallenge",
      args: [BigInt(id)],
    });
  };

  const handleClaimExpired = () => {
    reset();
    writeContract({
      address: GREENMARKET_ADDRESS,
      abi: GREENMARKET_ABI,
      functionName: "claimExpired",
      args: [BigInt(id)],
    });
  };

  // Step 1: Ask AI for verdict
  const handleGetVerdict = async () => {
    setOracleLoading(true);
    setOracleError(null);
    setPendingVerdict(null);
    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: Number(id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Oracle failed");
      setPendingVerdict({ winner: data.winner, reason: data.reason });
    } catch (err: any) {
      setOracleError(err.message);
    } finally {
      setOracleLoading(false);
    }
  };

  // Step 2: Submit verdict on-chain with connected wallet (oracle wallet)
  const handleSubmitVerdict = () => {
    if (!pendingVerdict) return;
    reset();
    writeContract({
      address: GREENMARKET_ADDRESS,
      abi: GREENMARKET_ABI,
      functionName: "resolveChallenge",
      args: [BigInt(id), pendingVerdict.winner as `0x${string}`, pendingVerdict.reason],
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading challenge…
      </div>
    );
  }

  if (!c) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Challenge #{id} not found.
      </div>
    );
  }

  const pot = c.stake * 2n;
  const payout = (pot * 98n) / 100n;
  const statusLabel = STATUS_MAP[c.status] ?? "Unknown";
  const statusClass = STATUS_COLOR[c.status] ?? "";
  const isCreator = address?.toLowerCase() === c.creator.toLowerCase();
  const isOracle = isConnected; // Oracle = connected wallet (must be set as oracle on contract)
  const canAccept =
    c.status === 0 &&
    !isCreator &&
    (isZeroAddress(c.opponent) || address?.toLowerCase() === c.opponent.toLowerCase());
  const now = Math.floor(Date.now() / 1000);
  const isExpiredUnaccepted = c.status === 0 && now > Number(c.acceptDeadline);
  const canResolve = c.status === 1 && now >= Number(c.resolveDeadline);

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-zinc-600 font-mono text-sm">#{id}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-sm border ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Share"}
        </button>
      </div>

      {/* Claim */}
      <div className="border border-zinc-800 rounded-sm p-6 mb-6 bg-zinc-900/30">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono mb-3">The Claim</p>
        <p className="text-xl sm:text-2xl font-bold leading-snug text-white">&ldquo;{c.claim}&rdquo;</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800 rounded-sm overflow-hidden mb-6">
        {[
          { label: "Stake (each)", value: `${formatMON(c.stake)} MON` },
          { label: "Total Pot", value: `${formatMON(pot)} MON` },
          { label: "Accept Deadline", value: formatTimeLeft(c.acceptDeadline) },
          { label: "Resolve At", value: formatDate(c.resolveDeadline) },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-950 px-4 py-4">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-sm font-semibold text-white font-mono">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Parties */}
      <div className="border border-zinc-800 rounded-sm p-5 mb-6 space-y-3">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono mb-1">Participants</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">Creator</span>
          <span className="font-mono text-white">{shortenAddress(c.creator)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">Rival</span>
          <span className="font-mono text-white">
            {!isZeroAddress(c.acceptedBy)
              ? shortenAddress(c.acceptedBy)
              : !isZeroAddress(c.opponent)
              ? `${shortenAddress(c.opponent)} (invited)`
              : <span className="text-emerald-400">Open to all</span>}
          </span>
        </div>
        {c.status === 2 && !isZeroAddress(c.winner) && (
          <div className="flex justify-between items-center text-sm border-t border-zinc-800 pt-3">
            <span className="text-zinc-400">Winner</span>
            <span className="font-mono text-emerald-400 font-bold">{shortenAddress(c.winner)}</span>
          </div>
        )}
      </div>

      {/* Evidence source */}
      <div className="border border-zinc-800 rounded-sm p-5 mb-6">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono mb-2">Evidence Source</p>
        <p className="text-sm text-zinc-300 break-all">{c.evidenceSource}</p>
      </div>

      {/* AI Verdict result */}
      {c.status === 2 && c.verdictReason && (
        <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-sm p-5 mb-6">
          <p className="text-xs text-emerald-400 uppercase tracking-widest font-mono mb-2">AI Verdict</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{c.verdictReason}</p>
        </div>
      )}

      {/* Pending verdict preview (before submitting on-chain) */}
      {pendingVerdict && (
        <div className="border border-amber-500/30 bg-amber-500/5 rounded-sm p-5 mb-6">
          <p className="text-xs text-amber-400 uppercase tracking-widest font-mono mb-2">AI Verdict — Ready to Submit</p>
          <p className="text-sm text-zinc-300 leading-relaxed mb-3">{pendingVerdict.reason}</p>
          <p className="text-xs text-zinc-500">
            Winner: <span className="text-white font-mono">{shortenAddress(pendingVerdict.winner)}</span>
          </p>
        </div>
      )}

      {/* Payout preview */}
      {c.status !== 2 && c.status !== 3 && c.status !== 4 && (
        <div className="border border-zinc-800 rounded-sm p-4 mb-6 flex items-center justify-between text-sm bg-zinc-900/30">
          <span className="text-zinc-400">Winner receives</span>
          <span className="text-emerald-400 font-bold font-mono">{formatMON(payout)} MON</span>
        </div>
      )}

      {/* Errors */}
      {(writeError || oracleError) && (
        <div className="border border-red-500/30 bg-red-500/10 rounded-sm px-4 py-3 text-sm text-red-400 mb-4">
          {oracleError ?? (writeError as any)?.shortMessage ?? writeError?.message}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {!isConnected ? (
          <ConnectButton />
        ) : (
          <>
            {/* Accept */}
            {canAccept && !isExpiredUnaccepted && (
              <button
                onClick={handleAccept}
                disabled={isPending || isConfirming}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-black font-bold rounded-sm hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isPending ? "Confirm in wallet…" : "Accepting…"}
                  </>
                ) : (
                  `Accept Challenge — Stake ${formatMON(c.stake)} MON`
                )}
              </button>
            )}

            {/* Cancel */}
            {isCreator && c.status === 0 && !isExpiredUnaccepted && (
              <button
                onClick={handleCancel}
                disabled={isPending || isConfirming}
                className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/40 text-red-400 text-sm font-medium rounded-sm hover:border-red-500 hover:bg-red-500/5 disabled:opacity-50 transition-colors"
              >
                {isPending || isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel & Withdraw Stake"}
              </button>
            )}

            {/* Claim expired */}
            {isExpiredUnaccepted && (
              <button
                onClick={handleClaimExpired}
                disabled={isPending || isConfirming}
                className="w-full flex items-center justify-center gap-2 py-3.5 border border-zinc-700 text-zinc-300 text-sm font-medium rounded-sm hover:border-zinc-500 disabled:opacity-50 transition-colors"
              >
                {isPending || isConfirming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Claim Expired — Refund Stake
                  </>
                )}
              </button>
            )}

            {/* Oracle: Get AI verdict */}
            {canResolve && !pendingVerdict && (
              <button
                onClick={handleGetVerdict}
                disabled={oracleLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 border border-emerald-500/50 text-emerald-400 font-semibold rounded-sm hover:bg-emerald-500/10 disabled:opacity-50 transition-colors"
              >
                {oracleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is reading the evidence…
                  </>
                ) : (
                  <>
                    <Gavel className="w-4 h-4" />
                    Get AI Verdict
                  </>
                )}
              </button>
            )}

            {/* Oracle: Submit verdict on-chain */}
            {pendingVerdict && (
              <button
                onClick={handleSubmitVerdict}
                disabled={isPending || isConfirming}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-black font-bold rounded-sm hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isPending ? "Confirm in wallet…" : "Submitting verdict…"}
                  </>
                ) : (
                  <>
                    <Gavel className="w-4 h-4" />
                    Submit Verdict On-Chain
                  </>
                )}
              </button>
            )}

            {/* Waiting states */}
            {c.status === 1 && !canResolve && (
              <div className="w-full py-3.5 border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm font-medium rounded-sm text-center">
                Accepted — Awaiting resolve window ({formatTimeLeft(c.resolveDeadline)} left)
              </div>
            )}

            {c.status === 2 && (
              <div className="w-full py-3.5 border border-blue-500/30 bg-blue-500/5 text-blue-400 text-sm font-medium rounded-sm text-center">
                Resolved — Winner has been paid
              </div>
            )}
          </>
        )}
      </div>

      {/* Explorer link */}
      <div className="mt-8 pt-6 border-t border-zinc-800">
        <a
          href={`https://testnet.monadexplorer.com/address/${GREENMARKET_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View contract on Monad Explorer
        </a>
      </div>
    </div>
  );
}
