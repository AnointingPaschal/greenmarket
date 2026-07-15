import { createConfig, http } from "wagmi";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { MONAD_TESTNET } from "./contract";

export const wagmiConfig = createConfig({
  chains: [MONAD_TESTNET],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "GreenMarket" }),
  ],
  transports: {
    [MONAD_TESTNET.id]: http("https://testnet-rpc.monad.xyz"),
  },
  ssr: true,
});
