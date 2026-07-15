import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { MONAD_TESTNET } from "./contract";

export const wagmiConfig = getDefaultConfig({
  appName: "GreenMarket",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [MONAD_TESTNET],
  ssr: true,
});
