import { createConfig, http } from "wagmi";
import { injected, coinbaseWallet } from "wagmi/connectors";
import { MONAD_TESTNET } from "./contract";

export const wagmiConfig = createConfig({
  chains: [MONAD_TESTNET],
  connectors: [
    injected({ target: "metaMask" }),
    injected({ target: "phantom" }),
    coinbaseWallet({ appName: "GreenMarket" }),
    injected(),
  ],
  transports: {
    [MONAD_TESTNET.id]: http("https://testnet-rpc.monad.xyz"),
  },
  ssr: true,
});
