import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { MONAD_TESTNET } from "./contract";

export const wagmiConfig = getDefaultConfig({
  appName: "GreenMarket",
  projectId: "b54d8db0b4f27f44e9b2c3d5a1e6f7a8",
  chains: [MONAD_TESTNET],
  ssr: true,
});
