import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { MONAD_TESTNET } from "./contract";

export const wagmiConfig = createConfig({
  chains: [MONAD_TESTNET],
  connectors: [injected()],
  transports: {
    [MONAD_TESTNET.id]: http("https://testnet-rpc.monad.xyz"),
  },
  ssr: true,
});
