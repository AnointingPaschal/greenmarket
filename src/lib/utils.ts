import { formatEther } from "viem";

export function shortenAddress(addr: string): string {
  if (!addr || addr === "0x0000000000000000000000000000000000000000") return "Open";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatMON(wei: bigint, decimals = 4): string {
  const eth = formatEther(wei);
  const num = parseFloat(eth);
  return num.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function formatTimeLeft(ts: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = Number(ts) - now;
  if (diff <= 0) return "Expired";
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDate(ts: bigint): string {
  return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isZeroAddress(addr: string): boolean {
  return addr === "0x0000000000000000000000000000000000000000";
}

export function secondsFromNow(hours: number): number {
  return hours * 3600;
}
