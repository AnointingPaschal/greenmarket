import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rabbyWallet,
  coinbaseWallet,
  phantomWallet,
  trustWallet,
  braveWallet,
  okxWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { MONAD_TESTNET } from "./contract";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, rabbyWallet, coinbaseWallet, phantomWallet, trustWallet, braveWallet, okxWallet],
    },
  ],
  {
    appName: "GreenMarket",
    projectId: "dummy", // required by the type but WalletConnect is not used
  }
);

export const wagmiConfig = createConfig({
  chains: [MONAD_TESTNET],
  connectors,
  transports: {
    [MONAD_TESTNET.id]: http("https://testnet-rpc.monad.xyz"),
  },
  ssr: true,
});
