import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { MONAD_TESTNET } from "./contract";

export const wagmiConfig = getDefaultConfig({
  appName: "GreenMarket",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "2b7d5a2b4c6e8f1a3d5e7c9b0f2a4d6e",
  chains: [MONAD_TESTNET],
  ssr: true,
});
